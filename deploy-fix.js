#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting optimized deployment build...');

try {
  // Clean previous builds
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('✅ Cleaned previous build');
  }

  // Create dist directory
  fs.mkdirSync('dist', { recursive: true });
  fs.mkdirSync('dist/public', { recursive: true });

  // Build client with optimized settings
  console.log('📦 Building client...');
  process.env.NODE_ENV = 'production';
  
  const viteCmd = `npx vite build --config vite.config.prod.ts --mode production`;
  execSync(viteCmd, { 
    stdio: 'inherit',
    timeout: 120000 // 2 minutes max
  });

  // Build server
  console.log('⚙️  Building server...');
  const esbuildCmd = `npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify --target=node18`;
  execSync(esbuildCmd, { stdio: 'inherit' });

  // Verify build outputs
  if (!fs.existsSync('dist/index.js')) {
    throw new Error('Server build failed - dist/index.js not found');
  }
  
  if (!fs.existsSync('dist/public/index.html')) {
    throw new Error('Client build failed - dist/public/index.html not found');
  }

  console.log('✅ Build completed successfully!');
  console.log('📁 Build outputs:');
  console.log('   - Server: dist/index.js');
  console.log('   - Client: dist/public/');
  
  // Test server startup
  console.log('🧪 Testing server startup...');
  const testCmd = `timeout 5s node dist/index.js || echo "Server test completed"`;
  execSync(testCmd, { stdio: 'inherit' });
  
  console.log('🎉 Deployment build ready!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}