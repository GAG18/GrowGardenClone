# Local Development Setup Guide

## Prerequisites

Before running this project locally, make sure you have:

1. **Node.js 18 or higher** - Download from [nodejs.org](https://nodejs.org/)
2. **Git** (optional, but recommended) - Download from [git-scm.com](https://git-scm.com/)

## Download the Project

### Option 1: Download as ZIP (Recommended)
1. Click the "Download" button in Replit
2. Choose "Download as ZIP"
3. Extract the ZIP file to your desired location

### Option 2: Clone with Git
```bash
git clone [your-replit-url] grow-a-garden-trading
cd grow-a-garden-trading
```

## Setup Instructions

### 1. Install Dependencies
Open terminal/command prompt in the project folder and run:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory with these variables:

```env
# MongoDB Atlas Connection (Required)
MONGODB_URI=mongodb+srv://amritpalrajput1999:[PASSWORD]@cluster0.pf5vpwn.mongodb.net/grow-a-garden?retryWrites=true&w=majority&appName=Cluster0
MONGODB_PASSWORD=your_mongodb_password_here

# PostgreSQL Database (Required for users/trades)
DATABASE_URL=postgresql://username:password@host:port/database

# Development Settings
NODE_ENV=development
PORT=5000

# Roblox OAuth (Required for authentication)
ROBLOX_CLIENT_ID=your_roblox_client_id
ROBLOX_CLIENT_SECRET=your_roblox_client_secret
ROBLOX_REDIRECT_URI=http://localhost:5000/auth/roblox/callback
```

### 3. Database Setup

#### MongoDB Atlas (Trading Items Data)
- The project uses the existing MongoDB Atlas database for item data
- You'll need the MongoDB password to connect
- All 136+ trading items are already loaded in the cloud database

#### PostgreSQL (User Data & Trade Ads)
**Option A: Use Neon (Recommended)**
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string to `DATABASE_URL` in `.env`

**Option B: Local PostgreSQL**
1. Install PostgreSQL locally
2. Create database: `createdb grow_a_garden`
3. Update `DATABASE_URL` with local connection

### 4. Initialize Database Schema
Run this command to create all database tables:
```bash
npm run db:push
```

### 5. Roblox OAuth Setup
1. Go to [create.roblox.com](https://create.roblox.com)
2. Navigate to "Creator Dashboard" → "Open Cloud" → "API Keys"
3. Create new OAuth2 application:
   - **Name**: Grow a Garden Trading (Local)
   - **Redirect URI**: `http://localhost:5000/auth/roblox/callback`
   - **Scopes**: `openid`, `profile`
4. Copy Client ID and Client Secret to `.env` file

## Running the Application

### Development Mode
```bash
npm run dev
```

This starts:
- **Backend server** on `http://localhost:5000`
- **Frontend development server** with hot reloading
- **Database connections** to MongoDB and PostgreSQL

### Production Build
```bash
npm run build
npm start
```

## Accessing the Application

1. Open browser to `http://localhost:5000`
2. Click "Login with Roblox" to authenticate
3. Create trade advertisements and browse the marketplace

## Troubleshooting

### Common Issues

**"Cannot connect to MongoDB"**
- Verify `MONGODB_PASSWORD` is correct
- Check network connectivity
- Ensure IP address is whitelisted in MongoDB Atlas

**"Database connection failed"**
- Verify PostgreSQL `DATABASE_URL` is correct
- Run `npm run db:push` to create tables
- Check database server is running

**"Roblox OAuth error"**
- Verify `ROBLOX_CLIENT_ID` and `ROBLOX_CLIENT_SECRET`
- Ensure redirect URI matches exactly: `http://localhost:5000/auth/roblox/callback`
- Check OAuth application is approved in Roblox

**"Port already in use"**
- Change `PORT` in `.env` to different number (e.g., 3000, 8000)
- Or stop other applications using port 5000

### Development Tips

1. **Database Studio**: View your data with `npx drizzle-kit studio`
2. **Type Checking**: Run `npx tsc --noEmit` to check for TypeScript errors
3. **Logs**: Check terminal for detailed error messages
4. **Hot Reloading**: Frontend changes update automatically in development mode

## Project Structure

```
grow-a-garden-trading/
├── client/          # React frontend
│   ├── src/
│   ├── pages/       # Route components
│   └── components/  # Reusable UI components
├── server/          # Express backend
│   ├── routes.ts    # API endpoints
│   └── storage.ts   # Database operations
├── shared/          # Shared types and schemas
│   └── schema.ts    # Database schema and types
└── .env            # Environment variables
```

## Next Steps

Once running locally:
1. Test authentication with your Roblox account
2. Create sample trade advertisements
3. Verify all features work as expected
4. Customize for your specific needs

For production deployment, consider:
- Upgrading to Neon Scale plan for better performance
- Setting up proper domain and SSL certificates
- Configuring production OAuth redirect URIs