import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Local dev uses SQLite via the better-sqlite3 driver adapter (zero-setup,
// no external database needed). When deploying to Vercel, swap this file to
// a Postgres adapter (@prisma/adapter-pg) pointed at a real DATABASE_URL,
// change `provider` in prisma/schema.prisma to "postgresql", and re-run
// `prisma migrate dev` once against the new database. See README.md.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
