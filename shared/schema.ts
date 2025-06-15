import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  robloxUsername: text("roblox_username"),
  discordUsername: text("discord_username"),
  reputation: integer("reputation").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tradingItems = pgTable("trading_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "crop", "gear", "egg", etc.
  rarity: text("rarity").notNull(), // "common", "uncommon", "rare", "epic", "legendary", etc.
  currentValue: integer("current_value").notNull(),
  previousValue: integer("previous_value"),
  changePercent: text("change_percent"),
  imageUrl: text("image_url"),
  tradeable: boolean("tradeable").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tradeAds = pgTable("trade_ads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  offeringItems: text("offering_items").notNull(), // JSON array
  wantingItems: text("wanting_items").notNull(), // JSON array
  status: text("status").default("active"), // "active", "completed", "cancelled"
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  tradeAdId: integer("trade_ad_id").references(() => tradeAds.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vouches = pgTable("vouches", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").references(() => users.id),
  toUserId: integer("to_user_id").references(() => users.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTradingItemSchema = createInsertSchema(tradingItems).omit({
  id: true,
  updatedAt: true,
});

export const insertTradeAdSchema = createInsertSchema(tradeAds).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertVouchSchema = createInsertSchema(vouches).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type TradingItem = typeof tradingItems.$inferSelect;
export type InsertTradingItem = z.infer<typeof insertTradingItemSchema>;
export type TradeAd = typeof tradeAds.$inferSelect;
export type InsertTradeAd = z.infer<typeof insertTradeAdSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type Vouch = typeof vouches.$inferSelect;
export type InsertVouch = z.infer<typeof insertVouchSchema>;
