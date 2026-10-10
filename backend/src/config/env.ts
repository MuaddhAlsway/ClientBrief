import 'dotenv/config';
import { z } from 'zod';

const booleanish = z
  .union([z.boolean(), z.string()])
  .transform((value) =>
    typeof value === 'boolean' ? value : ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase()),
  );

/** Treat empty / whitespace environment values as "not set". */
const emptyToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const optionalEmail = z.preprocess(emptyToUndefined, z.string().email().optional());
const optionalString = z.preprocess(emptyToUndefined, z.string().optional());

const rawSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  GMAIL_USER: optionalEmail,
  GMAIL_APP_PASSWORD: optionalString,
  OWNER_EMAIL: optionalEmail,
  MAIL_FROM_NAME: z.string().default('MU.LAB'),
  SEND_CLIENT_CONFIRMATION: booleanish.default(true),
  PRIVACY_POLICY_URL: z.string().default(''),

  // Turso / libSQL (optional durable persistence for submissions)
  TURSO_DATABASE_URL: optionalString,
  DATABASE_URL: optionalString,
  TURSO_AUTH_TOKEN: optionalString,
});

const parsed = rawSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`).join('\n');
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

const raw = parsed.data;

const emailConfigured = Boolean(raw.GMAIL_USER && raw.GMAIL_APP_PASSWORD && raw.OWNER_EMAIL);

const clientOrigins = raw.CLIENT_URL.split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const databaseUrl = raw.TURSO_DATABASE_URL ?? raw.DATABASE_URL ?? '';

export const env = {
  port: raw.PORT,
  nodeEnv: raw.NODE_ENV,
  isProduction: raw.NODE_ENV === 'production',
  clientOrigins,
  mail: {
    user: raw.GMAIL_USER,
    appPassword: raw.GMAIL_APP_PASSWORD,
    owner: raw.OWNER_EMAIL,
    fromName: raw.MAIL_FROM_NAME,
    sendClientConfirmation: raw.SEND_CLIENT_CONFIRMATION,
    privacyPolicyUrl: raw.PRIVACY_POLICY_URL,
    configured: emailConfigured,
  },
  db: {
    url: databaseUrl,
    authToken: raw.TURSO_AUTH_TOKEN ?? '',
    configured: Boolean(databaseUrl),
  },
} as const;

if (!emailConfigured) {
  // Not fatal: the API still validates and reports a clear error when a brief is submitted.
  console.warn(
    '[MU.LAB] Gmail SMTP is not configured (GMAIL_USER / GMAIL_APP_PASSWORD / OWNER_EMAIL). Email delivery is disabled.',
  );
}

if (env.db.configured) {
  console.info('[MU.LAB] Durable persistence enabled (Turso / libSQL).');
} else {
  console.warn('[MU.LAB] No database configured — using in-memory idempotency store (not durable).');
}
