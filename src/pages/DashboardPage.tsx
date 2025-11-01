import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { WeekSelector } from '@/components/dashboard/WeekSelector';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { PlanCard } from '@/components/dashboard/PlanCard';
import { useTeamPlans } from '@/hooks/useTeamPlans';
import { getCurrentWeekIdentifier } from '@/utils/date';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { userData, logout } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeekIdentifier());

  const { filteredPlans, loading, filters, setFilters } = useTeamPlans(currentWeek);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{t('common.appName')}</h1>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <Link
                  to="/"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
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
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
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
        {/* Week Selector */}
        <WeekSelector currentWeek={currentWeek} onWeekChange={setCurrentWeek} />

        {/* Filter Bar */}
        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {/* Plans Grid */}
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
        ) : filteredPlans.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('dashboard.noPlansFound')}
            </h3>
            <p className="text-gray-600 mb-4">
              {filters.department || filters.searchQuery || filters.showBlockersOnly || filters.showOffDaysOnly
                ? 'Try adjusting your filters'
                : 'No plans submitted for this week yet'}
            </p>
            <Link to="/my-plan" className="btn-primary inline-block">
              {t('plan.createPlan')}
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {t('dashboard.allPlans')}: {filteredPlans.length}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map(plan => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};
