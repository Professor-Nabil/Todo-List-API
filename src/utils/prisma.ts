// Create the Singleton Prisma Client
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources:
      process.env.NODE_ENV === "test"
        ? { db: { url: process.env.DATABASE_URL } }
        : undefined,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
