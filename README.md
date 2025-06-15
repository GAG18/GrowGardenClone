# Roblox Trading Platform

A comprehensive Roblox trading platform featuring authentic item data, MongoDB Atlas cloud database, and Roblox OAuth authentication.

## Features

- **136 Authentic Trading Items** from official Excel data source
- **MongoDB Atlas Cloud Database** for scalable data storage and sharing
- **Roblox OAuth Authentication** for secure user sign-in with profile data
- **Trade Advertisement System** for creating and managing item trades
- **Dark Gaming UI** with modern design and responsive layout
- **Image Proxy Server** to handle CORS restrictions and optimize delivery
- **Discord Integration** for community giveaways and engagement

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js, Express.js, MongoDB with Mongoose ODM
- **Authentication**: Roblox OAuth 2.0 with secure token exchange
- **Database**: MongoDB Atlas (Cloud) with GridFS image storage
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod schema validation

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Roblox OAuth application

### Environment Setup
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_PASSWORD=your_mongodb_password
ROBLOX_CLIENT_ID=your_roblox_client_id
ROBLOX_CLIENT_SECRET=your_roblox_client_secret
VITE_ROBLOX_CLIENT_ID=your_roblox_client_id
```

### Installation
```bash
npm install
npm run dev
```

Application runs at `http://localhost:5000`

## Project Structure

```
├── client/src/
│   ├── components/         # UI components
│   ├── pages/             # Route pages
│   └── lib/               # Utilities
├── server/
│   ├── routes.ts          # API endpoints
│   ├── mongodb-storage.ts # Database layer
│   ├── image-service.ts   # Image handling
│   └── database.ts        # MongoDB connection
└── shared/
    └── schema.ts          # Shared type definitions
```

## Key Components

### Authentication
- Roblox OAuth 2.0 integration
- User profile and avatar fetching
- Secure session management

### Trading System
- Create trade advertisements
- Browse available trades
- Item picker with authentic data
- Real-time value tracking

### Database
- MongoDB Atlas cloud storage
- 136 pre-loaded authentic items
- GridFS for image storage
- Automatic data synchronization

## API Reference

### Items
- `GET /api/trading-items` - Get all tradeable items
- `GET /api/trading-items/:id` - Get item details

### Trade Ads
- `GET /api/trade-ads` - Get all trade advertisements
- `POST /api/trade-ads` - Create trade advertisement

### Authentication
- `POST /api/auth/callback` - OAuth callback handler

### Images
- `GET /api/proxy-image` - Image proxy endpoint

## OAuth Setup

Configure your Roblox OAuth application:
- **Redirect URI**: `http://localhost:5000/auth/callback`
- **Scopes**: `openid`, `profile`
- **Status**: Published/Active

## Discord Community

Join our Discord for giveaways and trading discussions:
https://discord.com/invite/wdMqEBAB4Z

## Development Notes

The platform uses authentic Roblox trading item data and connects to a cloud database for real-time synchronization. All images are handled through a proxy server to ensure reliable delivery and CORS compliance.