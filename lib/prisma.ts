import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("[FieldSpec] DATABASE_URL environment variable is required. Set it in your .env file.");
  }
  
  // Create a connection pool using the pg library
  const pool = new Pool({ 
    connectionString,
    // For many hosted databases, SSL is required.
    // If it's a local database, we don't need SSL.
    ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1") 
      ? false 
      : { rejectUnauthorized: false }
  });

  // Use the Prisma adapter for Postgres
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
