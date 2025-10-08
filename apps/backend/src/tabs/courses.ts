import { Router } from 'express';

export const router = Router();

router.get('/', async (_req, res) => {
  res.json({ items: [] });
});

router.get('/:id', async (_req, res) => {
  res.json({ id: 'course-id' });
});

router.post('/', async (_req, res) => {
  res.json({ created: true });
});

