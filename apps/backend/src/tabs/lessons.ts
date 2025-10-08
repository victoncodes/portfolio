import { Router } from 'express';

export const router = Router();

router.get('/', async (_req, res) => {
  res.json({ items: [] });
});

router.post('/', async (_req, res) => {
  res.json({ created: true });
});

