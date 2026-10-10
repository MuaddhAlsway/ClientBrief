import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { briefRouter } from './routes/brief.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimit.js';
import { isEmailConfigured, verifyEmailConnection } from './services/email.service.js';
import { isDbConfigured, pingDb } from './lib/db.js';

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

  app.use(express.json({ limit: '64kb' }));

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
