import React from 'react';
import { useTranslation } from 'react-i18next';
import type { WeeklyAnalytics } from '@/hooks/useAnalytics';
import type { Department } from '@/types';

interface WeeklyStatsProps {
  analytics: WeeklyAnalytics;
}

export const WeeklyStats: React.FC<WeeklyStatsProps> = ({ analytics }) => {
  const { t } = useTranslation();

  const departments: Department[] = ['IT', 'Game', 'Design', 'QA', 'Marketing', 'Management', 'Other'];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Plans */}
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600">Total Plans</p>
              <p className="text-3xl font-bold text-primary-900 mt-1">{analytics.totalPlans}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>

        {/* Active Blockers */}
        <div className="card bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Active Blockers</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{analytics.blockers.active}</p>
              <p className="text-xs text-red-600 mt-1">
                {analytics.blockers.resolved} resolved
              </p>
            </div>
            <div className="text-4xl">🚫</div>
          </div>
        </div>

        {/* Off Days */}
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Off Days</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{analytics.offDays.total}</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>

        {/* Avg Tasks */}
        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Avg Tasks/Plan</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{analytics.tasksStats.avgTasksPerPlan}</p>
              <p className="text-xs text-green-600 mt-1">
                {analytics.tasksStats.totalTasks} total tasks
              </p>
            </div>
            <div className="text-4xl">✓</div>
          </div>
        </div>
      </div>

      {/* Mode Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Planning Mode Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-primary-500"></span>
                <span className="text-sm text-gray-700">{t('plan.dailyMode')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">{analytics.plansByMode.daily}</span>
                <span className="text-xs text-gray-500">
                  ({analytics.totalPlans > 0 ? Math.round((analytics.plansByMode.daily / analytics.totalPlans) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="text-sm text-gray-700">{t('plan.summaryMode')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">{analytics.plansByMode.summary}</span>
                <span className="text-xs text-gray-500">
                  ({analytics.totalPlans > 0 ? Math.round((analytics.plansByMode.summary / analytics.totalPlans) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Blocker Severity */}
        <div className="card">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Blocker Severity Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-sm text-gray-700">{t('plan.severityHigh')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">{analytics.blockers.bySeverity.high}</span>
                <span className="text-xs text-gray-500">
                  ({analytics.blockers.total > 0 ? Math.round((analytics.blockers.bySeverity.high / analytics.blockers.total) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="text-sm text-gray-700">{t('plan.severityMedium')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">{analytics.blockers.bySeverity.medium}</span>
                <span className="text-xs text-gray-500">
                  ({analytics.blockers.total > 0 ? Math.round((analytics.blockers.bySeverity.medium / analytics.blockers.total) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="text-sm text-gray-700">{t('plan.severityLow')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">{analytics.blockers.bySeverity.low}</span>
                <span className="text-xs text-gray-500">
                  ({analytics.blockers.total > 0 ? Math.round((analytics.blockers.bySeverity.low / analytics.blockers.total) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Stats */}
      <div className="card">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">Plans by Department</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {departments.map(dept => (
            <div key={dept} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{analytics.plansByDepartment[dept]}</div>
              <div className="text-xs text-gray-600 mt-1">{t(`departments.${dept}`)}</div>
              {analytics.offDays.byDepartment[dept] > 0 && (
                <div className="text-xs text-blue-600 mt-1">
                  {analytics.offDays.byDepartment[dept]} off-days
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
