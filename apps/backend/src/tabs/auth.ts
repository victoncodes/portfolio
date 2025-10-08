import { Router } from 'express';

export const router = Router();

router.post('/register', async (_req, res) => {
  res.json({ message: 'register placeholder' });
});

router.post('/login', async (_req, res) => {
  res.json({ message: 'login placeholder' });
});

router.post('/refresh', async (_req, res) => {
  res.json({ message: 'refresh placeholder' });
});

router.post('/forgot-password', async (_req, res) => {
  res.json({ message: 'forgot-password placeholder' });
});

