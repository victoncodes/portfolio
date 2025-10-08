import { Response } from 'express';
import { DashboardService } from '@/services/dashboard.service';
import { sendSuccess, sendError, sendServerError } from '@/utils/response';
import { AuthenticatedRequest } from '@/types';

const dashboardService = new DashboardService();

export class DashboardController {
  async getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const dateFrom = req.query.from ? new Date(req.query.from as string) : undefined;
      const dateTo = req.query.to ? new Date(req.query.to as string) : undefined;
      
      const stats = await dashboardService.getDashboardStats(
        req.user.id,
        dateFrom,
        dateTo
      );
      
      return sendSuccess(res, stats);
    } catch (error) {
      return sendServerError(res);
    }
  }

  async getFinancialInsights(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const insights = await dashboardService.getFinancialInsights(req.user.id);
      
      return sendSuccess(res, insights);
    } catch (error) {
      return sendServerError(res);
    }
  }
}