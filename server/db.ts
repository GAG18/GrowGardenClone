import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Optimized connection pool for high traffic
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Connection pool settings for high concurrency
  max: 20, // Maximum number of connections in the pool
  min: 5,  // Minimum number of connections to maintain
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 10000, // Timeout when acquiring connection
  maxUses: 7500, // Maximum uses per connection before cycling
  keepAlive: true, // Enable TCP keep-alive
  keepAliveInitialDelayMillis: 10000 // Keep-alive delay
});

export const db = drizzle({ client: pool, schema });