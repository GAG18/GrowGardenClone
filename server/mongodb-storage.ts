import { connectToDatabase, TradingItem, User, TradeAd } from './database.js';
import type { IStorage } from './storage.js';
import type { 
  User as UserType, 
  InsertUser, 
  TradingItem as TradingItemType, 
  InsertTradingItem,
  TradeAd as TradeAdType,
  InsertTradeAd,
  ChatMessage,
  InsertChatMessage,
  Vouch,
  InsertVouch
} from '../shared/schema.js';

export class MongoStorage implements IStorage {
  private connected = false;

  async init() {
    if (!this.connected) {
      await connectToDatabase();
      this.connected = true;
    }
  }

  // User methods
  async getUser(id: number): Promise<UserType | undefined> {
    await this.init();
    const user = await User.findById(id);
    return user ? this.convertUser(user) : undefined;
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    await this.init();
    const user = await User.findOne({ username });
    return user ? this.convertUser(user) : undefined;
  }

  async createUser(user: InsertUser): Promise<UserType> {
    await this.init();
    const newUser = await User.create(user);
    return this.convertUser(newUser);
  }

  // Trading Item methods
  async getAllTradingItems(): Promise<TradingItemType[]> {
    await this.init();
    const items = await TradingItem.find({ tradeable: true });
    return items.map(item => this.convertTradingItem(item));
  }

  async getTradingItem(id: number): Promise<TradingItemType | undefined> {
    await this.init();
    const item = await TradingItem.findById(id);
    return item ? this.convertTradingItem(item) : undefined;
  }

  async createTradingItem(item: InsertTradingItem): Promise<TradingItemType> {
    await this.init();
    const newItem = await TradingItem.create(item);
    return this.convertTradingItem(newItem);
  }

  async updateTradingItemValue(id: number, newValue: number): Promise<TradingItemType | undefined> {
    await this.init();
    const item = await TradingItem.findByIdAndUpdate(
      id,
      { currentValue: newValue, updatedAt: new Date() },
      { new: true }
    );
    return item ? this.convertTradingItem(item) : undefined;
  }

  // Trade Ad methods
  async getAllTradeAds(): Promise<TradeAdType[]> {
    await this.init();
    const ads = await TradeAd.find().sort({ createdAt: -1 });
    return ads.map(ad => this.convertTradeAd(ad));
  }

  async getTradeAd(id: number): Promise<TradeAdType | undefined> {
    await this.init();
    const ad = await TradeAd.findById(id);
    return ad ? this.convertTradeAd(ad) : undefined;
  }

  async createTradeAd(ad: InsertTradeAd): Promise<TradeAdType> {
    await this.init();
    // Convert userId from number to ObjectId format for MongoDB  
    const adData = {
      ...ad,
      userId: ad.userId || 1 // Use default user ID if not provided
    };
    const newAd = await TradeAd.create(adData);
    return this.convertTradeAd(newAd);
  }

  async updateTradeAdStatus(id: number, status: string): Promise<TradeAdType | undefined> {
    await this.init();
    const ad = await TradeAd.findByIdAndUpdate(id, { status }, { new: true });
    return ad ? this.convertTradeAd(ad) : undefined;
  }

  // Chat Message methods (placeholder - would need separate schema)
  async getChatMessagesByTradeAd(tradeAdId: number): Promise<ChatMessage[]> {
    return [];
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    return {
      id: 1,
      message: message.message,
      userId: message.userId || null,
      tradeAdId: message.tradeAdId || null,
      createdAt: new Date()
    } as ChatMessage;
  }

  // Vouch methods (placeholder - would need separate schema)
  async getVouchesByUser(userId: number): Promise<Vouch[]> {
    return [];
  }

  async createVouch(vouch: InsertVouch): Promise<Vouch> {
    return {
      id: 1,
      fromUserId: vouch.fromUserId || null,
      toUserId: vouch.toUserId || null,
      rating: vouch.rating,
      comment: vouch.comment || null,
      createdAt: new Date()
    } as Vouch;
  }

  // Stats methods
  async getCommunityStats(): Promise<any> {
    await this.init();
    const totalItems = await TradingItem.countDocuments();
    const totalTradeAds = await TradeAd.countDocuments();
    const totalUsers = await User.countDocuments();
    
    return {
      totalItems,
      totalTradeAds,
      totalUsers,
      activeTraders: totalUsers,
      totalTrades: totalTradeAds
    };
  }

  async getCurrentWeather(): Promise<any> {
    return {
      current: "Sunny",
      effect: "+15% Crop Growth",
      icon: "☀️"
    };
  }

  // Helper methods to convert MongoDB documents to expected format
  private convertUser(user: any): UserType {
    return {
      id: user._id.toString(),
      username: user.username,
      password: user.password,
      robloxUsername: user.robloxUsername || null,
      discordUsername: user.discordUsername || null,
      reputation: user.reputation || null,
      createdAt: user.createdAt || null
    };
  }

  private convertTradingItem(item: any): TradingItemType {
    return {
      id: item._id.toString(),
      name: item.name,
      type: item.type,
      rarity: item.rarity,
      currentValue: item.currentValue,
      previousValue: item.previousValue || null,
      changePercent: item.changePercent || null,
      imageUrl: item.imageUrl || null,
      tradeable: item.tradeable || null,
      updatedAt: item.updatedAt || null
    };
  }

  private convertTradeAd(ad: any): TradeAdType {
    return {
      id: ad._id.toString(),
      userId: ad.userId ? ad.userId.toString() : null,
      title: ad.title,
      description: ad.description || null,
      offeringItems: ad.offeringItems,
      wantingItems: ad.wantingItems,
      status: ad.status || null,
      createdAt: ad.createdAt || null
    };
  }
}

export const mongoStorage = new MongoStorage();