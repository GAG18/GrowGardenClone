import { 
  users, 
  tradingItems, 
  tradeAds, 
  chatMessages,
  vouches,
  type User, 
  type InsertUser,
  type TradingItem,
  type InsertTradingItem,
  type TradeAd,
  type InsertTradeAd,
  type ChatMessage,
  type InsertChatMessage,
  type Vouch,
  type InsertVouch
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Trading Item methods  
  getAllTradingItems(): Promise<TradingItem[]>;
  getTradingItem(id: number): Promise<TradingItem | undefined>;
  createTradingItem(item: InsertTradingItem): Promise<TradingItem>;
  updateTradingItemValue(id: number, newValue: number): Promise<TradingItem | undefined>;

  // Trade Ad methods
  getAllTradeAds(): Promise<TradeAd[]>;
  getTradeAd(id: number): Promise<TradeAd | undefined>;
  createTradeAd(ad: InsertTradeAd): Promise<TradeAd>;
  updateTradeAdStatus(id: number, status: string): Promise<TradeAd | undefined>;

  // Chat Message methods
  getChatMessagesByTradeAd(tradeAdId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Vouch methods
  getVouchesByUser(userId: number): Promise<Vouch[]>;
  createVouch(vouch: InsertVouch): Promise<Vouch>;

  // Stats methods
  getCommunityStats(): Promise<any>;
  getCurrentWeather(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tradingItems: Map<number, TradingItem>;
  private tradeAds: Map<number, TradeAd>;
  private chatMessages: Map<number, ChatMessage>;
  private vouches: Map<number, Vouch>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.tradingItems = new Map();
    this.tradeAds = new Map();
    this.chatMessages = new Map();
    this.vouches = new Map();
    this.currentId = 1;

    // Initialize with data from Excel
    this.initializeMockData();
  }

  private initializeMockData() {
    // Excel data loading completely disabled for faster startup
    return;
// Excel data initialization skipped for faster startup
    console.log('Memory storage ready - using MongoDB for data');

    // Mock users
    const mockUsers = [
      {
        id: 1,
        username: "PetSimKing_2025",
        password: "hashed_password", 
        robloxUsername: "PetSimKing_2025",
        discordUsername: null,
        reputation: 127,
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        username: "RobloxPro_Gaming123",
        password: "hashed_password",
        robloxUsername: "RobloxPro_Gaming123",
        discordUsername: "RobloxPro#1234",
        reputation: 89,
        createdAt: new Date('2024-02-20')
      }
    ];

    mockUsers.forEach(user => {
      this.users.set(user.id, user as User);
      this.currentId = Math.max(this.currentId, user.id + 1);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      reputation: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Trading Item methods
  async getAllTradingItems(): Promise<TradingItem[]> {
    return Array.from(this.tradingItems.values());
  }

  async getTradingItem(id: number): Promise<TradingItem | undefined> {
    return this.tradingItems.get(id);
  }

  async createTradingItem(insertItem: InsertTradingItem): Promise<TradingItem> {
    const id = this.currentId++;
    const item: TradingItem = { 
      ...insertItem, 
      id,
      tradeable: insertItem.tradeable ?? true,
      updatedAt: new Date()
    };
    this.tradingItems.set(id, item);
    return item;
  }

  async updateTradingItemValue(id: number, newValue: number): Promise<TradingItem | undefined> {
    const item = this.tradingItems.get(id);
    if (!item) return undefined;

    const updatedItem = { 
      ...item, 
      previousValue: item.currentValue,
      currentValue: newValue,
      updatedAt: new Date()
    };
    this.tradingItems.set(id, updatedItem);
    return updatedItem;
  }

  // Trade Ad methods
  async getAllTradeAds(): Promise<TradeAd[]> {
    return Array.from(this.tradeAds.values());
  }

  async getTradeAd(id: number): Promise<TradeAd | undefined> {
    return this.tradeAds.get(id);
  }

  async createTradeAd(insertAd: InsertTradeAd): Promise<TradeAd> {
    const id = this.currentId++;
    const ad: TradeAd = { 
      ...insertAd, 
      id,
      status: "active",
      createdAt: new Date()
    };
    this.tradeAds.set(id, ad);
    return ad;
  }

  async updateTradeAdStatus(id: number, status: string): Promise<TradeAd | undefined> {
    const ad = this.tradeAds.get(id);
    if (!ad) return undefined;

    const updatedAd = { ...ad, status };
    this.tradeAds.set(id, updatedAd);
    return updatedAd;
  }

  // Chat Message methods
  async getChatMessagesByTradeAd(tradeAdId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(msg => msg.tradeAdId === tradeAdId);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentId++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id,
      createdAt: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Vouch methods
  async getVouchesByUser(userId: number): Promise<Vouch[]> {
    return Array.from(this.vouches.values()).filter(vouch => vouch.toUserId === userId);
  }

  async createVouch(insertVouch: InsertVouch): Promise<Vouch> {
    const id = this.currentId++;
    const vouch: Vouch = { 
      ...insertVouch, 
      id,
      createdAt: new Date()
    };
    this.vouches.set(id, vouch);
    return vouch;
  }

  // Stats methods
  async getCommunityStats(): Promise<any> {
    return {
      activeTraders: 1247,
      totalTrades: 240000,
      onlineNow: 892,
      discordMembers: 15000,
      dailyTrades: 500
    };
  }

  async getCurrentWeather(): Promise<any> {
    return {
      current: "Rainy Season",
      effect: "+20% Water Crop Growth",
      icon: "🌧️"
    };
  }
}

export const storage = new MemStorage();