import { Router } from 'express';

export const router = Router();

router.get('/me', async (_req, res) => {
  res.json({ id: 'me', email: 'me@example.com' });
});

router.put('/me', async (_req, res) => {
  res.json({ updated: true });
});

