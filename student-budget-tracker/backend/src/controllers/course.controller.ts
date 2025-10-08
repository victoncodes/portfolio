import { Response } from 'express';
import { CourseService } from '@/services/course.service';
import { LessonService } from '@/services/lesson.service';
import { sendSuccess, sendError, sendServerError } from '@/utils/response';
import { AuthenticatedRequest } from '@/types';

const courseService = new CourseService();
const lessonService = new LessonService();

export class CourseController {
  async createCourse(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
        return sendError(res, 'Insufficient permissions', 403);
      }

      const { title, description, price, thumbnail } = req.body;
      
      const course = await courseService.createCourse(
        req.user.id,
        title,
        description,
        price,
        thumbnail
      );
      
      return sendSuccess(res, course, 'Course created successfully', 201);
    } catch (error) {
      if (error instanceof Error) {
        return sendError(res, error.message, 400);
      }
      return sendServerError(res);
    }
  }

  async getCourses(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const published = req.query.published === 'true' ? true : 
                       req.query.published === 'false' ? false : undefined;

      const courses = await courseService.getCourses(published);
      
      return sendSuccess(res, courses);
    } catch (error) {
      return sendServerError(res);
    }
  }

  async getCourse(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      const course = await courseService.getCourseById(id, userId);
      
      if (!course) {
        return sendError(res, 'Course not found', 404);
      }
      
      return sendSuccess(res, course);
    } catch (error) {
      return sendServerError(res);
    }
  }

  async updateCourse(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
        return sendError(res, 'Insufficient permissions', 403);
      }

      const { id } = req.params;
      const updates = req.body;
      
      const course = await courseService.updateCourse(id, req.user.id, updates);
      
      if (!course) {
        return sendError(res, 'Course not found or access denied', 404);
      }
      
      return sendSuccess(res, course, 'Course updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        return sendError(res, error.message, 400);
      }
      return sendServerError(res);
    }
  }

  async deleteCourse(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
        return sendError(res, 'Insufficient permissions', 403);
      }

      const { id } = req.params;
      
      const deleted = await courseService.deleteCourse(id, req.user.id);
      
      if (!deleted) {
        return sendError(res, 'Course not found or access denied', 404);
      }
      
      return sendSuccess(res, null, 'Course deleted successfully');
    } catch (error) {
      return sendServerError(res);
    }
  }

  async enrollInCourse(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const { id } = req.params;
      
      const progress = await courseService.enrollInCourse(req.user.id, id);
      
      return sendSuccess(res, progress, 'Successfully enrolled in course');
    } catch (error) {
      if (error instanceof Error) {
        return sendError(res, error.message, 400);
      }
      return sendServerError(res);
    }
  }

  async getUserCourses(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const courses = await courseService.getUserCourses(req.user.id);
      
      return sendSuccess(res, courses);
    } catch (error) {
      return sendServerError(res);
    }
  }

  async getCourseLessons(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      const lessons = await lessonService.getLessons(id, userId);
      
      return sendSuccess(res, lessons);
    } catch (error) {
      return sendServerError(res);
    }
  }

  async getUserProgress(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const { id } = req.params;
      
      const progress = await lessonService.getUserLessonProgress(req.user.id, id);
      
      return sendSuccess(res, progress);
    } catch (error) {
      return sendServerError(res);
    }
  }
}