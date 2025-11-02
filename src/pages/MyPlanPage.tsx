import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePlan } from '@/hooks/usePlan';
import { PlanEditor } from '@/components/plan/PlanEditor';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { getCurrentWeekIdentifier, formatWeekIdentifier } from '@/utils/date';

export const MyPlanPage: React.FC = () => {
  const { t } = useTranslation();
  const { userData, logout } = useAuth();
  const [searchParams] = useSearchParams();

  // Read week from URL parameter, fallback to current week if not provided
  const weekIdentifier = searchParams.get('week') || getCurrentWeekIdentifier();

  const { plan, loading, error, savePlan } = usePlan(
    userData?.id || '',
    userData?.name || '',
    userData?.department || 'Other',
    weekIdentifier
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('common.appName')}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {formatWeekIdentifier(weekIdentifier)}
              </p>
            </div>
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
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('navigation.myPlan')}
                </Link>
                <Link
                  to="/departments"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  {t('navigation.departments')}
                </Link>
                <Link
                  to="/profile"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  {t('navigation.profile')}
                </Link>
              </nav>
              <LanguageSwitcher />
              <span className="text-sm text-gray-600">{userData.name}</span>
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
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{t('plan.myPlan')}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {t('plan.createPlan')} - {formatWeekIdentifier(weekIdentifier)}
          </p>
        </div>

        {loading && !plan ? (
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
        ) : error ? (
          <div className="card">
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        ) : (
          <PlanEditor
            initialData={
              plan
                ? {
                    mode: plan.mode,
                    dailyPlans: plan.dailyPlans,
                    summary: plan.summary,
                  }
                : undefined
            }
            onSave={savePlan}
            weekIdentifier={weekIdentifier}
          />
        )}
      </main>
    </div>
  );
};
