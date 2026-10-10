import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Durable record of every accepted submission, used for idempotency and audit.
 * Backed by Turso / libSQL via Drizzle ORM.
 */
export const submissions = sqliteTable('submissions', {
  id: text('id').primaryKey(),
  referenceId: text('reference_id').notNull(),
  status: text('status').notNull(),
  payload: text('payload'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export type SubmissionRow = typeof submissions.$inferSelect;
