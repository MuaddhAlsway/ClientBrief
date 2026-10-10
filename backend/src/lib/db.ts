import { createClient, type Client } from '@libsql/client';
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import { env } from '../config/env.js';
import { logger } from './logger.js';
import * as schema from './schema.js';

let client: Client | null = null;
let db: LibSQLDatabase<typeof schema> | null = null;

export function isDbConfigured(): boolean {
  return env.db.configured;
}

export function getDb(): LibSQLDatabase<typeof schema> {
  if (!db) throw new Error('Database is not initialised.');
  return db;
}

export async function initDb(): Promise<void> {
  if (!isDbConfigured()) return;
  if (db) return;

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
