import { Router } from 'express';
import { DashboardController } from '@/controllers/dashboard.controller';
import { authenticateToken } from '@/middleware/auth';

const router = Router();
const dashboardController = new DashboardController();

// All dashboard routes require authentication
router.use(authenticateToken);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/insights', dashboardController.getFinancialInsights);

export default router;