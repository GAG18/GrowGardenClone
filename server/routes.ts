import type { Express } from "express";
import { createServer, type Server } from "http";
import { mongoStorage } from "./mongodb-storage";
import { storage as memStorage } from "./storage";
import { initializeGridFS, getImageUrl, uploadItemImages } from "./image-storage";

// Auto-detect which storage to use based on MongoDB connection
let storage: any = memStorage;
let isUsingMongo = false;

async function initializeStorage() {
  try {
    await mongoStorage.init();
    console.log('✅ MongoDB Atlas connected successfully - using cloud database');
    storage = mongoStorage;
    isUsingMongo = true;
    
    // Initialize GridFS for image storage
    setTimeout(() => {
      try {
        initializeGridFS();
      } catch (error) {
        console.log('GridFS initialization delayed, will retry...');
      }
    }, 1000);
  } catch (error) {
    console.log('⚠️  MongoDB Atlas connection failed - using local memory storage');
    console.log('   Fix: Configure Network Access in MongoDB Atlas to allow all IPs (0.0.0.0/0)');
    storage = memStorage;
    isUsingMongo = false;
  }
}

// Initialize storage on startup
initializeStorage();
import { insertTradingItemSchema, insertTradeAdSchema, insertChatMessageSchema } from "@shared/schema";
import { proxyImage } from './image-proxy';

export async function registerRoutes(app: Express): Promise<Server> {
  // Comprehensive OAuth diagnostic endpoint
  app.get('/api/oauth-diagnostic', async (req, res) => {
    try {
      const clientId = process.env.ROBLOX_CLIENT_ID;
      const clientSecret = process.env.ROBLOX_CLIENT_SECRET;
      
      const results = {
        timestamp: new Date().toISOString(),
        credentials: {
          hasClientId: !!clientId,
          hasClientSecret: !!clientSecret,
          clientIdLength: clientId?.length || 0,
          clientIdMasked: clientId ? `${clientId.substring(0, 4)}...${clientId.substring(clientId.length - 4)}` : 'missing'
        },
        tests: {}
      };

      if (!clientId) {
        return res.json({ ...results, error: 'Client ID missing' });
      }

      // Test 1: Authorization endpoint
      const authUrl = `https://apis.roblox.com/oauth/v1/authorize?client_id=${clientId}&response_type=code&redirect_uri=http://localhost:5000/auth/callback&scope=openid+profile&state=test`;
      
      try {
        const authResponse = await fetch(authUrl, { method: 'HEAD' });
        results.tests.authorization = {
          url: authUrl,
          status: authResponse.status,
          statusText: authResponse.statusText,
          headers: Object.fromEntries(authResponse.headers.entries()),
          working: authResponse.status === 200
        };
      } catch (error) {
        results.tests.authorization = { error: error.message };
      }

      // Test 2: Try different scope format
      const authUrl2 = `https://apis.roblox.com/oauth/v1/authorize?client_id=${clientId}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fcallback&scope=openid%20profile&state=test`;
      
      try {
        const authResponse2 = await fetch(authUrl2, { method: 'HEAD' });
        results.tests.authorizationEncoded = {
          status: authResponse2.status,
          working: authResponse2.status === 200
        };
      } catch (error) {
        results.tests.authorizationEncoded = { error: error.message };
      }

      // Test 3: Token endpoint (should return 400 without proper params, not 404)
      try {
        const tokenResponse = await fetch('https://apis.roblox.com/oauth/v1/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'grant_type=authorization_code'
        });
        
        results.tests.tokenEndpoint = {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          endpointExists: tokenResponse.status !== 404
        };
      } catch (error) {
        results.tests.tokenEndpoint = { error: error.message };
      }

      // Analysis
      results.analysis = {
        likely_issues: [],
        recommendations: []
      };

      if (results.tests.authorization?.status === 404) {
        results.analysis.likely_issues.push('OAuth application not published or active');
        results.analysis.recommendations.push('Check application status in Creator Dashboard');
      }

      if (results.tests.authorization?.status === 400) {
        results.analysis.likely_issues.push('Invalid redirect URI or parameters');
        results.analysis.recommendations.push('Verify redirect URI matches exactly');
      }

      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Diagnostic failed', details: error.message });
    }
  });

  // Trading Items API
  app.get("/api/trading-items", async (req, res) => {
    try {
      const items = await storage.getAllTradingItems();
      // Only return tradeable items
      const tradeableItems = items.filter(item => item.tradeable !== false);
      res.json(tradeableItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trading items" });
    }
  });

  app.get("/api/trading-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getTradingItem(id);
      if (!item) {
        return res.status(404).json({ message: "Trading item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trading item" });
    }
  });

  app.post("/api/trading-items", async (req, res) => {
    try {
      const validatedData = insertTradingItemSchema.parse(req.body);
      const item = await storage.createTradingItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid trading item data" });
    }
  });

  // Trade Ads API
  app.get("/api/trade-ads", async (req, res) => {
    try {
      const ads = await storage.getAllTradeAds();
      res.json(ads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trade ads" });
    }
  });

  app.post("/api/trade-ads", async (req, res) => {
    try {
      const validatedData = insertTradeAdSchema.parse(req.body);
      const ad = await storage.createTradeAd(validatedData);
      res.status(201).json(ad);
    } catch (error) {
      console.error('Trade ad creation error:', error);
      res.status(400).json({ message: "Invalid trade ad data" });
    }
  });

  // Image proxy route to handle CORS issues with PostImg
  app.get("/api/image-proxy", proxyImage);

  // Chat Messages API
  app.get("/api/chat-messages/:tradeAdId", async (req, res) => {
    try {
      const tradeAdId = parseInt(req.params.tradeAdId);
      const messages = await storage.getChatMessagesByTradeAd(tradeAdId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat-messages", async (req, res) => {
    try {
      const validatedData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid chat message data" });
    }
  });

  // Community Stats API
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getCommunityStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community stats" });
    }
  });

  // Weather API
  app.get("/api/weather", async (req, res) => {
    try {
      const weather = await storage.getCurrentWeather();
      res.json(weather);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  // Roblox OAuth endpoints
  app.post("/api/auth/roblox/callback", async (req, res) => {
    try {
      const { code, state } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: "Authorization code required" });
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://apis.roblox.com/oauth/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.ROBLOX_CLIENT_ID || '',
          client_secret: process.env.ROBLOX_CLIENT_SECRET || '',
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: `${req.headers.origin}/auth/callback`
        })
      });

      if (!tokenResponse.ok) {
        console.error('Token exchange failed:', await tokenResponse.text());
        return res.status(400).json({ error: "Failed to exchange authorization code" });
      }

      const tokenData = await tokenResponse.json();
      
      // Get user info using access token
      const userResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });

      if (!userResponse.ok) {
        console.error('User info fetch failed:', await userResponse.text());
        return res.status(400).json({ error: "Failed to get user information" });
      }

      const userData = await userResponse.json();
      
      // Get profile picture from Roblox API
      let profileImageUrl = `https://ui-avatars.com/api/?name=${userData.preferred_username}&background=8b5cf6&color=fff&size=150`;
      
      try {
        const avatarResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userData.sub}&size=150x150&format=Png&isCircular=false`);
        if (avatarResponse.ok) {
          const avatarData = await avatarResponse.json();
          if (avatarData.data && avatarData.data[0] && avatarData.data[0].imageUrl) {
            profileImageUrl = avatarData.data[0].imageUrl;
          }
        }
      } catch (avatarError) {
        console.log('Avatar fetch failed, using fallback');
      }

      // Create or update user in database
      const robloxUser = {
        id: parseInt(userData.sub),
        username: userData.preferred_username,
        displayName: userData.name || userData.preferred_username,
        profileImageUrl: profileImageUrl
      };

      // Store user in database
      try {
        await storage.createUser({
          username: robloxUser.username,
          password: 'oauth_user', // OAuth users don't need passwords
          robloxUsername: robloxUser.username,
          reputation: 0
        });
      } catch (dbError) {
        // User might already exist, that's fine
        console.log('User already exists or db error:', dbError);
      }

      res.json(robloxUser);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  // Get current user info (placeholder - would need session management)
  app.get("/api/auth/user", async (req, res) => {
    res.json({ user: null }); // Would implement session-based auth here
  });

  const httpServer = createServer(app);
  return httpServer;
}
