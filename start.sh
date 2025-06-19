#!/bin/bash

# Production startup script for Replit deployment
echo "Starting production server..."

# Set environment variables
export NODE_ENV=production
export PORT=5000

# Ensure we're using the correct Node.js version
node --version

# Start the production server
exec node dist/index.js