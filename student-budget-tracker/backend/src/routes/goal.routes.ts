import { Router } from 'express';
import { GoalController } from '@/controllers/goal.controller';
import { validate, schemas } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';

const router = Router();
const goalController = new GoalController();

// All goal routes require authentication
router.use(authenticateToken);

router.post('/', validate(schemas.goal), goalController.createGoal);
router.get('/', goalController.getGoals);
router.get('/stats', goalController.getGoalStats);
router.get('/:id', goalController.getGoal);
router.put('/:id', validate(schemas.goal), goalController.updateGoal);
router.patch('/:id/add', goalController.addToGoal);
router.delete('/:id', goalController.deleteGoal);

export default router;