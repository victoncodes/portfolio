import { Router } from 'express';
import { LessonController } from '@/controllers/lesson.controller';
import { validate, schemas } from '@/middleware/validation';
import { authenticateToken, requireInstructorOrAdmin } from '@/middleware/auth';

const router = Router();
const lessonController = new LessonController();

// Public routes
router.get('/:id', lessonController.getLesson);

// Protected routes
router.use(authenticateToken);

// Student routes
router.post('/:id/complete', lessonController.markComplete);

// Instructor/Admin routes
router.post('/', requireInstructorOrAdmin, validate(schemas.lesson), lessonController.createLesson);
router.put('/:id', requireInstructorOrAdmin, validate(schemas.lesson), lessonController.updateLesson);
router.delete('/:id', requireInstructorOrAdmin, lessonController.deleteLesson);

export default router;