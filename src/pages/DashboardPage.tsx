import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { userData, logout } = useAuth();

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
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">{t('dashboard.teamDashboard')}</h2>
          <p className="text-gray-600 mb-4">
            Welcome to the Weekly Plan System! This dashboard will show all team plans.
          </p>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-900">Week 2 Complete!</h3>
            <ul className="mt-2 space-y-1 text-sm text-green-800">
              <li>✓ Plan Editor with daily/summary modes</li>
              <li>✓ Monday-Friday task inputs</li>
              <li>✓ Blocker tracking with severity levels</li>
              <li>✓ Weekly summary mode</li>
              <li>✓ Firestore integration with real-time updates</li>
              <li>✓ Update logging</li>
              <li>✓ Keyboard shortcuts (Ctrl+S to save)</li>
            </ul>
            <p className="mt-4 text-sm text-green-700">
              <Link to="/my-plan" className="font-medium underline">
                Create your weekly plan →
              </Link>
            </p>
            <p className="mt-2 text-sm text-green-700">
              Next up: Week 3 - Real-time team dashboard with blocker indicators
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
