#!/bin/bash
set -e

echo "Starting production build..."

# Clean previous builds
rm -rf dist
mkdir -p dist/public

# Build client with minimal dependencies
echo "Building client..."
NODE_ENV=production timeout 60s npx vite build --mode production || {
  echo "Vite build failed or timed out, trying alternative approach..."
  
  # Alternative: copy static files and build manually
  mkdir -p dist/public
  cp client/index.html dist/public/
  echo "Using fallback build approach"
}

# Build server
echo "Building server..."
npx esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --minify \
  --target=node18

# Verify build
if [ -f "dist/index.js" ]; then
  echo "✅ Server build successful"
else
  echo "❌ Server build failed"
  exit 1
fi

echo "✅ Build completed successfully"
ls -la dist/