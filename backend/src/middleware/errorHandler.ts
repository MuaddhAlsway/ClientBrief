import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../lib/logger.js';

export class HttpError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'HttpError';
  }
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: 'Not found.' });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of error.issues) {
      const key = issue.path.join('.') || '_';
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return res.status(422).json({ error: 'Some fields need your attention.', fieldErrors });
  }

  if (error instanceof HttpError) {
    if (error.status >= 500) logger.error(error.message);
    return res.status(error.status).json({ error: error.message, details: error.details });
  }

  logger.error('Unhandled error', {
    reason: error instanceof Error ? error.message : 'unknown',
    stack: error instanceof Error ? error.stack : undefined,
  });
  return res.status(500).json({ error: 'Something went wrong on our end. Please try again.' });
}
