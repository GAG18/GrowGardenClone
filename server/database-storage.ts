import {
  users,
  tradeAds,
  chatMessages,
  vouches,
  tradingItems,
  type User,
  type UpsertUser,
  type TradeAd,
  type InsertTradeAd,
  type ChatMessage,
  type InsertChatMessage,
  type Vouch,
  type InsertVouch,
  type TradingItem,
  type InsertTradingItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations for Roblox OAuth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: any): Promise<User> {
    // For compatibility with existing code, but shouldn't be used with OAuth
    throw new Error("Use upsertUser for OAuth authentication");
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Trading Item operations
  async getAllTradingItems(): Promise<TradingItem[]> {
    return await db.select().from(tradingItems).orderBy(tradingItems.name);
  }

  async getTradingItem(id: number): Promise<TradingItem | undefined> {
    const [item] = await db.select().from(tradingItems).where(eq(tradingItems.id, id));
    return item;
  }

  async createTradingItem(item: InsertTradingItem): Promise<TradingItem> {
    const [newItem] = await db.insert(tradingItems).values(item).returning();
    return newItem;
  }

  async updateTradingItemValue(id: number, newValue: number): Promise<TradingItem | undefined> {
    const [item] = await db
      .update(tradingItems)
      .set({ 
        currentValue: newValue,
        updatedAt: new Date(),
      })
      .where(eq(tradingItems.id, id))
      .returning();
    return item;
  }

  // Trade Ad operations optimized for high traffic
  async getAllTradeAds(): Promise<any[]> {
    // Optimized query with pagination support and proper indexing
    const results = await db
      .select({
        id: tradeAds.id,
        userId: tradeAds.userId,
        title: tradeAds.title,
        description: tradeAds.description,
        offeringItems: tradeAds.offeringItems,
        wantingItems: tradeAds.wantingItems,
        status: tradeAds.status,
        createdAt: tradeAds.createdAt,
        updatedAt: tradeAds.updatedAt,
        username: users.username,
        profileImageUrl: users.profileImageUrl
      })
      .from(tradeAds)
      .leftJoin(users, eq(tradeAds.userId, users.id))
      .where(eq(tradeAds.status, 'active')) // Use indexed status field
      .orderBy(desc(tradeAds.createdAt))
      .limit(100); // Limit results for performance
    
    return results;
  }

  // Paginated query for better performance with large datasets
  async getTradeAdsPaginated(page: number = 1, limit: number = 20): Promise<any[]> {
    const offset = (page - 1) * limit;
    const results = await db
      .select({
        id: tradeAds.id,
        userId: tradeAds.userId,
        title: tradeAds.title,
        description: tradeAds.description,
        offeringItems: tradeAds.offeringItems,
        wantingItems: tradeAds.wantingItems,
        status: tradeAds.status,
        createdAt: tradeAds.createdAt,
        updatedAt: tradeAds.updatedAt,
        username: users.username,
        profileImageUrl: users.profileImageUrl
      })
      .from(tradeAds)
      .leftJoin(users, eq(tradeAds.userId, users.id))
      .where(eq(tradeAds.status, 'active'))
      .orderBy(desc(tradeAds.createdAt))
      .limit(limit)
      .offset(offset);
    
    return results;
  }

  async getTradeAd(id: number): Promise<TradeAd | undefined> {
    const [ad] = await db.select().from(tradeAds).where(eq(tradeAds.id, id));
    return ad;
  }

  async createTradeAd(ad: InsertTradeAd): Promise<TradeAd> {
    // Use transaction for data consistency under high load
    return await db.transaction(async (tx) => {
      const [newAd] = await tx.insert(tradeAds).values(ad).returning();
      return newAd;
    });
  }

  // Batch creation for high-volume scenarios
  async createMultipleTradeAds(ads: InsertTradeAd[]): Promise<TradeAd[]> {
    return await db.transaction(async (tx) => {
      const results = await tx.insert(tradeAds).values(ads).returning();
      return results;
    });
  }

  async updateTradeAdStatus(id: number, status: string): Promise<TradeAd | undefined> {
    const [ad] = await db
      .update(tradeAds)
      .set({ 
        status,
        updatedAt: new Date(),
      })
      .where(eq(tradeAds.id, id))
      .returning();
    return ad;
  }

  // Chat Message operations
  async getChatMessagesByTradeAd(tradeAdId: number): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.tradeAdId, tradeAdId))
      .orderBy(chatMessages.createdAt);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  // Vouch operations
  async getVouchesByUser(userId: string): Promise<Vouch[]> {
    return await db
      .select()
      .from(vouches)
      .where(eq(vouches.toUserId, userId))
      .orderBy(desc(vouches.createdAt));
  }

  async createVouch(vouch: InsertVouch): Promise<Vouch> {
    const [newVouch] = await db.insert(vouches).values(vouch).returning();
    return newVouch;
  }

  // Stats operations (placeholder - implement as needed)
  async getCommunityStats(): Promise<any> {
    // Count total users, active trade ads, etc.
    const totalUsers = await db.$count(users);
    const activeTradeAds = await db.$count(tradeAds, eq(tradeAds.status, "active"));
    
    return {
      totalUsers,
      activeTradeAds,
      totalTradingItems: await db.$count(tradingItems),
    };
  }

  async getCurrentWeather(): Promise<any> {
    // Return mock weather data for the trading platform theme
    return {
      temperature: "Perfect Trading Weather",
      condition: "Clear Markets",
      humidity: "High Activity",
    };
  }
}

export const databaseStorage = new DatabaseStorage();