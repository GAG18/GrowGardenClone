#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌱 Setting up Grow a Garden Trading Platform locally...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js 18 or higher is required. You have:', nodeVersion);
  console.log('Please download from: https://nodejs.org/');
  process.exit(1);
}

console.log('✅ Node.js version compatible:', nodeVersion);

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n📝 Creating .env file template...');
  
  const envTemplate = `# MongoDB Atlas Connection (Required)
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
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env file template');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Check if databases are configured
console.log('\n🔧 Checking configuration...');

const envContent = fs.readFileSync(envPath, 'utf8');
const needsConfig = [];

if (envContent.includes('your_mongodb_password_here')) {
  needsConfig.push('MongoDB password');
}

if (envContent.includes('postgresql://username:password@host:port/database')) {
  needsConfig.push('PostgreSQL database URL');
}

if (envContent.includes('your_roblox_client_id')) {
  needsConfig.push('Roblox OAuth credentials');
}

if (needsConfig.length > 0) {
  console.log('\n⚠️  Configuration needed:');
  needsConfig.forEach(item => console.log(`   - ${item}`));
  console.log('\nPlease update your .env file with the required values.');
  console.log('See LOCAL_SETUP.md for detailed instructions.\n');
} else {
  console.log('✅ Configuration looks complete');
  
  // Try to push database schema
  console.log('\n🗄️  Setting up database schema...');
  try {
    execSync('npm run db:push', { stdio: 'inherit' });
    console.log('✅ Database schema created successfully');
  } catch (error) {
    console.log('⚠️  Database schema setup failed - please check your DATABASE_URL');
  }
}

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Update .env file with your database and OAuth credentials');
console.log('2. Run: npm run dev');
console.log('3. Open: http://localhost:5000');
console.log('\nFor detailed setup instructions, see LOCAL_SETUP.md');