import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE' | 'SAVINGS';
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  netBalance: number;
  goalProgress: {
    completed: number;
    active: number;
    totalSaved: number;
  };
  recentTransactions: any[];
  monthlyTrends: {
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }[];
  categoryBreakdown: Record<string, number>;
  courseProgress: {
    courseId: string;
    courseTitle: string;
    courseThumbnail: string | null;
    progress: number;
    lastAccessed: Date;
  }[];
}