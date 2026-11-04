import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

let keepAliveTimer: NodeJS.Timeout | null = null;

function startKeepAlive(intervalMs = 2.5 * 60 * 1000) {
  if (keepAliveTimer) return;
  keepAliveTimer = setInterval(async () => {
    try {
      await prisma.$executeRawUnsafe('SELECT 1');
    } catch {
      // Ignore background keepalive failures; Prisma auto-reconnects on user queries
    }
  }, intervalMs);

  if (typeof keepAliveTimer.unref === 'function') {
    keepAliveTimer.unref();
  }
}

function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

/**
 * Connect to the PostgreSQL database (Neon DB serverless or standard Postgres)
 * with automatic retries to gracefully handle Neon DB cold starts/wake-ups.
 */
export async function connectDatabase(maxRetries = 5, retryDelayMs = 2500) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully (Neon DB / PostgreSQL)');
      startKeepAlive();
      return;
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      console.warn(
        `⚠️  Database connection attempt ${attempt}/${maxRetries} failed: ${errorMessage.split('\n')[0]}`
      );

      if (attempt < maxRetries) {
        console.log(
          `⏳ Waiting ${(retryDelayMs / 1000).toFixed(1)}s for Neon compute endpoint to wake up...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      } else {
        console.error('❌ Failed to connect to the database after maximum retry attempts.', error);
        process.exit(1);
      }
    }
  }
}

export async function disconnectDatabase() {
  stopKeepAlive();
  await prisma.$disconnect();
}
