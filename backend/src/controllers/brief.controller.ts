import type { Request, Response } from 'express';
import { briefSchema } from '../validators/briefSchema.js';
import { HttpError } from '../middleware/errorHandler.js';
import { EmailNotConfiguredError } from '../services/email.service.js';
import { DuplicateInFlightError, processBrief } from '../services/submission.service.js';
import { logger } from '../lib/logger.js';

export async function submitBrief(req: Request, res: Response) {
  const body = (req.body ?? {}) as Record<string, unknown>;

  // Honeypot: a hidden field real users never fill. Bots do.
  if (typeof body.website === 'string' && body.website.trim().length > 0) {
    logger.info('Honeypot triggered — discarding submission');
    return res.status(200).json({ ok: true, referenceId: 'MUL-FILTERED' });
  }

  const data = briefSchema.parse(body);

  try {
    const result = await processBrief(data);
    return res.status(200).json({
      ok: true,
      referenceId: result.referenceId,
      duplicate: result.duplicate,
      clientConfirmationSent: result.clientConfirmationSent,
    });
  } catch (error) {
    if (error instanceof EmailNotConfiguredError) {
      throw new HttpError(503, 'Email delivery is not configured yet. Please try again later.');
    }
    if (error instanceof DuplicateInFlightError) {
      throw new HttpError(409, 'Your brief is already being submitted. Please wait a moment.');
    }
    logger.error('Brief delivery failed', {
      reason: error instanceof Error ? error.message : 'unknown',
    });
    throw new HttpError(502, 'We could not deliver your brief right now. Please try again shortly.');
  }
}
