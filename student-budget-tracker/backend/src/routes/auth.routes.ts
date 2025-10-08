import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { validate, schemas } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', validate(schemas.register), authController.register);
router.post('/login', validate(schemas.login), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);

// Protected routes
router.get('/me', authenticateToken, authController.getMe);

export default router;