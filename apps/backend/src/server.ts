import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { router as authRouter } from './tabs/auth';
import { router as usersRouter } from './tabs/users';
import { router as transactionsRouter } from './tabs/transactions';
import { router as goalsRouter } from './tabs/goals';
import { router as coursesRouter } from './tabs/courses';
import { router as lessonsRouter } from './tabs/lessons';
import { router as adminRouter } from './tabs/admin';

export function createServer() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'backend', uptime: process.uptime() });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/transactions', transactionsRouter);
  app.use('/api/goals', goalsRouter);
  app.use('/api/courses', coursesRouter);
  app.use('/api/lessons', lessonsRouter);
  app.use('/api/admin', adminRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  return app;
}

