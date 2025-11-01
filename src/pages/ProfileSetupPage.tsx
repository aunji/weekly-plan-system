import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Department, Language } from '@/types';

const departments: Department[] = ['IT', 'Game', 'Design', 'QA', 'Marketing', 'Management', 'Other'];
const languages: Language[] = ['en', 'th'];

export const ProfileSetupPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { updateUserProfile } = useAuth();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState<Department>('IT');
  const [language, setLanguage] = useState<Language>('en');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.length < 2) {
      setError(t('validation.nameTooShort'));
      return;
    }

    setLoading(true);

    try {
      await updateUserProfile({
        name,
        department,
        language,
        projects: [],
      });

      // Update i18n language
      i18n.changeLanguage(language);

      navigate('/');
    } catch (err) {
      setError('Failed to setup profile. Please try again.');
      console.error('Profile setup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.setupProfile')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.completeProfile')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t('profile.name')} *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder={t('profile.name')}
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                {t('profile.department')} *
              </label>
              <select
                id="department"
                name="department"
                required
                value={department}
                onChange={e => setDepartment(e.target.value as Department)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {t(`departments.${dept}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                {t('profile.language')} *
              </label>
              <select
                id="language"
                name="language"
                required
                value={language}
                onChange={e => setLanguage(e.target.value as Language)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang === 'en' ? 'English' : 'ไทย'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading') : t('common.confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
