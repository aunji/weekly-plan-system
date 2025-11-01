import React from 'react';
import { useTranslation } from 'react-i18next';
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
          <p className="text-gray-600">
            Welcome to the Weekly Plan System! This dashboard will show all team plans.
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900">Week 1 Complete!</h3>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>✓ React + Vite + TypeScript setup</li>
              <li>✓ Tailwind CSS configured</li>
              <li>✓ Firebase authentication working</li>
              <li>✓ i18n (Thai/English) functional</li>
              <li>✓ TypeScript types defined</li>
              <li>✓ Protected routes implemented</li>
            </ul>
            <p className="mt-4 text-sm text-blue-700">
              Next up: Week 2 - Plan Editor with daily/summary modes
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
