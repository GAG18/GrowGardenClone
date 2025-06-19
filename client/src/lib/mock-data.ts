export const mockTradingItems = [
  {
    id: 1,
    name: "Candy Blossom",
    type: "crop",
    rarity: "legendary",
    currentValue: 100000,
    previousValue: 95000,
    changePercent: "+5.2%",
    imageUrl: null,
    updatedAt: new Date()
  },
  {
    id: 2,
    name: "Dragon Fruit",
    type: "crop", 
    rarity: "epic",
    currentValue: 4750,
    previousValue: 4850,
    changePercent: "-2.1%",
    imageUrl: null,
    updatedAt: new Date()
  },
  {
    id: 3,
    name: "Golden Gear",
    type: "gear",
    rarity: "rare",
    currentValue: 25000,
    previousValue: 22150,
    changePercent: "+12.8%",
    imageUrl: null,
    updatedAt: new Date()
  },
  {
    id: 4,
    name: "Rainbow Seed",
    type: "seed",
    rarity: "mythical", 
    currentValue: 75000,
    previousValue: 72000,
    changePercent: "+4.2%",
    imageUrl: null,
    updatedAt: new Date()
  },
  {
    id: 5,
    name: "Crystal Egg",
    type: "egg",
    rarity: "legendary",
    currentValue: 180000,
    previousValue: 175000,
    changePercent: "+2.9%",
    imageUrl: null,
    updatedAt: new Date()
  }
];

export const mockChatMessages = [
  {
    id: 1,
    userId: 1,
    tradeAdId: 1,
    message: "Hey, would you be interested in this trade?",
    createdAt: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
  },
  {
    id: 2,
    userId: 2,
    tradeAdId: 1,
    message: "Hmm, that looks like a good trade! I've been looking for a Candy Blossom.",
    createdAt: new Date(Date.now() - 1 * 60 * 1000) // 1 minute ago
  },
  {
    id: 3,
    userId: 1,
    tradeAdId: 1,
    message: "Awesome! Let's do it then.",
    createdAt: new Date(Date.now() - 30 * 1000) // 30 seconds ago
  },
  {
    id: 4,
    userId: 2,
    tradeAdId: 1,
    message: "Great, join me in the game!",
    createdAt: new Date(Date.now() - 15 * 1000) // 15 seconds ago
  }
];

export const mockUsers = [
  {
    id: 1,
    username: "PetSimKing_2025",
    robloxUsername: "PetSimKing_2025",
    discordUsername: null,
    reputation: 127,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    username: "RobloxPro_Gaming123",
    robloxUsername: "RobloxPro_Gaming123", 
    discordUsername: "RobloxPro#1234",
    reputation: 89,
    createdAt: new Date('2024-02-20')
  },
  {
    id: 3,
    username: "XxDragonSlayer_2012xX",
    robloxUsername: "XxDragonSlayer_2012xX",
    discordUsername: "DragonSlayer#5678",
    reputation: 245,
    createdAt: new Date('2023-11-10')
  },
  {
    id: 4,
    username: "CoolGamer_3000",
    robloxUsername: "CoolGamer_3000",
    discordUsername: null,
    reputation: 56,
    createdAt: new Date('2024-03-05')
  }
];

export const mockTradeAds = [
  {
    id: 1,
    userId: 1,
    title: "Trading Candy Blossom for Dragon Fruits",
    description: "Looking for 3x Dragon Fruit for my Candy Blossom. Fair trade!",
    offeringItems: JSON.stringify([{ name: "Candy Blossom", quantity: 1, value: 100000 }]),
    wantingItems: JSON.stringify([{ name: "Dragon Fruit", quantity: 3, value: 4750 }]),
    status: "active",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: 2,
    userId: 2,
    title: "WTT: Golden Gear + adds for Rainbow Seed",
    description: "Trading my Golden Gear plus some adds for a Rainbow Seed. DM me!",
    offeringItems: JSON.stringify([
      { name: "Golden Gear", quantity: 1, value: 25000 },
      { name: "Regular Seeds", quantity: 10, value: 500 }
    ]),
    wantingItems: JSON.stringify([{ name: "Rainbow Seed", quantity: 1, value: 75000 }]),
    status: "active", 
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  }
];

export const communityStats = {
  activeTraders: 1247,
  totalTrades: 240000,
  onlineNow: 892,
  discordMembers: 15000,
  dailyTrades: 500
};

export const weatherStatus = {
  current: "Rainy Season",
  effect: "+20% Water Crop Growth",
  icon: "🌧️"
};
