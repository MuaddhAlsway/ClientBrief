import express from 'express';
import helmetMiddleware from 'helmet';
import type { HelmetOptions } from 'helmet';
import type { RequestHandler } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { briefRouter } from './routes/brief.routes.js';
import { errorHandler, HttpError, notFound } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimit.js';
import { isEmailConfigured, verifyEmailConnection } from './services/email.service.js';
import { initDb, isDbConfigured, pingDb } from './lib/db.js';

/**
 * `helmet` is a dual ESM/CJS package whose default export binds inconsistently
 * across TypeScript module modes (our NodeNext build vs. Vercel's function
 * compiler). Cast to a plain factory so it type-checks under both.
 */
const helmet = helmetMiddleware as unknown as (options?: Readonly<HelmetOptions>) => RequestHandler;

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.clientOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Origin not allowed by CORS policy.'));
      },
      methods: ['POST', 'GET', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
      maxAge: 86400,
    }),
  );

  /**
   * Ensure durable persistence is ready before handling a request. On a
   * long-lived server this is a no-op after the first call; on Vercel the app
   * runs as a function and each cold instance initialises once.
   */
  app.use(async (_req, _res, next) => {
    try {
      await initDb();
      next();
    } catch (error) {
      next(new HttpError(503, 'We could not reach the form database. Please try again in a moment.'));
    }
  });

  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'mulab-client-intake',
      emailConfigured: isEmailConfigured(),
      databaseConfigured: isDbConfigured(),
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/health/db', async (_req, res) => {
    const reachable = await pingDb();
    res.status(reachable ? 200 : 503).json({ ok: reachable, reachable, configured: isDbConfigured() });
  });

  app.get('/api/health/email', async (_req, res) => {
    const reachable = await verifyEmailConnection();
    res.status(reachable ? 200 : 503).json({ ok: reachable, reachable });
  });

  app.use('/api', generalLimiter, briefRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

/**
 * Default export enables Vercel's zero-config Express detection (it looks for a
 * default-exported Express app in `src/app.ts`). On other platforms the named
 * `createApp` export is used by `server.ts` and the test suite.
 */
export default createApp();
