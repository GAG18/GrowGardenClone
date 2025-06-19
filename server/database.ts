import mongoose from 'mongoose';

// Build MongoDB URI with password from environment
const buildMongoURI = () => {
  if (process.env.MONGODB_PASSWORD) {
    return `mongodb+srv://amritpalrajput1999:${process.env.MONGODB_PASSWORD}@cluster0.pf5vpwn.mongodb.net/grow-a-garden?retryWrites=true&w=majority&appName=Cluster0`;
  }
  return process.env.MONGODB_URI || 'mongodb://localhost:27017/grow-a-garden';
};

const MONGODB_URI = buildMongoURI();

if (!process.env.MONGODB_PASSWORD && !process.env.MONGODB_URI) {
  console.warn('⚠️  MONGODB_PASSWORD not set. Using local MongoDB. For cloud database, set MONGODB_PASSWORD environment variable.');
} else if (process.env.MONGODB_PASSWORD) {
  console.log('🌐 Connecting to MongoDB Atlas cloud database...');
}

export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function disconnectFromDatabase() {
  await mongoose.disconnect();
}

// Trading Item Schema
const tradingItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Crop, Pet, Item
  imageUrl: { type: String },
  tradeable: { type: Boolean, default: true },
  rarity: { type: String, default: 'common' },
  currentValue: { type: Number, default: 100 },
  previousValue: { type: Number, default: 80 },
  changePercent: { type: String, default: '+0%' },
  updatedAt: { type: Date, default: Date.now }
});

export const TradingItem = mongoose.model('TradingItem', tradingItemSchema);

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  robloxUsername: { type: String },
  discordUsername: { type: String },
  reputation: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);

// Trade Ad Schema
const tradeAdSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  offeringItems: { type: String, required: true }, // JSON string of item IDs
  wantingItems: { type: String, required: true }, // JSON string of item IDs
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

export const TradeAd = mongoose.model('TradeAd', tradeAdSchema);