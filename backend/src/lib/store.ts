import { eq } from 'drizzle-orm';
import { getDb, isDbConfigured } from './db.js';
import { submissions } from './schema.js';
import { logger } from './logger.js';

/**
 * Idempotency + submission state store.
 *
 * When Turso / libSQL is configured, records are persisted durably so duplicate
 * protection and audit survive restarts and multiple instances. Without a
 * database, a bounded in-memory map is used (single-instance only).
 *
 * The store is intentionally NOT a delivery queue: the HTTP response only
 * reports success after the mail transport has accepted the message.
 */

export type SubmissionStatus = 'in_progress' | 'delivered' | 'failed';

export type ReserveResult =
  | { state: 'reserved'; referenceId: string }
  | { state: 'duplicate_delivered'; referenceId: string }
  | { state: 'duplicate_in_flight' }
  | { state: 'retry'; referenceId: string };

const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_ENTRIES = 2000;

interface MemoryRecord {
  status: SubmissionStatus;
  referenceId: string;
  createdAt: number;
  updatedAt: number;
}

const memory = new Map<string, MemoryRecord>();

function evictMemory(now: number) {
  for (const [key, record] of memory) {
    if (now - record.updatedAt > DEFAULT_TTL_MS) memory.delete(key);
  }
  if (memory.size > MAX_ENTRIES) {
    const overflow = memory.size - MAX_ENTRIES;
    let removed = 0;
    for (const key of memory.keys()) {
      memory.delete(key);
      if (++removed >= overflow) break;
    }
  }
}

export function createReferenceId(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MUL-${date}-${random}`;
}

export async function reserve(submissionId: string, payload?: unknown): Promise<ReserveResult> {
  return isDbConfigured() ? reserveDb(submissionId, payload) : reserveMemory(submissionId);
}

export async function markDelivered(submissionId: string): Promise<void> {
  return isDbConfigured() ? setStatusDb(submissionId, 'delivered') : setStatusMemory(submissionId, 'delivered');
}

export async function markFailed(submissionId: string): Promise<void> {
  return isDbConfigured() ? setStatusDb(submissionId, 'failed') : setStatusMemory(submissionId, 'failed');
}

/** Test helper — clears the in-memory store (no effect on the database). */
export function _reset(): void {
  memory.clear();
}

// ── In-memory implementation ───────────────────────────────────────────────

function reserveMemory(submissionId: string): ReserveResult {
  const now = Date.now();
  evictMemory(now);

  const existing = memory.get(submissionId);
  if (existing) {
    if (existing.status === 'delivered') return { state: 'duplicate_delivered', referenceId: existing.referenceId };
    if (existing.status === 'in_progress') return { state: 'duplicate_in_flight' };
    existing.status = 'in_progress';
    existing.updatedAt = now;
    return { state: 'retry', referenceId: existing.referenceId };
  }

  const referenceId = createReferenceId();
  memory.set(submissionId, { status: 'in_progress', referenceId, createdAt: now, updatedAt: now });
  return { state: 'reserved', referenceId };
}

function setStatusMemory(submissionId: string, status: SubmissionStatus): void {
  const record = memory.get(submissionId);
  if (record) {
    record.status = status;
    record.updatedAt = Date.now();
  }
}

// ── Turso / libSQL implementation ─────────────────────────────────────────

async function reserveDb(submissionId: string, payload?: unknown): Promise<ReserveResult> {
  const db = getDb();
  const now = Date.now();
  const referenceId = createReferenceId();

  const insert = await db
    .insert(submissions)
    .values({
      id: submissionId,
      referenceId,
      status: 'in_progress',
      payload: payload === undefined ? null : JSON.stringify(payload),
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing()
    .run();

  // Insert succeeded → this is a fresh reservation.
  if (insert.rowsAffected > 0) {
    return { state: 'reserved', referenceId };
  }

  // Row already existed → inspect prior state.
  const rows = await db.select().from(submissions).where(eq(submissions.id, submissionId)).limit(1);
  const existing = rows[0];

  if (!existing) {
    // Extremely unlikely race; retry once as a fresh reservation.
    logger.warn('Reservation vanished after conflict', { submissionId });
    return reserveDb(submissionId, payload);
  }

  if (existing.status === 'delivered') {
    return { state: 'duplicate_delivered', referenceId: existing.referenceId };
  }
  if (existing.status === 'in_progress') {
    return { state: 'duplicate_in_flight' };
  }

  // Previously failed → allow retry with the same reference id.
  await db
    .update(submissions)
    .set({ status: 'in_progress', updatedAt: now, payload: payload === undefined ? existing.payload : JSON.stringify(payload) })
    .where(eq(submissions.id, submissionId))
    .run();

  return { state: 'retry', referenceId: existing.referenceId };
}

async function setStatusDb(submissionId: string, status: SubmissionStatus): Promise<void> {
  const db = getDb();
  await db.update(submissions).set({ status, updatedAt: Date.now() }).where(eq(submissions.id, submissionId)).run();
}
