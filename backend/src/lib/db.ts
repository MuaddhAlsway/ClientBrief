import { createClient, type Client } from '@libsql/client';
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import { env } from '../config/env.js';
import { logger } from './logger.js';
import * as schema from './schema.js';

let client: Client | null = null;
let db: LibSQLDatabase<typeof schema> | null = null;
let initPromise: Promise<void> | null = null;

export function isDbConfigured(): boolean {
  return env.db.configured;
}

export function getDb(): LibSQLDatabase<typeof schema> {
  if (!db) throw new Error('Database is not initialised.');
  return db;
}

export function initDb(): Promise<void> {
  if (!isDbConfigured()) return Promise.resolve();
  if (db) return Promise.resolve();
  if (!initPromise) {
    initPromise = (async () => {
      const attempts = 3;
      let lastError: unknown;
      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          client = createClient({
            url: env.db.url,
            authToken: env.db.authToken || undefined,
          });
          db = drizzle(client, { schema });

          await client.execute(`
            CREATE TABLE IF NOT EXISTS submissions (
              id TEXT PRIMARY KEY,
              reference_id TEXT NOT NULL,
              status TEXT NOT NULL,
              payload TEXT,
              created_at INTEGER NOT NULL,
              updated_at INTEGER NOT NULL
            )
          `);

          logger.info('Database ready (Turso / libSQL)');
          return;
        } catch (error) {
          lastError = error;
          client = null;
          db = null;
          if (attempt < attempts) {
            logger.warn('Database init attempt failed; retrying', {
              attempt,
              reason: error instanceof Error ? error.message : 'unknown',
            });
            await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
          }
        }
      }
      throw lastError;
    })().catch((error) => {
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
}

export async function pingDb(): Promise<boolean> {
  if (!isDbConfigured()) return false;
  try {
    if (!client) await initDb();
    await client!.execute('SELECT 1');
    return true;
  } catch (error) {
    logger.warn('Database ping failed', { reason: error instanceof Error ? error.message : 'unknown' });
    return false;
  }
}
