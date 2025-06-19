import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  serial,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for Roblox authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // Roblox user ID as string
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: varchar("username").notNull().unique(), // Roblox username
  reputation: integer("reputation").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  userId: varchar("user_id").notNull().references(() => users.id), // Reference to Roblox user ID
  title: text("title").notNull(),
  description: text("description"),
  offeringItems: text("offering_items").notNull(), // JSON array
  wantingItems: text("wanting_items").notNull(), // JSON array
  status: text("status").default("active"), // "active", "completed", "cancelled"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  // Performance indexes for high-traffic queries
  index("idx_trade_ads_user_id").on(table.userId),
  index("idx_trade_ads_status").on(table.status),
  index("idx_trade_ads_created_at").on(table.createdAt),
  index("idx_trade_ads_user_status").on(table.userId, table.status),
  index("idx_trade_ads_status_created").on(table.status, table.createdAt.desc()),
]);

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  tradeAdId: integer("trade_ad_id").notNull().references(() => tradeAds.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  // Indexes for chat message queries
  index("idx_chat_trade_ad_id").on(table.tradeAdId),
  index("idx_chat_user_id").on(table.userId),
  index("idx_chat_created_at").on(table.createdAt.desc()),
]);

export const vouches = pgTable("vouches", {
  id: serial("id").primaryKey(),
  fromUserId: varchar("from_user_id").notNull().references(() => users.id),
  toUserId: varchar("to_user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relationships for better query performance
export const usersRelations = relations(users, ({ many }) => ({
  tradeAds: many(tradeAds),
  chatMessages: many(chatMessages),
  sentVouches: many(vouches, { relationName: "sentVouches" }),
  receivedVouches: many(vouches, { relationName: "receivedVouches" }),
}));

export const tradeAdsRelations = relations(tradeAds, ({ one, many }) => ({
  user: one(users, {
    fields: [tradeAds.userId],
    references: [users.id],
  }),
  chatMessages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
  tradeAd: one(tradeAds, {
    fields: [chatMessages.tradeAdId],
    references: [tradeAds.id],
  }),
}));

export const vouchesRelations = relations(vouches, ({ one }) => ({
  fromUser: one(users, {
    fields: [vouches.fromUserId],
    references: [users.id],
    relationName: "sentVouches",
  }),
  toUser: one(users, {
    fields: [vouches.toUserId],
    references: [users.id],
    relationName: "receivedVouches",
  }),
}));

// Schema for inserting/updating users (for Roblox OAuth)
export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertTradingItemSchema = createInsertSchema(tradingItems).omit({
  id: true,
  updatedAt: true,
});

export const insertTradeAdSchema = createInsertSchema(tradeAds).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type TradingItem = typeof tradingItems.$inferSelect;
export type InsertTradingItem = z.infer<typeof insertTradingItemSchema>;
export type TradeAd = typeof tradeAds.$inferSelect;
export type InsertTradeAd = z.infer<typeof insertTradeAdSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type Vouch = typeof vouches.$inferSelect;
export type InsertVouch = z.infer<typeof insertVouchSchema>;
