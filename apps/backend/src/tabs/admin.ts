import { Router } from 'express';

export const router = Router();

router.get('/stats', async (_req, res) => {
  res.json({ users: 0, lessons: 0, courses: 0 });
});

router.post('/users/:id/action', async (_req, res) => {
  res.json({ ok: true });
});

