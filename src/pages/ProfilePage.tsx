import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { useDepartments } from '@/hooks/useDepartments';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import type { Department, Language } from '@/types';

export const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { userData, updateUserProfile, logout } = useAuth();
  const { projects, createProject, updateProject, toggleProjectStatus } = useProjects();
  const { activeDepartments } = useDepartments();

  // User settings form
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<Department>('IT');
  const [language, setLanguage] = useState<Language>('en');
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  // Project management
  const [newProjectName, setNewProjectName] = useState('');
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [projectMessage, setProjectMessage] = useState('');

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setDepartment(userData.department);
      setLanguage(userData.language);
    }
  }, [userData]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMessage('');

    if (name.length < 2) {
      setSettingsMessage(t('validation.nameTooShort'));
      return;
    }

    setSettingsSaving(true);

    try {
      await updateUserProfile({
        name,
        department,
        language,
        projects: userData?.projects || [],
      });

      // Update i18n language
      i18n.changeLanguage(language);
      setSettingsMessage(t('profile.profileUpdated'));
    } catch (err) {
      setSettingsMessage('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectMessage('');

    if (!newProjectName.trim()) {
      setProjectMessage('Project name is required');
      return;
    }

    const project = await createProject(newProjectName);
    if (project) {
      setNewProjectName('');
      setProjectMessage(t('profile.projectCreated'));
    }
  };

  const handleSaveProjectEdit = async (projectId: string) => {
    if (!editProjectName.trim()) {
      return;
    }

    const success = await updateProject(projectId, { name: editProjectName });
    if (success) {
      setEditingProject(null);
      setEditProjectName('');
      setProjectMessage(t('profile.projectUpdated'));
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
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  {t('navigation.departments')}
                </Link>
                <Link
                  to="/profile"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
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
        <div className="space-y-8">
          {/* User Settings Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('profile.settings')}</h2>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              {settingsMessage && (
                <div className={`rounded-md p-4 ${settingsMessage.includes('success') || settingsMessage.includes(t('profile.profileUpdated')) ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className={`text-sm ${settingsMessage.includes('success') || settingsMessage.includes(t('profile.profileUpdated')) ? 'text-green-800' : 'text-red-800'}`}>
                    {settingsMessage}
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {t('profile.name')} *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  {t('profile.department')} *
                </label>
                <select
                  id="department"
                  required
                  value={department}
                  onChange={e => setDepartment(e.target.value as Department)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {activeDepartments.length > 0 ? (
                    activeDepartments.map(dept => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="IT">IT</option>
                      <option value="Game">Game</option>
                      <option value="Design">Design</option>
                      <option value="QA">QA</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Management">Management</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  <Link to="/departments" className="text-primary-600 hover:text-primary-700">
                    {t('department.manageDepartments')}
                  </Link>
                </p>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  {t('profile.language')} *
                </label>
                <select
                  id="language"
                  required
                  value={language}
                  onChange={e => setLanguage(e.target.value as Language)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="en">English</option>
                  <option value="th">ไทย</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {settingsSaving ? t('common.loading') : t('common.save')}
                </button>
              </div>
            </form>
          </div>

          {/* Project Management Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('profile.manageProjects')}</h2>

            {/* Add New Project */}
            <form onSubmit={handleAddProject} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  placeholder={t('profile.newProjectName')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {t('profile.addProject')}
                </button>
              </div>
            </form>

            {projectMessage && (
              <div className="mb-4 rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-800">{projectMessage}</p>
              </div>
            )}

            {/* Projects List */}
            <div className="space-y-2">
              {projects.length === 0 ? (
                <p className="text-sm text-gray-500">{t('profile.noProjects')}</p>
              ) : (
                projects.map(project => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                  >
                    {editingProject === project.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editProjectName}
                          onChange={e => setEditProjectName(e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveProjectEdit(project.id)}
                          className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        >
                          {t('common.save')}
                        </button>
                        <button
                          onClick={() => {
                            setEditingProject(null);
                            setEditProjectName('');
                          }}
                          className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                          {t('common.cancel')}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3">
                          <span className={`text-sm ${project.isActive ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                            {project.name}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${project.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                            {project.isActive ? t('profile.active') : t('profile.inactive')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingProject(project.id);
                              setEditProjectName(project.name);
                            }}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {t('common.edit')}
                          </button>
                          <button
                            onClick={() => toggleProjectStatus(project.id, !project.isActive)}
                            className={`text-sm font-medium ${project.isActive ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}`}
                          >
                            {project.isActive ? t('profile.deactivate') : t('profile.activate')}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
