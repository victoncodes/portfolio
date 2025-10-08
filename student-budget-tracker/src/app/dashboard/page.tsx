'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { DashboardStats, FinancialInsights } from '@/types';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [insights, setInsights] = useState<FinancialInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, insightsResponse] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getFinancialInsights(),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (insightsResponse.success) {
        setInsights(insightsResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Here's your financial overview for today.
        </p>
      </motion.div>

      {/* Financial Overview Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={itemVariants}
      >
        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats?.totalIncome || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          {insights && (
            <div className="mt-4 flex items-center text-sm">
              <span className={`font-medium ${insights.trends.income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {insights.trends.income >= 0 ? '+' : ''}{insights.trends.income.toFixed(1)}%
              </span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(stats?.totalExpenses || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
          </div>
          {insights && (
            <div className="mt-4 flex items-center text-sm">
              <span className={`font-medium ${insights.trends.expenses <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {insights.trends.expenses >= 0 ? '+' : ''}{insights.trends.expenses.toFixed(1)}%
              </span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Savings</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats?.totalSavings || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          {insights && (
            <div className="mt-4 flex items-center text-sm">
              <span className={`font-medium ${insights.trends.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {insights.trends.savings >= 0 ? '+' : ''}{insights.trends.savings.toFixed(1)}%
              </span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${(stats?.netBalance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stats?.netBalance || 0)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${(stats?.netBalance || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <svg className={`w-6 h-6 ${(stats?.netBalance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Income - Expenses
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Transaction
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Create Goal
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Browse Courses
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Analytics
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Financial Insights */}
      {insights && insights.insights.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Insights</h2>
            <div className="space-y-4">
              {insights.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.type === 'positive'
                      ? 'bg-green-50 border-green-400'
                      : insight.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-400'
                      : 'bg-blue-50 border-blue-400'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{insight.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{insight.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Goals Progress */}
      {stats && stats.goalProgress && (
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Goals Overview</h2>
              <Button variant="outline" size="sm">
                View All Goals
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.goalProgress.active}</div>
                <div className="text-sm text-gray-600">Active Goals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.goalProgress.completed}</div>
                <div className="text-sm text-gray-600">Completed Goals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.goalProgress.totalSaved)}
                </div>
                <div className="text-sm text-gray-600">Total Saved</div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recent Transactions */}
      {stats && stats.recentTransactions && stats.recentTransactions.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {stats.recentTransactions.slice(0, 5).map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'INCOME'
                        ? 'bg-green-100 text-green-600'
                        : transaction.type === 'EXPENSE'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {transaction.type === 'INCOME' ? '+' : transaction.type === 'EXPENSE' ? '-' : '$'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.category}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'INCOME'
                      ? 'text-green-600'
                      : transaction.type === 'EXPENSE'
                      ? 'text-red-600'
                      : 'text-blue-600'
                  }`}>
                    {transaction.type === 'EXPENSE' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DashboardPage;