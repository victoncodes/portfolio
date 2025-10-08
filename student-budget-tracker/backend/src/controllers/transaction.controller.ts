import { Response } from 'express';
import { TransactionService } from '@/services/transaction.service';
import { sendSuccess, sendError, sendServerError } from '@/utils/response';
import { AuthenticatedRequest, TransactionFilters, PaginationParams } from '@/types';

const transactionService = new TransactionService();

export class TransactionController {
  async createTransaction(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const { type, amount, category, date, notes } = req.body;
      
      const transaction = await transactionService.createTransaction(
        req.user.id,
        type,
        amount,
        category,
        new Date(date),
        notes
      );
      
      return sendSuccess(res, transaction, 'Transaction created successfully', 201);
    } catch (error) {
      if (error instanceof Error) {
        return sendError(res, error.message, 400);
      }
      return sendServerError(res);
    }
  }

  async getTransactions(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const filters: TransactionFilters = {
        type: req.query.type as any,
        category: req.query.category as string,
        dateFrom: req.query.from as string,
        dateTo: req.query.to as string,
      };

      const pagination: PaginationParams = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const result = await transactionService.getTransactions(
        req.user.id,
        filters,
        pagination
      );
      
      return sendSuccess(res, result);
    } catch (error) {
      return sendServerError(res);
    }
  }

  async getTransaction(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const { id } = req.params;
      
      const transaction = await transactionService.getTransactionById(req.user.id, id);
      
      if (!transaction) {
        return sendError(res, 'Transaction not found', 404);
      }
      
      return sendSuccess(res, transaction);
    } catch (error) {
      return sendServerError(res);
    }
  }

  async updateTransaction(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const { id } = req.params;
      const updates = req.body;
      
      const transaction = await transactionService.updateTransaction(
        req.user.id,
        id,
        updates
      );
      
      if (!transaction) {
        return sendError(res, 'Transaction not found', 404);
      }
      
      return sendSuccess(res, transaction, 'Transaction updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        return sendError(res, error.message, 400);
      }
      return sendServerError(res);
    }
  }

  async deleteTransaction(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const { id } = req.params;
      
      const deleted = await transactionService.deleteTransaction(req.user.id, id);
      
      if (!deleted) {
        return sendError(res, 'Transaction not found', 404);
      }
      
      return sendSuccess(res, null, 'Transaction deleted successfully');
    } catch (error) {
      return sendServerError(res);
    }
  }

  async getTransactionStats(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const dateFrom = req.query.from ? new Date(req.query.from as string) : undefined;
      const dateTo = req.query.to ? new Date(req.query.to as string) : undefined;
      
      const stats = await transactionService.getTransactionStats(
        req.user.id,
        dateFrom,
        dateTo
      );
      
      return sendSuccess(res, stats);
    } catch (error) {
      return sendServerError(res);
    }
  }
}