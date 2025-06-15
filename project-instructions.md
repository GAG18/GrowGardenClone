# Project Instructions - Roblox Trading Platform

## Overview

This is a comprehensive Roblox trading platform for the "Grow a Garden" game featuring authentic item data, cloud database storage, and OAuth authentication. The platform enables players to create trade advertisements, browse trading opportunities, access real-time market data, and connect with trusted middlemen for secure transactions.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom gaming theme and dark mode
- **State Management**: TanStack Query for server state and caching
- **Form Management**: React Hook Form with Zod schema validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Database**: MongoDB Atlas (cloud) with Mongoose ODM
- **Authentication**: Roblox OAuth 2.0 with secure token exchange
- **File Storage**: GridFS for efficient image storage and retrieval
- **Image Handling**: Custom proxy server to handle CORS restrictions
- **API Design**: RESTful endpoints with proper error handling

## Key Components

### Trading System
- **Trade Advertisements**: Users can create and browse trade listings
- **Item Selection**: Comprehensive picker with 136+ authentic trading items
- **Value Tracking**: Real-time market values with percentage changes
- **Filtering**: Search and filter by item type, rarity, and value ranges

### Authentication Flow
- **OAuth Integration**: Roblox OAuth 2.0 for secure user authentication
- **Dynamic Redirects**: Handles both localhost and production environments
- **Profile Management**: Stores user profile data and trading reputation
- **Session Management**: Secure token-based authentication

### Data Storage
- **MongoDB Atlas**: Cloud-based database for scalability and reliability
- **GridFS**: Binary file storage for item images
- **Fallback System**: Automatic fallback to local memory storage if cloud unavailable
- **Data Validation**: Zod schemas for runtime type checking

### Image Management
- **Proxy Service**: Handles CORS restrictions for external image URLs
- **Caching**: 24-hour cache headers for optimal performance
- **Fallback Images**: Category-based fallback icons when specific images unavailable
- **Optimization**: Proper content-type headers and compression

## Data Flow

1. **User Authentication**: OAuth flow redirects to Roblox → exchanges code for tokens → stores user profile
2. **Trade Creation**: Form validation → item selection → database storage → real-time updates
3. **Market Data**: Database queries → caching layer → API endpoints → frontend display
4. **Image Serving**: External URLs → proxy service → CORS headers → client display

## External Dependencies

### Required Services
- **MongoDB Atlas**: Cloud database service (requires network access configuration)
- **Roblox OAuth**: Authentication service (requires application registration)
- **PostImg**: External image hosting service for item images

### Environment Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_PASSWORD=your_mongodb_password
ROBLOX_CLIENT_ID=your_roblox_client_id
ROBLOX_CLIENT_SECRET=your_roblox_client_secret
VITE_ROBLOX_CLIENT_ID=your_roblox_client_id
NODE_ENV=development
PORT=5000
```

### OAuth Configuration
- **Redirect URI**: Must match production domain in Roblox app settings
- **Scopes**: `openid` and `profile` for basic user information
- **State Parameter**: CSRF protection for OAuth flow

## Deployment Strategy

### Production Setup
1. **Environment Configuration**: Update OAuth redirect URIs for production domain
2. **Database Access**: Configure MongoDB Atlas network access for deployment IPs
3. **Build Process**: Vite builds frontend assets, esbuild bundles server code
4. **Asset Serving**: Static files served from Express in production
5. **CORS Configuration**: Proper headers for cross-origin requests

### Development Workflow
- **Hot Reload**: Vite HMR for frontend, tsx for backend auto-restart
- **Dual Storage**: Automatic fallback from MongoDB to memory storage
- **Proxy Setup**: Development proxy for OAuth testing
- **Error Handling**: Comprehensive error boundaries and logging

### Known Limitations
- **OAuth Access**: Roblox OAuth APIs may be network-restricted in some environments
- **Image CORS**: External images require proxy service due to CORS policies
- **Regional Restrictions**: Some Roblox services may be geo-blocked

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 13, 2025. Initial setup