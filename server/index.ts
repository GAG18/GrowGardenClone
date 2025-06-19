import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import crypto from "crypto";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Helper function to generate ETag from content
function generateETag(content: string): string {
  return `"${crypto.createHash('md5').update(content).digest('hex')}"`;
}

// ETag middleware for API responses
app.use('/api', (req, res, next) => {
  // Only apply to GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const originalJson = res.json;
  res.json = function(data: any) {
    const content = JSON.stringify(data);
    const etag = generateETag(content);
    
    // Set ETag header
    res.set('ETag', etag);
    
    // Check if client already has this version
    const clientETag = req.headers['if-none-match'];
    if (clientETag === etag) {
      res.status(304).end();
      return res;
    }
    
    // Call original json method
    return originalJson.call(this, data);
  };
  
  next();
});

// Enable gzip compression for all responses
app.use(compression({
  // Compress all responses
  filter: (req, res) => {
    // Don't compress responses with this request header
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression for all other responses
    return compression.filter(req, res);
  },
  // Compression level (1-9, 6 is default)
  level: 6,
  // Only compress responses larger than this threshold (in bytes)
  threshold: 1024,
  // Set memory level for zlib (1-9, 8 is default)
  memLevel: 8
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// HTTP Caching middleware
app.use((req, res, next) => {
  // Set security headers
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  });

  // Set caching headers based on request type
  const path = req.path;
  const isProduction = app.get("env") === "production";
  
  if (isProduction) {
    // Cache static assets aggressively (JS, CSS, images, fonts)
    if (path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp|avif)$/)) {
      res.set({
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
        'Expires': new Date(Date.now() + 31536000 * 1000).toUTCString()
      });
    }
    // Cache API responses with specific strategies
    else if (path.startsWith('/api/')) {
      if (path.includes('/stock') || path.includes('/value-list')) {
        // Stock data changes frequently, cache for 5 minutes
        res.set({
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
          'Vary': 'Accept-Encoding'
        });
      } else if (path.includes('/image-proxy') || path.includes('/item-image')) {
        // Images can be cached much longer
        res.set({
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=172800', // 1 day
          'Vary': 'Accept-Encoding'
        });
      } else if (path.includes('/trading-items') || path.includes('/trade-ads')) {
        // Trading data changes moderately, cache for 2 minutes
        res.set({
          'Cache-Control': 'public, max-age=120, stale-while-revalidate=240',
          'Vary': 'Accept-Encoding'
        });
      } else if (path.includes('/auth/') || path.includes('/chat-messages')) {
        // Auth and chat should not be cached
        res.set({
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
      } else if (path.includes('/stats') || path.includes('/weather')) {
        // General stats can be cached for 10 minutes
        res.set({
          'Cache-Control': 'public, max-age=600, stale-while-revalidate=1200',
          'Vary': 'Accept-Encoding'
        });
      } else {
        // Default API caching - 1 minute
        res.set({
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
          'Vary': 'Accept-Encoding'
        });
      }
    }
  } else {
    // Development mode - disable caching except for images
    if (path.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif)$/)) {
      res.set({
        'Cache-Control': 'public, max-age=3600', // 1 hour in dev
        'Vary': 'Accept-Encoding'
      });
    } else {
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
    }
  }

  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error('Server error:', {
      message: err.message,
      stack: err.stack,
      url: _req.url,
      method: _req.method,
      timestamp: new Date().toISOString()
    });
    
    if (!res.headersSent) {
      res.status(status).json({ 
        message: status === 500 ? "Internal Server Error" : message 
      });
    }
  });

  const isProduction = process.env.NODE_ENV === "production";
  
  if (isProduction) {
    serveStatic(app);
  } else {
    await setupVite(app, server);
  }

  const port = 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`Server running on port ${port} in ${isProduction ? 'production' : 'development'} mode`);
  });
})();
