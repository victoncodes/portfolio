import { Response } from 'express';
import { LessonService } from '@/services/lesson.service';
import { sendSuccess, sendError, sendServerError } from '@/utils/response';
import { AuthenticatedRequest } from '@/types';

const lessonService = new LessonService();

export class LessonController {
  async createLesson(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
        return sendError(res, 'Insufficient permissions', 403);
      }

      const { courseId, title, contentType, contentRef, orderIndex, duration, unlockCondition } = req.body;
      
      const lesson = await lessonService.createLesson(
        courseId,
        req.user.id,
        title,
        contentType,
        contentRef,
        orderIndex,
        duration,
        unlockCondition
      );

      if (!lesson) {
        return sendError(res, 'Course not found or access denied', 404);
      }
      
      return sendSuccess(res, lesson, 'Lesson created successfully', 201);
    } catch (error) {
      if (error instanceof Error) {
        return sendError(res, error.message, 400);
      }
      return sendServerError(res);
    }
  }

  async getLesson(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      const lesson = await lessonService.getLessonById(id, userId);
      
      if (!lesson) {
        return sendError(res, 'Lesson not found', 404);
      }
      
      return sendSuccess(res, lesson);
    } catch (error) {
      return sendServerError(res);
    }
  }

  async updateLesson(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
        return sendError(res, 'Insufficient permissions', 403);
      }

      const { id } = req.params;
      const updates = req.body;
      
      const lesson = await lessonService.updateLesson(id, req.user.id, updates);
      
      if (!lesson) {
        return sendError(res, 'Lesson not found or access denied', 404);
      }
      
      return sendSuccess(res, lesson, 'Lesson updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        return sendError(res, error.message, 400);
      }
      return sendServerError(res);
    }
  }

  async deleteLesson(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
        return sendError(res, 'Insufficient permissions', 403);
      }

      const { id } = req.params;
      
      const deleted = await lessonService.deleteLesson(id, req.user.id);
      
      if (!deleted) {
        return sendError(res, 'Lesson not found or access denied', 404);
      }
      
      return sendSuccess(res, null, 'Lesson deleted successfully');
    } catch (error) {
      return sendServerError(res);
    }
  }

  async markComplete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const { id } = req.params;
      
      const progress = await lessonService.markLessonComplete(req.user.id, id);
      
      if (!progress) {
        return sendError(res, 'Lesson not found', 404);
      }
      
      return sendSuccess(res, progress, 'Lesson marked as complete');
    } catch (error) {
      if (error instanceof Error) {
        return sendError(res, error.message, 400);
      }
      return sendServerError(res);
    }
  }
}