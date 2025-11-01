import React from 'react';
import type { MultiWeekAnalytics } from '@/hooks/useAnalytics';

interface BlockerTrendsProps {
  data: MultiWeekAnalytics;
}

export const BlockerTrends: React.FC<BlockerTrendsProps> = ({ data }) => {
  const maxBlockers = Math.max(...data.blockerTrends.map(d => d.total), 1);
  const maxPlans = Math.max(...data.planCountTrends.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Blocker Trends */}
      <div className="card">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">Blocker Trends Over Time</h3>
        <div className="space-y-4">
          {data.blockerTrends.map(trend => {
            const activePercent = (trend.active / maxBlockers) * 100;
            const resolvedPercent = (trend.resolved / maxBlockers) * 100;

            return (
              <div key={trend.week}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-700 w-20">{trend.week}</span>
                  <div className="flex-1">
                    <div className="flex gap-1">
                      {/* Active Blockers */}
                      <div
                        className="bg-red-500 h-8 rounded-l transition-all flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${activePercent}%`, minWidth: trend.active > 0 ? '2rem' : '0' }}
                      >
                        {trend.active > 0 && trend.active}
                      </div>
                      {/* Resolved Blockers */}
                      <div
                        className="bg-green-500 h-8 rounded-r transition-all flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${resolvedPercent}%`, minWidth: trend.resolved > 0 ? '2rem' : '0' }}
                      >
                        {trend.resolved > 0 && trend.resolved}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {trend.total} total
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded bg-red-500"></span>
            <span className="text-gray-600">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded bg-green-500"></span>
            <span className="text-gray-600">Resolved</span>
          </div>
        </div>
      </div>

      {/* Plan Count Trends */}
      <div className="card">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">Plan Submissions Over Time</h3>
        <div className="space-y-4">
          {data.planCountTrends.map(trend => {
            const percent = (trend.count / maxPlans) * 100;

            return (
              <div key={trend.week}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-700 w-20">{trend.week}</span>
                  <div className="flex-1">
                    <div
                      className="bg-primary-500 h-8 rounded transition-all flex items-center justify-center text-white text-sm font-medium"
                      style={{ width: `${percent}%`, minWidth: trend.count > 0 ? '3rem' : '0' }}
                    >
                      {trend.count > 0 && trend.count}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {trend.count} plans
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gray-50">
          <p className="text-sm text-gray-600 mb-1">Total Weeks Tracked</p>
          <p className="text-2xl font-bold text-gray-900">{data.weeks.length}</p>
        </div>
        <div className="card bg-gray-50">
          <p className="text-sm text-gray-600 mb-1">Avg Blockers/Week</p>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round((data.blockerTrends.reduce((sum, t) => sum + t.total, 0) / data.weeks.length) * 10) / 10}
          </p>
        </div>
        <div className="card bg-gray-50">
          <p className="text-sm text-gray-600 mb-1">Avg Plans/Week</p>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round((data.planCountTrends.reduce((sum, t) => sum + t.count, 0) / data.weeks.length) * 10) / 10}
          </p>
        </div>
      </div>
    </div>
  );
};
