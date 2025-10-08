import prisma from '@/config/database';
import { TransactionService } from './transaction.service';
import { GoalService } from './goal.service';
import { DashboardStats } from '@/types';

export class DashboardService {
  private transactionService = new TransactionService();
  private goalService = new GoalService();

  async getDashboardStats(userId: string, dateFrom?: Date, dateTo?: Date): Promise<DashboardStats> {
    // Get transaction stats
    const transactionStats = await this.transactionService.getTransactionStats(userId, dateFrom, dateTo);
    
    // Get goal stats
    const goalStats = await this.goalService.getGoalStats(userId);
    
    // Get recent transactions
    const recentTransactionsResult = await this.transactionService.getTransactions(
      userId,
      {},
      { page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }
    );

    // Get course progress
    const courseProgress = await prisma.progress.findMany({
      where: {
        userId,
        lessonId: null // Course-level progress only
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 5
    });

    return {
      totalIncome: transactionStats.totalIncome,
      totalExpenses: transactionStats.totalExpenses,
      totalSavings: transactionStats.totalSavings,
      netBalance: transactionStats.netBalance,
      goalProgress: {
        completed: goalStats.completed,
        active: goalStats.active,
        totalSaved: goalStats.totalSavedAmount,
      },
      recentTransactions: recentTransactionsResult.transactions,
      monthlyTrends: transactionStats.monthlyTrends,
      categoryBreakdown: transactionStats.categoryBreakdown,
      courseProgress: courseProgress.map(progress => ({
        courseId: progress.courseId,
        courseTitle: progress.course.title,
        courseThumbnail: progress.course.thumbnail,
        progress: progress.percentComplete,
        lastAccessed: progress.updatedAt,
      }))
    };
  }

  async getFinancialInsights(userId: string): Promise<any> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Get current period stats (last 30 days)
    const currentPeriodStats = await this.transactionService.getTransactionStats(
      userId,
      thirtyDaysAgo
    );

    // Get previous period stats (30-60 days ago)
    const previousPeriodStats = await this.transactionService.getTransactionStats(
      userId,
      sixtyDaysAgo,
      thirtyDaysAgo
    );

    // Calculate trends
    const incomeChange = this.calculatePercentageChange(
      previousPeriodStats.totalIncome,
      currentPeriodStats.totalIncome
    );

    const expenseChange = this.calculatePercentageChange(
      previousPeriodStats.totalExpenses,
      currentPeriodStats.totalExpenses
    );

    const savingsChange = this.calculatePercentageChange(
      previousPeriodStats.totalSavings,
      currentPeriodStats.totalSavings
    );

    // Generate insights
    const insights = [];

    if (incomeChange > 10) {
      insights.push({
        type: 'positive',
        title: 'Income Growth',
        message: `Your income increased by ${incomeChange.toFixed(1)}% this month!`,
        icon: '📈'
      });
    } else if (incomeChange < -10) {
      insights.push({
        type: 'warning',
        title: 'Income Decrease',
        message: `Your income decreased by ${Math.abs(incomeChange).toFixed(1)}% this month.`,
        icon: '📉'
      });
    }

    if (expenseChange > 20) {
      insights.push({
        type: 'warning',
        title: 'High Spending',
        message: `Your expenses increased by ${expenseChange.toFixed(1)}% this month. Consider reviewing your budget.`,
        icon: '⚠️'
      });
    } else if (expenseChange < -10) {
      insights.push({
        type: 'positive',
        title: 'Great Savings',
        message: `You reduced your expenses by ${Math.abs(expenseChange).toFixed(1)}% this month!`,
        icon: '💰'
      });
    }

    if (savingsChange > 15) {
      insights.push({
        type: 'positive',
        title: 'Savings Boost',
        message: `Your savings increased by ${savingsChange.toFixed(1)}% this month!`,
        icon: '🎯'
      });
    }

    // Check goal progress
    const activeGoals = await prisma.goal.findMany({
      where: {
        userId,
        status: 'ACTIVE'
      }
    });

    const goalsNearDeadline = activeGoals.filter(goal => {
      if (!goal.deadline) return false;
      const daysUntilDeadline = Math.ceil(
        (goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilDeadline <= 30 && daysUntilDeadline > 0;
    });

    if (goalsNearDeadline.length > 0) {
      insights.push({
        type: 'info',
        title: 'Goal Deadline Approaching',
        message: `You have ${goalsNearDeadline.length} goal(s) with deadlines in the next 30 days.`,
        icon: '⏰'
      });
    }

    return {
      currentPeriod: currentPeriodStats,
      previousPeriod: previousPeriodStats,
      trends: {
        income: incomeChange,
        expenses: expenseChange,
        savings: savingsChange,
      },
      insights,
    };
  }

  private calculatePercentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
  }
}