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
- **Database**: MongoDB Atlas (cloud) with Mongoose ODM for scalable data storage
- **Authentication**: Roblox OAuth 2.0 with secure token exchange and profile management
- **File Storage**: GridFS for efficient binary image storage and retrieval
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

## Changelog

```
Changelog:
- June 15, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```