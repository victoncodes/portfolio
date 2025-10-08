import { Router } from 'express';
import { CourseController } from '@/controllers/course.controller';
import { validate, schemas } from '@/middleware/validation';
import { authenticateToken, requireInstructorOrAdmin } from '@/middleware/auth';

const router = Router();
const courseController = new CourseController();

// Public routes (can view published courses without auth)
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);
router.get('/:id/lessons', courseController.getCourseLessons);

// Protected routes
router.use(authenticateToken);

// Student routes
router.post('/:id/enroll', courseController.enrollInCourse);
router.get('/my/enrolled', courseController.getUserCourses);
router.get('/:id/progress', courseController.getUserProgress);

// Instructor/Admin routes
router.post('/', requireInstructorOrAdmin, validate(schemas.course), courseController.createCourse);
router.put('/:id', requireInstructorOrAdmin, validate(schemas.course), courseController.updateCourse);
router.delete('/:id', requireInstructorOrAdmin, courseController.deleteCourse);

export default router;