import { Router } from 'express';

export const router = Router();

router.post('/', async (_req, res) => {
  res.json({ created: true });
});

router.get('/', async (_req, res) => {
  res.json({ items: [] });
});

router.put('/:id', async (_req, res) => {
  res.json({ updated: true });
});

router.delete('/:id', async (_req, res) => {
  res.json({ deleted: true });
});

