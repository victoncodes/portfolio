import { Response } from 'express';
import { GoalService } from '@/services/goal.service';
import { sendSuccess, sendError, sendServerError } from '@/utils/response';
import { AuthenticatedRequest } from '@/types';

const goalService = new GoalService();

export class GoalController {
  async createGoal(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const { title, targetAmount, deadline } = req.body;
      
      const goal = await goalService.createGoal(
        req.user.id,
        title,
        targetAmount,
        deadline ? new Date(deadline) : undefined
      );
      
      return sendSuccess(res, goal, 'Goal created successfully', 201);
    } catch (error) {
      if (error instanceof Error) {
        return sendError(res, error.message, 400);
      }
      return sendServerError(res);
    }
  }

  async getGoals(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const goals = await goalService.getGoals(req.user.id);
      
      return sendSuccess(res, goals);
    } catch (error) {
      return sendServerError(res);
    }
  }

  async getGoal(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const { id } = req.params;
      
      const goal = await goalService.getGoalById(req.user.id, id);
      
      if (!goal) {
        return sendError(res, 'Goal not found', 404);
      }
      
      return sendSuccess(res, goal);
    } catch (error) {
      return sendServerError(res);
    }
  }

  async updateGoal(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const { id } = req.params;
      const updates = req.body;
      
      const goal = await goalService.updateGoal(req.user.id, id, updates);
      
      if (!goal) {
        return sendError(res, 'Goal not found', 404);
      }
      
      return sendSuccess(res, goal, 'Goal updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        return sendError(res, error.message, 400);
      }
      return sendServerError(res);
    }
  }

  async addToGoal(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const { id } = req.params;
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return sendError(res, 'Valid amount is required', 400);
      }
      
      const goal = await goalService.addToGoal(req.user.id, id, amount);
      
      if (!goal) {
        return sendError(res, 'Goal not found', 404);
      }
      
      return sendSuccess(res, goal, 'Amount added to goal successfully');
    } catch (error) {
      if (error instanceof Error) {
        return sendError(res, error.message, 400);
      }
      return sendServerError(res);
    }
  }

  async deleteGoal(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const { id } = req.params;
      
      const deleted = await goalService.deleteGoal(req.user.id, id);
      
      if (!deleted) {
        return sendError(res, 'Goal not found', 404);
      }
      
      return sendSuccess(res, null, 'Goal deleted successfully');
    } catch (error) {
      return sendServerError(res);
    }
  }

  async getGoalStats(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const stats = await goalService.getGoalStats(req.user.id);
      
      return sendSuccess(res, stats);
    } catch (error) {
      return sendServerError(res);
    }
  }
}