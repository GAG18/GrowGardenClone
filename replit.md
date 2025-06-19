# Replit.md - Roblox Trading Platform

## Overview

This is a comprehensive Roblox trading platform for the "Grow a Garden" game featuring authentic item data, MongoDB Atlas cloud database, and Roblox OAuth authentication. The platform enables players to create trade advertisements, browse current item values, use trusted middleman services, and engage with the trading community through real-time features.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui components built on Radix UI primitives with custom gaming theme
- **Styling**: Tailwind CSS with dark mode and custom gaming aesthetics
- **State Management**: TanStack Query for server state management and caching
- **Form Management**: React Hook Form with Zod schema validation for type-safe forms
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM for relational data integrity and scalability
- **Fallback Storage**: MongoDB Atlas (cloud) with Mongoose ODM for trading items data
- **Authentication**: Roblox OAuth 2.0 with secure token exchange and profile management
- **Session Storage**: PostgreSQL-backed sessions for secure authentication state
- **Image Handling**: Custom proxy server to bypass CORS restrictions for external images
- **API Design**: RESTful endpoints with comprehensive error handling

## Key Components

### Trading System
- **Trade Advertisements**: Full CRUD system for creating, browsing, and managing trade listings
- **Item Selection**: Comprehensive picker with 136+ authentic trading items from official data
- **Value Tracking**: Real-time market values with percentage changes and historical data
- **Advanced Filtering**: Search and filter by item type, rarity, value ranges, and custom attributes
- **Item Customization**: Pet age, weight, quantity ranges, and mutation tracking

### Authentication Flow
- **OAuth Integration**: Roblox OAuth 2.0 for secure user authentication with profile data
- **Dynamic Redirects**: Handles both localhost development and production environments
- **Profile Management**: Stores user profile data, trading reputation, and session management
- **Security**: Secure token-based authentication with proper error handling

### Data Storage Solutions
- **Primary Database**: MongoDB Atlas cloud database for scalability and reliability
- **Fallback System**: Automatic fallback to local memory storage if cloud unavailable
- **GridFS Storage**: Binary file storage for item images with proper content-type handling
- **Data Validation**: Zod schemas for runtime type checking and validation
- **Caching Strategy**: 24-hour cache headers for image optimization

### Image Management
- **Proxy Service**: Custom image proxy to handle CORS restrictions from external sources
- **Fallback System**: Category-based fallback icons when specific images are unavailable
- **Optimization**: Proper content-type headers, compression, and caching strategies
- **Storage**: GridFS integration for efficient binary data storage and retrieval

## Data Flow

1. **User Authentication**: Roblox OAuth flow → token exchange → user profile storage
2. **Trade Creation**: Form validation → item selection → database storage → real-time updates
3. **Item Data**: MongoDB Atlas → API endpoints → React Query caching → UI components
4. **Image Serving**: External URLs → proxy service → caching → client delivery
5. **Real-time Features**: WebSocket connections for live chat and trade updates

## External Dependencies

### Database & Storage
- **MongoDB Atlas**: Cloud database service with global distribution
- **GridFS**: Binary file storage for images and attachments
- **Mongoose ODM**: Object modeling for MongoDB with schema validation

### Authentication
- **Roblox OAuth API**: Official Roblox authentication service
- **OAuth 2.0 Flow**: Standard authorization code flow with PKCE

### Frontend Libraries
- **React Ecosystem**: React 18, TypeScript, Wouter routing
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with custom theme

### Development Tools
- **Vite**: Build tool and development server
- **ESBuild**: Fast JavaScript bundler for production
- **TypeScript**: Type checking and development experience

## Deployment Strategy

### Build Process
- **Development**: `npm run dev` - Vite dev server with hot reloading
- **Production Build**: `npm run build` - Vite client build + ESBuild server bundle
- **Type Checking**: `npm run check` - TypeScript validation

### Environment Configuration
- **Development**: Local development with MongoDB Atlas cloud database
- **Production**: Replit deployment with autoscale configuration
- **Database**: MongoDB Atlas with network access configuration required

### Replit Deployment
- **Platform**: Replit autoscale deployment target
- **Port Configuration**: Internal port 5000 mapped to external port 80
- **Module Requirements**: Node.js 20, Web, PostgreSQL 16 (for potential future use)

## PostgreSQL Database Integration Plan

### Architecture Overview
- **Users Table**: Stores Roblox OAuth users with string IDs as primary keys
- **Trade Ads Table**: Links to users via foreign key, supports millions of ads with indexed pagination
- **Relationships**: Foreign key constraints ensure data integrity between users and their trade ads
- **Indexes**: Compound indexes on (userId, createdAt) for efficient user trade history queries

### Scalability Design
- Primary key indexes for O(1) user lookups by Roblox ID
- Compound indexes for paginated trade ad browsing
- JSON fields for flexible item storage without complex joins
- Soft deletion via status fields for data preservation

### Implementation Status
- PostgreSQL database provisioned and connected
- Schema defined with proper relationships and indexes
- OAuth integration stores users on first login
- Trade ads will reference authenticated user IDs

## Changelog

```
Changelog:
- June 19, 2025. Cleaned up trade ads page layout and fixed image display - removed placeholder sections (Most Traded Items, Top Traders leaderboard, stats cards, Chat/Trade buttons), resolved image loading issue where items showed as colored circles instead of actual images, implemented comprehensive search and sort functionality across trade content, created streamlined layout focused on core trading features
- June 19, 2025. Resolved critical deployment failures - identified Vite build timeout issue with Lucide React icons, created fast-deploy.js solution that builds in 20ms, fixed server production mode detection and port configuration, verified MongoDB Atlas and PostgreSQL connections work in production, deployment now ready for Replit autoscale
- June 18, 2025. Completed deployment configuration fixes - created deployment scripts (deploy.sh, start.sh), added replit_deploy.toml configuration file, verified server listens on 0.0.0.0:5000, confirmed production build and start scripts work properly, ready for Replit autoscale deployment
- June 18, 2025. Fixed deployment configuration - resolved .replit missing deployment section error, verified server listens on 0.0.0.0:5000, confirmed production start script exists, ready for Replit autoscale deployment
- June 18, 2025. Updated MongoDB with all 130 authentic item images including Blood Hedgehog, Bee, Blood Owl, Blood Kiwi - complete resolution of inconsistent image loading in item picker
- June 18, 2025. Fixed Roblox OAuth 404 error by updating authorization endpoint to correct API URL
- June 18, 2025. Fixed item picker display issues by removing broken external image URLs and implementing proper category-based fallback icons
- June 18, 2025. Fixed broken item images in trade ads - updated external URLs and confirmed MongoDB image storage is working properly
- June 18, 2025. Resolved Git merge interruption and lock file issue - application fully restored and running with MongoDB Atlas connection and all 136 trading items loaded
- June 18, 2025. Successfully merged feature/Stocks_ValueList branch with enhanced sorting and UI improvements
- June 17, 2025. Replaced profile picture with username display in navigation to avoid image distortion issues
- June 17, 2025. Fixed Roblox profile pictures in trade ads - corrected image proxy endpoint URL mismatch
- June 17, 2025. Enhanced trade ad display with actual usernames and Roblox avatars instead of generic placeholders
- June 17, 2025. Completed PostgreSQL integration - trade ads now stored in hosted Neon database with proper user linking
- June 17, 2025. Fixed trade ad creation authentication - users can now publish ads with proper user ID validation
- June 17, 2025. Fixed "Link is not defined" error in roblox-auth component - authentication now fully functional
- June 17, 2025. Added PostgreSQL database with Roblox OAuth user storage architecture
- June 17, 2025. Fixed OAuth double encoding issue - authentication now working in production
- June 17, 2025. Reverted OAuth to standard authorization code flow with production URLs
- June 15, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```