import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import type { BriefPayload } from '../validators/briefSchema.js';
import { buildOwnerEmail } from '../templates/owner.template.js';
import { buildClientEmail } from '../templates/client.template.js';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!env.mail.configured) {
    throw new EmailNotConfiguredError();
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.port === 465,
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 30_000,
      auth: {
        user: env.mail.user,
        pass: env.mail.appPassword,
      },
    });
  }
  return transporter;
}

export class EmailNotConfiguredError extends Error {
  constructor() {
    super('Email delivery is not configured on the server.');
    this.name = 'EmailNotConfiguredError';
  }
}

export function isEmailConfigured(): boolean {
  return env.mail.configured;
}

/**
 * Deliver the owner notification. A success return means the transport accepted
 * the message for delivery; failures throw so the caller can respond 502 and
 * avoid reporting a false success.
 */
export async function sendOwnerBrief(data: BriefPayload, referenceId: string): Promise<void> {
  const submittedAt = new Date().toISOString();
  const { subject, html, text } = buildOwnerEmail(data, referenceId, submittedAt);

  const info = await getTransporter().sendMail({
    from: `${env.mail.fromName} Brief <${env.mail.user}>`,
    to: env.mail.owner,
    replyTo: data.email,
    subject,
    html,
    text,
  });

  logger.info('Owner brief delivered', {
    referenceId,
    messageId: info.messageId,
    accepted: Array.isArray(info.accepted) ? info.accepted.length : undefined,
  });
}

/**
 * Optional client acknowledgement. Never throws: a failure here must not
 * invalidate an already accepted submission.
 */
export async function sendClientConfirmation(data: BriefPayload, referenceId: string): Promise<boolean> {
  if (!env.mail.sendClientConfirmation) return false;
  try {
    const { subject, html, text } = buildClientEmail(data, referenceId, env.mail.privacyPolicyUrl);
    await getTransporter().sendMail({
      from: `${env.mail.fromName} <${env.mail.user}>`,
      to: data.email,
      subject,
      html,
      text,
    });
    logger.info('Client confirmation delivered', { referenceId });
    return true;
  } catch (error) {
    logger.warn('Client confirmation failed (non-fatal)', {
      referenceId,
      reason: error instanceof Error ? error.message : 'unknown',
    });
    return false;
  }
}

/** Best-effort readiness probe used by the health endpoint. */
export async function verifyEmailConnection(): Promise<boolean> {
  if (!env.mail.configured) return false;
  try {
    await getTransporter().verify();
    return true;
  } catch (error) {
    logger.warn('SMTP verification failed', { reason: error instanceof Error ? error.message : 'unknown' });
    return false;
  }
}
