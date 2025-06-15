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
    // All tradeable items from Excel (130 items)
    const excelItems = [
      { name: "Carrot", type: "Crop", imageUrl: "https://i.postimg.cc/qv5dVtkL/Carrot.png", tradeable: true },
      { name: "Strawberry", type: "Crop", imageUrl: "https://i.postimg.cc/FFymdsZr/Strawberry.png", tradeable: true },
      { name: "Blueberry", type: "Crop", imageUrl: "https://i.postimg.cc/RV9SXZ7h/image.png", tradeable: true },
      { name: "Orange Tulip", type: "Crop", imageUrl: "https://i.postimg.cc/BQ3SM16P/Orange-Tulip.png", tradeable: true },
      { name: "Tomato", type: "Crop", imageUrl: "https://i.postimg.cc/MGhxR6ZW/image.png", tradeable: true },
      { name: "Corn", type: "Crop", imageUrl: "https://i.postimg.cc/0QG3Qrqh/Corn.png", tradeable: true },
      { name: "Daffodil", type: "Crop", imageUrl: "https://i.postimg.cc/Z57Jb7L6/Daffodil.png", tradeable: true },
      { name: "Watermelon", type: "Crop", imageUrl: "https://i.postimg.cc/kXsB3bsL/image.png", tradeable: true },
      { name: "Pumpkin", type: "Crop", imageUrl: "https://i.postimg.cc/3xWPBKgD/Pumpkin.png", tradeable: true },
      { name: "Apple", type: "Crop", imageUrl: "https://i.postimg.cc/d1MP3zZZ/Apple.png", tradeable: true },
      { name: "Bamboo", type: "Crop", imageUrl: "https://i.postimg.cc/5NshLHFV/Bamboo.png", tradeable: true },
      { name: "Coconut", type: "Crop", imageUrl: "https://i.postimg.cc/90JndS0p/Coconut.png", tradeable: true },
      { name: "Cactus", type: "Crop", imageUrl: "https://i.postimg.cc/0jssWL81/Cactus.png", tradeable: true },
      { name: "Dragon Fruit", type: "Crop", imageUrl: "https://i.postimg.cc/7Yq4g8sg/Dragon-Fruit.png", tradeable: true },
      { name: "Mango", type: "Crop", imageUrl: "https://i.postimg.cc/MGgxRnNT/Mango.png", tradeable: true },
      { name: "Grape", type: "Crop", imageUrl: "https://i.postimg.cc/0y3hXLfX/Grape.png", tradeable: true },
      { name: "Mushroom", type: "Crop", imageUrl: "https://i.postimg.cc/cHW9VZ8h/Mushroom.png", tradeable: true },
      { name: "Pepper", type: "Crop", imageUrl: "https://i.postimg.cc/59gq262W/image.png", tradeable: true },
      { name: "Pineapple", type: "Crop", imageUrl: "https://i.postimg.cc/jdPCpJx7/Pineapple.png", tradeable: true },
      { name: "Lily", type: "Crop", imageUrl: "https://i.postimg.cc/PrKk6C9z/Lily.png", tradeable: true },
      { name: "Star Fruit", type: "Crop", imageUrl: "https://i.postimg.cc/4xfZwKR6/Star-Fruit.png", tradeable: true },
      { name: "Acorn", type: "Crop", imageUrl: "https://i.postimg.cc/28PbTKLL/Acorn.png", tradeable: true },
      { name: "Cherry", type: "Crop", imageUrl: "https://i.postimg.cc/gcGRKtmw/Cherry.png", tradeable: true },
      { name: "White Flower", type: "Crop", imageUrl: "https://i.postimg.cc/wT8j98y6/White-Flower.png", tradeable: true },
      { name: "Blue Flower", type: "Crop", imageUrl: "https://i.postimg.cc/tgxRfzjF/Blue-Flower.png", tradeable: true },
      { name: "Red Flower", type: "Crop", imageUrl: "https://i.postimg.cc/Y0t9Kp6m/Red-Flower.png", tradeable: true },
      { name: "Sunflower", type: "Crop", imageUrl: "https://i.postimg.cc/28yj03SN/Sunflower.png", tradeable: true },
      { name: "Pine Cone", type: "Crop", imageUrl: "https://i.postimg.cc/nhHnC5Jh/Pine-Cone.png", tradeable: true },
      { name: "Clover", type: "Crop", imageUrl: "https://i.postimg.cc/ryKG7B3s/Clover.png", tradeable: true },
      { name: "Dandelion", type: "Crop", imageUrl: "https://i.postimg.cc/PrJBGr8J/Dandelion.png", tradeable: true },
      { name: "Strawberry (Special)", type: "Crop", imageUrl: "https://i.postimg.cc/8cTXy6C8/Strawberry-Special.png", tradeable: true },
      { name: "Disco Bee", type: "Pet", imageUrl: "https://i.postimg.cc/rF8QJGmT/Disco-Bee.png", tradeable: true },
      { name: "Butterfly", type: "Pet", imageUrl: "https://i.postimg.cc/9fLtJn9K/Butterfly.png", tradeable: true },
      { name: "Moth", type: "Pet", imageUrl: "https://i.postimg.cc/sD9QHWbp/Moth.png", tradeable: true },
      { name: "Tarantula Hawk", type: "Pet", imageUrl: "https://i.postimg.cc/MTX4Fk54/Tarantula-Hawk.png", tradeable: true },
      { name: "Wasp", type: "Pet", imageUrl: "https://i.postimg.cc/gcRj3mY8/Wasp.png", tradeable: true },
      { name: "Queen Bee", type: "Pet", imageUrl: "https://i.postimg.cc/TwM5jKGJ/Queen-Bee.png", tradeable: true },
      { name: "Honey Bee", type: "Pet", imageUrl: "https://i.postimg.cc/mDQVMv0W/Honey-Bee.png", tradeable: true },
      { name: "Bumble Bee", type: "Pet", imageUrl: "https://i.postimg.cc/W4fGLdNK/Bumble-Bee.png", tradeable: true },
      { name: "Carpenter Bee", type: "Pet", imageUrl: "https://i.postimg.cc/bw80GrbM/Carpenter-Bee.png", tradeable: true },
      { name: "Fuzzy Bee", type: "Pet", imageUrl: "https://i.postimg.cc/kMD65qs1/Fuzzy-Bee.png", tradeable: true },
      { name: "Brave Bee", type: "Pet", imageUrl: "https://i.postimg.cc/T1p0Q3vS/Brave-Bee.png", tradeable: true },
      { name: "Hasty Bee", type: "Pet", imageUrl: "https://i.postimg.cc/SxL8SDXT/Hasty-Bee.png", tradeable: true },
      { name: "Looker Bee", type: "Pet", imageUrl: "https://i.postimg.cc/DZGmnrNF/Looker-Bee.png", tradeable: true },
      { name: "Rad Bee", type: "Pet", imageUrl: "https://i.postimg.cc/g0MF0cLK/Rad-Bee.png", tradeable: true },
      { name: "Rascal Bee", type: "Pet", imageUrl: "https://i.postimg.cc/1zHSG59m/Rascal-Bee.png", tradeable: true },
      { name: "Stubborn Bee", type: "Pet", imageUrl: "https://i.postimg.cc/4NjZMNzG/Stubborn-Bee.png", tradeable: true },
      { name: "Bomber Bee", type: "Pet", imageUrl: "https://i.postimg.cc/Jh1vZ8Zj/Bomber-Bee.png", tradeable: true },
      { name: "Shocked Bee", type: "Pet", imageUrl: "https://i.postimg.cc/Y0qST0YN/Shocked-Bee.png", tradeable: true },
      { name: "Fire Bee", type: "Pet", imageUrl: "https://i.postimg.cc/L6v2wgzJ/Fire-Bee.png", tradeable: true },
      { name: "Cool Bee", type: "Pet", imageUrl: "https://i.postimg.cc/pd6w3Y1j/Cool-Bee.png", tradeable: true },
      { name: "Frosty Bee", type: "Pet", imageUrl: "https://i.postimg.cc/QNnCwgDN/Frosty-Bee.png", tradeable: true },
      { name: "Baby Bee", type: "Pet", imageUrl: "https://i.postimg.cc/RVj8yRHH/Baby-Bee.png", tradeable: true },
      { name: "Demon Bee", type: "Pet", imageUrl: "https://i.postimg.cc/fWKxq9vH/Demon-Bee.png", tradeable: true },
      { name: "Lion Bee", type: "Pet", imageUrl: "https://i.postimg.cc/Y053LVQF/Lion-Bee.png", tradeable: true },
      { name: "Music Bee", type: "Pet", imageUrl: "https://i.postimg.cc/PrZrw90Y/Music-Bee.png", tradeable: true },
      { name: "Ninja Bee", type: "Pet", imageUrl: "https://i.postimg.cc/8zVKd8qR/Ninja-Bee.png", tradeable: true },
      { name: "Exhausted Bee", type: "Pet", imageUrl: "https://i.postimg.cc/0QV5Kphm/Exhausted-Bee.png", tradeable: true },
      { name: "Commander Bee", type: "Pet", imageUrl: "https://i.postimg.cc/QCG2fhMb/Commander-Bee.png", tradeable: true },
      { name: "Buoyant Bee", type: "Pet", imageUrl: "https://i.postimg.cc/bNkGVr8F/Buoyant-Bee.png", tradeable: true },
      { name: "Bubble Bee", type: "Pet", imageUrl: "https://i.postimg.cc/pT9T6Dmq/Bubble-Bee.png", tradeable: true },
      { name: "Bucko Bee", type: "Pet", imageUrl: "https://i.postimg.cc/L8xsKm9L/Bucko-Bee.png", tradeable: true },
      { name: "Rage Bee", type: "Pet", imageUrl: "https://i.postimg.cc/vmFMJL9s/Rage-Bee.png", tradeable: true },
      { name: "Diamond Bee", type: "Pet", imageUrl: "https://i.postimg.cc/brpVtCtR/Diamond-Bee.png", tradeable: true },
      { name: "Precise Bee", type: "Pet", imageUrl: "https://i.postimg.cc/rwXQBHPs/Precise-Bee.png", tradeable: true },
      { name: "Festive Bee", type: "Pet", imageUrl: "https://i.postimg.cc/44SJgFGg/Festive-Bee.png", tradeable: true },
      { name: "Tabby Bee", type: "Pet", imageUrl: "https://i.postimg.cc/3R6W9Y8J/Tabby-Bee.png", tradeable: true },
      { name: "Photon Bee", type: "Pet", imageUrl: "https://i.postimg.cc/T3w6V0x8/Photon-Bee.png", tradeable: true },
      { name: "Cobalt Bee", type: "Pet", imageUrl: "https://i.postimg.cc/3JLnrqjz/Cobalt-Bee.png", tradeable: true },
      { name: "Crimson Bee", type: "Pet", imageUrl: "https://i.postimg.cc/RV86kfPt/Crimson-Bee.png", tradeable: true },
      { name: "Digital Bee", type: "Pet", imageUrl: "https://i.postimg.cc/nr4p3pvt/Digital-Bee.png", tradeable: true },
      { name: "Vicious Bee", type: "Pet", imageUrl: "https://i.postimg.cc/pVkp7xRK/Vicious-Bee.png", tradeable: true },
      { name: "Windy Bee", type: "Pet", imageUrl: "https://i.postimg.cc/FsLqR3PN/Windy-Bee.png", tradeable: true },
      { name: "Tadpole Bee", type: "Pet", imageUrl: "https://i.postimg.cc/3wmwJBJt/Tadpole-Bee.png", tradeable: true },
      { name: "Vector Bee", type: "Pet", imageUrl: "https://i.postimg.cc/y6v4HHnV/Vector-Bee.png", tradeable: true },
      { name: "Spicy Bee", type: "Pet", imageUrl: "https://i.postimg.cc/bwz2xtY3/Spicy-Bee.png", tradeable: true },
      { name: "Gummy Bee", type: "Pet", imageUrl: "https://i.postimg.cc/02Hf5Zyk/Gummy-Bee.png", tradeable: true },
      { name: "Gifted Honey Bee", type: "Pet", imageUrl: "https://i.postimg.cc/3NDmgQg6/Gifted-Honey-Bee.png", tradeable: true },
      { name: "Gifted Bumble Bee", type: "Pet", imageUrl: "https://i.postimg.cc/gJtDp7tW/Gifted-Bumble-Bee.png", tradeable: true },
      { name: "Gifted Carpenter Bee", type: "Pet", imageUrl: "https://i.postimg.cc/hPG4H0k0/Gifted-Carpenter-Bee.png", tradeable: true },
      { name: "Gifted Fuzzy Bee", type: "Pet", imageUrl: "https://i.postimg.cc/4dX8dG3z/Gifted-Fuzzy-Bee.png", tradeable: true },
      { name: "Gifted Brave Bee", type: "Pet", imageUrl: "https://i.postimg.cc/FKgGJqc3/Gifted-Brave-Bee.png", tradeable: true },
      { name: "Gifted Hasty Bee", type: "Pet", imageUrl: "https://i.postimg.cc/c1Dk4WHD/Gifted-Hasty-Bee.png", tradeable: true },
      { name: "Gifted Looker Bee", type: "Pet", imageUrl: "https://i.postimg.cc/QC0WX8G0/Gifted-Looker-Bee.png", tradeable: true },
      { name: "Gifted Rad Bee", type: "Pet", imageUrl: "https://i.postimg.cc/6QdJX5Nh/Gifted-Rad-Bee.png", tradeable: true },
      { name: "Gifted Rascal Bee", type: "Pet", imageUrl: "https://i.postimg.cc/W17k8P3d/Gifted-Rascal-Bee.png", tradeable: true },
      { name: "Gifted Stubborn Bee", type: "Pet", imageUrl: "https://i.postimg.cc/GmLnyZdL/Gifted-Stubborn-Bee.png", tradeable: true },
      { name: "Gifted Bomber Bee", type: "Pet", imageUrl: "https://i.postimg.cc/nLxqMHpB/Gifted-Bomber-Bee.png", tradeable: true },
      { name: "Gifted Shocked Bee", type: "Pet", imageUrl: "https://i.postimg.cc/fyxQzKc1/Gifted-Shocked-Bee.png", tradeable: true },
      { name: "Gifted Fire Bee", type: "Pet", imageUrl: "https://i.postimg.cc/BZM3hMrz/Gifted-Fire-Bee.png", tradeable: true },
      { name: "Gifted Cool Bee", type: "Pet", imageUrl: "https://i.postimg.cc/sDXvbRW3/Gifted-Cool-Bee.png", tradeable: true },
      { name: "Gifted Frosty Bee", type: "Pet", imageUrl: "https://i.postimg.cc/x8vrnQJD/Gifted-Frosty-Bee.png", tradeable: true },
      { name: "Gifted Baby Bee", type: "Pet", imageUrl: "https://i.postimg.cc/8z9h2TGX/Gifted-Baby-Bee.png", tradeable: true },
      { name: "Gifted Demon Bee", type: "Pet", imageUrl: "https://i.postimg.cc/1XCMTjK8/Gifted-Demon-Bee.png", tradeable: true },
      { name: "Gifted Lion Bee", type: "Pet", imageUrl: "https://i.postimg.cc/yYQPvzYp/Gifted-Lion-Bee.png", tradeable: true },
      { name: "Gifted Music Bee", type: "Pet", imageUrl: "https://i.postimg.cc/9Q1zqy00/Gifted-Music-Bee.png", tradeable: true },
      { name: "Gifted Ninja Bee", type: "Pet", imageUrl: "https://i.postimg.cc/1z5kh1g6/Gifted-Ninja-Bee.png", tradeable: true },
      { name: "Gifted Exhausted Bee", type: "Pet", imageUrl: "https://i.postimg.cc/nLZb1bTH/Gifted-Exhausted-Bee.png", tradeable: true },
      { name: "Gifted Commander Bee", type: "Pet", imageUrl: "https://i.postimg.cc/MZT1dXzK/Gifted-Commander-Bee.png", tradeable: true },
      { name: "Gifted Buoyant Bee", type: "Pet", imageUrl: "https://i.postimg.cc/SxzxH7dV/Gifted-Buoyant-Bee.png", tradeable: true },
      { name: "Gifted Bubble Bee", type: "Pet", imageUrl: "https://i.postimg.cc/J0NYCRhp/Gifted-Bubble-Bee.png", tradeable: true },
      { name: "Gifted Bucko Bee", type: "Pet", imageUrl: "https://i.postimg.cc/Z5cGm5gF/Gifted-Bucko-Bee.png", tradeable: true },
      { name: "Gifted Rage Bee", type: "Pet", imageUrl: "https://i.postimg.cc/G3XddZb7/Gifted-Rage-Bee.png", tradeable: true },
      { name: "Gifted Diamond Bee", type: "Pet", imageUrl: "https://i.postimg.cc/QMJ5gCx5/Gifted-Diamond-Bee.png", tradeable: true },
      { name: "Gifted Precise Bee", type: "Pet", imageUrl: "https://i.postimg.cc/28RH4Lhq/Gifted-Precise-Bee.png", tradeable: true },
      { name: "Gifted Festive Bee", type: "Pet", imageUrl: "https://i.postimg.cc/MG8tGmxP/Gifted-Festive-Bee.png", tradeable: true },
      { name: "Gifted Tabby Bee", type: "Pet", imageUrl: "https://i.postimg.cc/15K8fy0V/Gifted-Tabby-Bee.png", tradeable: true },
      { name: "Gifted Photon Bee", type: "Pet", imageUrl: "https://i.postimg.cc/d1v4X3M9/Gifted-Photon-Bee.png", tradeable: true },
      { name: "Gifted Cobalt Bee", type: "Pet", imageUrl: "https://i.postimg.cc/FKDn3y4R/Gifted-Cobalt-Bee.png", tradeable: true },
      { name: "Gifted Crimson Bee", type: "Pet", imageUrl: "https://i.postimg.cc/WpH1z3w3/Gifted-Crimson-Bee.png", tradeable: true },
      { name: "Gifted Digital Bee", type: "Pet", imageUrl: "https://i.postimg.cc/KvY9k8Gd/Gifted-Digital-Bee.png", tradeable: true },
      { name: "Gifted Vicious Bee", type: "Pet", imageUrl: "https://i.postimg.cc/fTGzGHDs/Gifted-Vicious-Bee.png", tradeable: true },
      { name: "Gifted Windy Bee", type: "Pet", imageUrl: "https://i.postimg.cc/pLGVJ8JT/Gifted-Windy-Bee.png", tradeable: true },
      { name: "Gifted Tadpole Bee", type: "Pet", imageUrl: "https://i.postimg.cc/nzd73YGV/Gifted-Tadpole-Bee.png", tradeable: true },
      { name: "Gifted Vector Bee", type: "Pet", imageUrl: "https://i.postimg.cc/y6J6yRfL/Gifted-Vector-Bee.png", tradeable: true },
      { name: "Gifted Spicy Bee", type: "Pet", imageUrl: "https://i.postimg.cc/8cb8J7FZ/Gifted-Spicy-Bee.png", tradeable: true },
      { name: "Gifted Gummy Bee", type: "Pet", imageUrl: "https://i.postimg.cc/MGSqGVyT/Gifted-Gummy-Bee.png", tradeable: true },
      { name: "Star Jelly", type: "Item", imageUrl: "https://i.postimg.cc/NMX1FYht/Star-Jelly.png", tradeable: true },
      { name: "Royal Jelly", type: "Item", imageUrl: "https://i.postimg.cc/C5TgkPg6/Royal-Jelly.png", tradeable: true },
      { name: "Treat", type: "Item", imageUrl: "https://i.postimg.cc/QdbV6fBg/Treat.png", tradeable: true },
      { name: "Sunflower Seed", type: "Item", imageUrl: "https://i.postimg.cc/1zJKPjxy/Sunflower-Seed.png", tradeable: true },
      { name: "Pineapple", type: "Item", imageUrl: "https://i.postimg.cc/bJyK9fCX/Pineapple.png", tradeable: true },
      { name: "Blueberry", type: "Item", imageUrl: "https://i.postimg.cc/8cC3zShh/Blueberry.png", tradeable: true },
      { name: "Strawberry", type: "Item", imageUrl: "https://i.postimg.cc/5N7ysV9s/Strawberry.png", tradeable: true },
      { name: "Coconut", type: "Item", imageUrl: "https://i.postimg.cc/j256DrvC/Coconut.png", tradeable: true },
      { name: "Moon Charm", type: "Item", imageUrl: "https://i.postimg.cc/qqd2DxLp/Moon-Charm.png", tradeable: true },
      { name: "Bitterberry", type: "Item", imageUrl: "https://i.postimg.cc/C1TF6wqy/Bitterberry.png", tradeable: true },
      { name: "Neonberry", type: "Item", imageUrl: "https://i.postimg.cc/mkpPcHSZ/Neonberry.png", tradeable: true },
      { name: "Atomic Treat", type: "Item", imageUrl: "https://i.postimg.cc/xCPMpdZ8/Atomic-Treat.png", tradeable: true },
      { name: "Ticket", type: "Item", imageUrl: "https://i.postimg.cc/j5Cr0ZZ8/Ticket.png", tradeable: true },
      { name: "Glue", type: "Item", imageUrl: "https://i.postimg.cc/rmVBQmDw/Glue.png", tradeable: true },
      { name: "Oil", type: "Item", imageUrl: "https://i.postimg.cc/y6fSRw3k/Oil.png", tradeable: true },
      { name: "Enzymes", type: "Item", imageUrl: "https://i.postimg.cc/Rhp3BRZy/Enzymes.png", tradeable: true },
      { name: "Red Extract", type: "Item", imageUrl: "https://i.postimg.cc/KYrjJHQm/Red-Extract.png", tradeable: true },
      { name: "Blue Extract", type: "Item", imageUrl: "https://i.postimg.cc/4d2PTCNm/Blue-Extract.png", tradeable: true },
      { name: "Glitter", type: "Item", imageUrl: "https://i.postimg.cc/ZKr1yWRL/Glitter.png", tradeable: true }
    ];
    
    // Initialize with items from Excel data
    excelItems.forEach((item: any, index: number) => {
      const tradingItem: TradingItem = {
        id: index + 1,
        name: item.name,
        type: item.type,
        rarity: 'common',
        currentValue: 100 + Math.floor(Math.random() * 900),
        previousValue: 80 + Math.floor(Math.random() * 1000),
        changePercent: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 15).toFixed(1) + '%',
        imageUrl: item.imageUrl,
        tradeable: item.tradeable,
        updatedAt: new Date()
      };
      
      this.tradingItems.set(tradingItem.id, tradingItem);
      this.currentId = Math.max(this.currentId, tradingItem.id + 1);
    });
    
    console.log(`Loaded ${excelItems.length} trading items from Excel data`);

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
