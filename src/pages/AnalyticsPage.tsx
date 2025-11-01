import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { WeekSelector } from '@/components/dashboard/WeekSelector';
import { WeeklyStats } from '@/components/analytics/WeeklyStats';
import { BlockerTrends } from '@/components/analytics/BlockerTrends';
import { useAnalytics, useMultiWeekAnalytics } from '@/hooks/useAnalytics';
import { getCurrentWeekIdentifier } from '@/utils/date';
import type { WeeklyPlan } from '@/types';
import { getAllWeeklyPlans } from '@/services/planService';

export const AnalyticsPage: React.FC = () => {
  const { t } = useTranslation();
  const { userData, logout } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeekIdentifier());
  const [showTrends, setShowTrends] = useState(false);

  const { analytics, loading } = useAnalytics(currentWeek);

  // Get last 4 weeks for trends
  const getLast4Weeks = (current: string): string[] => {
    const [year, weekNum] = current.split('-W').map(Number);
    const weeks: string[] = [];

    for (let i = 3; i >= 0; i--) {
      let w = weekNum - i;
      let y = year;

      if (w < 1) {
        w = 52 + w;
        y = year - 1;
      }

      weeks.push(`${y}-W${w.toString().padStart(2, '0')}`);
    }

    return weeks;
  };

  const multiWeekData = useMultiWeekAnalytics(showTrends ? getLast4Weeks(currentWeek) : []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const exportToCSV = async () => {
    try {
      const plans = await getAllWeeklyPlans(currentWeek);

      // CSV Header
      let csv = 'Week,User,Department,Mode,Tasks,Blockers (High/Med/Low),Off Days\n';

      plans.forEach((plan: WeeklyPlan) => {
        const taskCount = plan.mode === 'daily'
          ? plan.dailyPlans.reduce((sum, day) => sum + day.tasks.filter(t => t.trim()).length, 0)
          : 0;

        const blockers = plan.dailyPlans.reduce((acc, day) => {
          day.blockers.forEach(b => {
            if (!b.isResolved) {
              if (b.severity === 'high') acc.high++;
              else if (b.severity === 'medium') acc.medium++;
              else acc.low++;
            }
          });
          return acc;
        }, { high: 0, medium: 0, low: 0 });

        const offDays = plan.dailyPlans.filter(d => d.isOffDay).length;

        csv += `${plan.weekIdentifier},"${plan.userName}",${plan.userDepartment},${plan.mode},${taskCount},"${blockers.high}/${blockers.medium}/${blockers.low}",${offDays}\n`;
      });

      // Download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `weekly-plans-${currentWeek}.csv`;
      link.click();
    } catch (error) {
      console.error('Export CSV error:', error);
    }
  };

  const exportToJSON = async () => {
    try {
      const plans = await getAllWeeklyPlans(currentWeek);

      const data = {
        week: currentWeek,
        exportDate: new Date().toISOString(),
        analytics: analytics,
        plans: plans.map((plan: WeeklyPlan) => ({
          user: plan.userName,
          department: plan.userDepartment,
          mode: plan.mode,
          dailyPlans: plan.dailyPlans.map(day => ({
            date: day.date,
            isOffDay: day.isOffDay,
            tasks: day.tasks.filter(t => t.trim()),
            blockers: day.blockers.map(b => ({
              description: b.description,
              severity: b.severity,
              isResolved: b.isResolved,
            })),
          })),
          summary: plan.summary,
        })),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `weekly-plans-${currentWeek}.json`;
      link.click();
    } catch (error) {
      console.error('Export JSON error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  {t('navigation.dashboard')}
                </Link>
                <Link
                  to="/my-plan"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  {t('navigation.myPlan')}
                </Link>
                <Link
                  to="/analytics"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Analytics
                </Link>
              </nav>
              <LanguageSwitcher />
              <span className="text-sm text-gray-600">{userData?.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                {t('auth.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <WeekSelector currentWeek={currentWeek} onWeekChange={setCurrentWeek} />

          <div className="flex gap-3">
            <button
              onClick={() => setShowTrends(!showTrends)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                showTrends
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {showTrends ? 'Hide Trends' : 'Show Trends'}
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Export CSV
            </button>
            <button
              onClick={exportToJSON}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Export JSON
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="card text-center py-12">
            <svg
              className="animate-spin h-8 w-8 mx-auto mb-4 text-primary-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        ) : analytics ? (
          <>
            {/* Weekly Stats */}
            <WeeklyStats analytics={analytics} />

            {/* Trends */}
            {showTrends && multiWeekData && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">4-Week Trends</h2>
                <BlockerTrends data={multiWeekData} />
              </div>
            )}
          </>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">No plans found for this week.</p>
          </div>
        )}
      </main>
    </div>
  );
};
