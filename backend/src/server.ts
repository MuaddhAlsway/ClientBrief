import { createApp } from './app.js';
import { env } from './config/env.js';
import { initDb } from './lib/db.js';
import { logger } from './lib/logger.js';

async function main() {
  await initDb();

  const app = createApp();

  const server = app.listen(env.port, () => {
    logger.info('MU.LAB intake API listening', {
      port: env.port,
      env: env.nodeEnv,
      emailConfigured: env.mail.configured,
      databaseConfigured: env.db.configured,
    });
  });

  function shutdown(signal: string) {
    logger.info(`Received ${signal}, shutting down.`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 8000).unref();
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((error) => {
  logger.error('Failed to start server', { reason: error instanceof Error ? error.message : 'unknown' });
  process.exit(1);
});
