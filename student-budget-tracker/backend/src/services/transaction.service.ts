import prisma from '@/config/database';
import { Transaction, TransactionType } from '@prisma/client';
import { TransactionFilters, PaginationParams } from '@/types';

export class TransactionService {
  async createTransaction(
    userId: string,
    type: TransactionType,
    amount: number,
    category: string,
    date: Date,
    notes?: string
  ): Promise<Transaction> {
    // Convert amount to cents for storage
    const amountInCents = Math.round(amount * 100);

    return prisma.transaction.create({
      data: {
        userId,
        type,
        amount: amountInCents,
        category,
        date,
        notes,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
  }

  async getTransactions(
    userId: string,
    filters: TransactionFilters = {},
    pagination: PaginationParams = {}
  ) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'date',
      sortOrder = 'desc'
    } = pagination;

    const {
      type,
      category,
      dateFrom,
      dateTo
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      userId,
    };

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = {
        contains: category,
        mode: 'insensitive'
      };
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) {
        where.date.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.date.lte = new Date(dateTo);
      }
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        },
      }),
      prisma.transaction.count({ where })
    ]);

    // Convert amounts back to dollars for response
    const transactionsWithDollarAmounts = transactions.map(transaction => ({
      ...transaction,
      amount: transaction.amount / 100
    }));

    return {
      transactions: transactionsWithDollarAmounts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getTransactionById(userId: string, transactionId: string): Promise<Transaction | null> {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId
      }
    });

    if (transaction) {
      return {
        ...transaction,
        amount: transaction.amount / 100
      };
    }

    return null;
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    updates: Partial<{
      type: TransactionType;
      amount: number;
      category: string;
      date: Date;
      notes: string;
    }>
  ): Promise<Transaction | null> {
    // Check if transaction belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId
      }
    });

    if (!existingTransaction) {
      return null;
    }

    // Convert amount to cents if provided
    const updateData = { ...updates };
    if (updates.amount !== undefined) {
      updateData.amount = Math.round(updates.amount * 100);
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: updateData
    });

    return {
      ...updatedTransaction,
      amount: updatedTransaction.amount / 100
    };
  }

  async deleteTransaction(userId: string, transactionId: string): Promise<boolean> {
    try {
      await prisma.transaction.deleteMany({
        where: {
          id: transactionId,
          userId
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getTransactionStats(userId: string, dateFrom?: Date, dateTo?: Date) {
    const where: any = { userId };

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = dateFrom;
      if (dateTo) where.date.lte = dateTo;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      select: {
        type: true,
        amount: true,
        date: true,
        category: true
      }
    });

    const stats = {
      totalIncome: 0,
      totalExpenses: 0,
      totalSavings: 0,
      netBalance: 0,
      categoryBreakdown: {} as Record<string, number>,
      monthlyTrends: [] as Array<{
        month: string;
        income: number;
        expenses: number;
        savings: number;
      }>
    };

    const monthlyData: Record<string, { income: number; expenses: number; savings: number }> = {};

    transactions.forEach(transaction => {
      const amountInDollars = transaction.amount / 100;
      
      // Calculate totals
      switch (transaction.type) {
        case 'INCOME':
          stats.totalIncome += amountInDollars;
          break;
        case 'EXPENSE':
          stats.totalExpenses += amountInDollars;
          break;
        case 'SAVINGS':
          stats.totalSavings += amountInDollars;
          break;
      }

      // Category breakdown
      if (!stats.categoryBreakdown[transaction.category]) {
        stats.categoryBreakdown[transaction.category] = 0;
      }
      stats.categoryBreakdown[transaction.category] += amountInDollars;

      // Monthly trends
      const monthKey = transaction.date.toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0, savings: 0 };
      }

      switch (transaction.type) {
        case 'INCOME':
          monthlyData[monthKey].income += amountInDollars;
          break;
        case 'EXPENSE':
          monthlyData[monthKey].expenses += amountInDollars;
          break;
        case 'SAVINGS':
          monthlyData[monthKey].savings += amountInDollars;
          break;
      }
    });

    stats.netBalance = stats.totalIncome - stats.totalExpenses;

    // Convert monthly data to array and sort by month
    stats.monthlyTrends = Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return stats;
  }
}