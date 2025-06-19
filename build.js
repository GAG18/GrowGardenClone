#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

console.log('🚀 Starting production build...');

// Ensure dist directory exists
if (!existsSync('dist')) {
  mkdirSync('dist', { recursive: true });
}

try {
  // Build frontend with Vite
  console.log('📦 Building frontend...');
  execSync('vite build', { 
    stdio: 'inherit',
    cwd: process.cwd(),
    timeout: 300000 // 5 minutes
  });

  // Build backend with esbuild
  console.log('⚙️ Building backend...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node18', { 
    stdio: 'inherit',
    cwd: process.cwd(),
    timeout: 60000 // 1 minute
  });

  console.log('✅ Build completed successfully!');
  
  // Verify build outputs
  const publicDir = path.join('dist', 'public');
  const serverFile = path.join('dist', 'index.js');
  
  if (existsSync(publicDir) && existsSync(serverFile)) {
    console.log('✅ Build verification passed');
  } else {
    console.error('❌ Build verification failed');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}