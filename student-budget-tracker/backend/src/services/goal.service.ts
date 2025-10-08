import prisma from '@/config/database';
import { Goal, GoalStatus } from '@prisma/client';

export class GoalService {
  async createGoal(
    userId: string,
    title: string,
    targetAmount: number,
    deadline?: Date
  ): Promise<Goal> {
    const targetAmountInCents = Math.round(targetAmount * 100);

    return prisma.goal.create({
      data: {
        userId,
        title,
        targetAmount: targetAmountInCents,
        deadline,
      }
    });
  }

  async getGoals(userId: string) {
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return goals.map(goal => ({
      ...goal,
      targetAmount: goal.targetAmount / 100,
      savedAmount: goal.savedAmount / 100,
      progress: goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0
    }));
  }

  async getGoalById(userId: string, goalId: string): Promise<Goal | null> {
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId
      }
    });

    if (goal) {
      return {
        ...goal,
        targetAmount: goal.targetAmount / 100,
        savedAmount: goal.savedAmount / 100
      };
    }

    return null;
  }

  async updateGoal(
    userId: string,
    goalId: string,
    updates: Partial<{
      title: string;
      targetAmount: number;
      deadline: Date;
      status: GoalStatus;
    }>
  ): Promise<Goal | null> {
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId
      }
    });

    if (!existingGoal) {
      return null;
    }

    const updateData = { ...updates };
    if (updates.targetAmount !== undefined) {
      updateData.targetAmount = Math.round(updates.targetAmount * 100);
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: updateData
    });

    return {
      ...updatedGoal,
      targetAmount: updatedGoal.targetAmount / 100,
      savedAmount: updatedGoal.savedAmount / 100
    };
  }

  async addToGoal(userId: string, goalId: string, amount: number): Promise<Goal | null> {
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId
      }
    });

    if (!goal) {
      return null;
    }

    const amountInCents = Math.round(amount * 100);
    const newSavedAmount = goal.savedAmount + amountInCents;
    
    // Check if goal is completed
    const status = newSavedAmount >= goal.targetAmount ? GoalStatus.COMPLETED : goal.status;

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        savedAmount: newSavedAmount,
        status
      }
    });

    return {
      ...updatedGoal,
      targetAmount: updatedGoal.targetAmount / 100,
      savedAmount: updatedGoal.savedAmount / 100
    };
  }

  async deleteGoal(userId: string, goalId: string): Promise<boolean> {
    try {
      await prisma.goal.deleteMany({
        where: {
          id: goalId,
          userId
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getGoalStats(userId: string) {
    const goals = await prisma.goal.findMany({
      where: { userId },
      select: {
        status: true,
        targetAmount: true,
        savedAmount: true
      }
    });

    const stats = {
      total: goals.length,
      active: 0,
      completed: 0,
      paused: 0,
      cancelled: 0,
      totalTargetAmount: 0,
      totalSavedAmount: 0,
      averageProgress: 0
    };

    let totalProgress = 0;

    goals.forEach(goal => {
      stats[goal.status.toLowerCase() as keyof typeof stats]++;
      stats.totalTargetAmount += goal.targetAmount / 100;
      stats.totalSavedAmount += goal.savedAmount / 100;
      
      if (goal.targetAmount > 0) {
        totalProgress += (goal.savedAmount / goal.targetAmount) * 100;
      }
    });

    stats.averageProgress = goals.length > 0 ? totalProgress / goals.length : 0;

    return stats;
  }
}