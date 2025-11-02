import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDepartments } from '@/hooks/useDepartments';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export const DepartmentPage: React.FC = () => {
  const { t } = useTranslation();
  const { userData, logout } = useAuth();
  const { departments, loading, error, createDepartment, updateDepartment, toggleDepartmentStatus, deleteDepartment } = useDepartments();

  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (!newDepartmentName.trim()) {
      setErrorMessage('Department name is required');
      return;
    }

    const department = await createDepartment(newDepartmentName);
    if (department) {
      setNewDepartmentName('');
      setMessage(t('department.departmentCreated'));
      setTimeout(() => setMessage(''), 3000);
    } else {
      setErrorMessage('Failed to create department. Check console for details.');
    }
  };

  const handleSaveDepartmentEdit = async (departmentId: string) => {
    if (!editDepartmentName.trim()) {
      return;
    }

    const success = await updateDepartment(departmentId, { name: editDepartmentName });
    if (success) {
      setEditingDepartment(null);
      setEditDepartmentName('');
      setMessage(t('department.departmentUpdated'));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteDepartment = async (departmentId: string, departmentName: string) => {
    if (window.confirm(`Are you sure you want to delete "${departmentName}"?`)) {
      const success = await deleteDepartment(departmentId);
      if (success) {
        setMessage(t('department.departmentDeleted'));
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">{t('common.appName')}</h1>
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
                  to="/departments"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('department.manageDepartments')}</h2>

          {/* Add New Department */}
          <form onSubmit={handleAddDepartment} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newDepartmentName}
                onChange={e => setNewDepartmentName(e.target.value)}
                placeholder={t('department.newDepartmentName')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {t('department.addDepartment')}
              </button>
            </div>
          </form>

          {message && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">{message}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">Error loading departments: {error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
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
          ) : (
            <div className="space-y-2">
              {departments.length === 0 ? (
                <p className="text-sm text-gray-500">{t('department.noDepartments')}</p>
              ) : (
                departments.map(department => (
                <div
                  key={department.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                >
                  {editingDepartment === department.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editDepartmentName}
                        onChange={e => setEditDepartmentName(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveDepartmentEdit(department.id)}
                        className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
                      >
                        {t('common.save')}
                      </button>
                      <button
                        onClick={() => {
                          setEditingDepartment(null);
                          setEditDepartmentName('');
                        }}
                        className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm ${department.isActive ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                          {department.name}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${department.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {department.isActive ? t('department.active') : t('department.inactive')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingDepartment(department.id);
                            setEditDepartmentName(department.name);
                          }}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {t('common.edit')}
                        </button>
                        <button
                          onClick={() => toggleDepartmentStatus(department.id, !department.isActive)}
                          className={`text-sm font-medium ${department.isActive ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}`}
                        >
                          {department.isActive ? t('department.deactivate') : t('department.activate')}
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(department.id, department.name)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
