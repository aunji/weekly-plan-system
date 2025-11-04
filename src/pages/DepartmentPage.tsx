import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useDepartments } from '@/hooks/useDepartments';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { DeptBadge } from '@/components/common/DeptBadge';
import type { DepartmentEntity } from '@/types';

export const DepartmentPage: React.FC = () => {
  const { t } = useTranslation();
  const { userData, logout } = useAuth();
  const { departments, loading, error, createDepartment, updateDepartment, toggleDepartmentStatus, deleteDepartment } = useDepartments();

  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#6b7280');
  const [newColorHexLight, setNewColorHexLight] = useState('#f3f4f6');

  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<DepartmentEntity>>({});
  const [uploadingIcon, setUploadingIcon] = useState<string | null>(null);

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

    const department = await createDepartment(newDepartmentName, newColorHex, newColorHexLight);
    if (department) {
      setNewDepartmentName('');
      setNewColorHex('#6b7280');
      setNewColorHexLight('#f3f4f6');
      setMessage(t('department.departmentCreated'));
      setTimeout(() => setMessage(''), 3000);
    } else {
      setErrorMessage('Failed to create department. Check console for details.');
    }
  };

  const handleStartEdit = (department: DepartmentEntity) => {
    setEditingDepartment(department.id);
    setEditData({
      name: department.name,
      colorHex: department.colorHex,
      colorHexLight: department.colorHexLight,
      iconURL: department.iconURL,
    });
  };

  const handleSaveDepartmentEdit = async (departmentId: string) => {
    if (!editData.name?.trim()) {
      return;
    }

    const success = await updateDepartment(departmentId, {
      name: editData.name,
      colorHex: editData.colorHex,
      colorHexLight: editData.colorHexLight,
      iconURL: editData.iconURL,
    });

    if (success) {
      setEditingDepartment(null);
      setEditData({});
      setMessage(t('department.departmentUpdated'));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleIconUpload = async (departmentId: string, file: File) => {
    if (file.type !== 'image/svg+xml') {
      setErrorMessage('Only SVG files are allowed');
      return;
    }

    if (file.size > 1024 * 1024) {
      setErrorMessage('File size must be less than 1MB');
      return;
    }

    setUploadingIcon(departmentId);
    try {
      const storageRef = ref(storage, `departments/${departmentId}/icon.svg`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update department with icon URL
      await updateDepartment(departmentId, { iconURL: downloadURL });

      if (editingDepartment === departmentId) {
        setEditData({ ...editData, iconURL: downloadURL });
      }

      setMessage('Icon uploaded successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Icon upload error:', error);
      setErrorMessage('Failed to upload icon');
    } finally {
      setUploadingIcon(null);
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
                <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                  {t('navigation.dashboard')}
                </Link>
                <Link to="/my-plan" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                  {t('navigation.myPlan')}
                </Link>
                <Link to="/departments" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  {t('navigation.departments')}
                </Link>
                <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                  {t('navigation.profile')}
                </Link>
              </nav>
              <LanguageSwitcher />
              <span className="text-sm text-gray-600">{userData.name}</span>
              <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-700 font-medium">
                {t('auth.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('department.manageDepartments')}</h2>

          {/* Add New Department */}
          <form onSubmit={handleAddDepartment} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Department</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={newDepartmentName}
                onChange={e => setNewDepartmentName(e.target.value)}
                placeholder={t('department.newDepartmentName')}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              <div>
                <label className="block text-xs text-gray-600 mb-1">Primary Color</label>
                <input
                  type="color"
                  value={newColorHex}
                  onChange={e => setNewColorHex(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Light Color</label>
                <input
                  type="color"
                  value={newColorHexLight}
                  onChange={e => setNewColorHexLight(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {t('department.addDepartment')}
              </button>
            </div>
            {/* Preview */}
            <div className="mt-3">
              <span className="text-xs text-gray-600">Preview:</span>
              <DeptBadge
                departmentName={newDepartmentName || 'Department Name'}
                colorHex={newColorHex}
                colorHexLight={newColorHexLight}
                className="ml-2"
              />
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
              <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {departments.length === 0 ? (
                <p className="text-sm text-gray-500">{t('department.noDepartments')}</p>
              ) : (
                departments.map(department => (
                <div key={department.id} className="border border-gray-200 rounded-lg p-4">
                  {editingDepartment === department.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Name</label>
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={e => setEditData({ ...editData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Primary Color</label>
                          <input
                            type="color"
                            value={editData.colorHex || '#6b7280'}
                            onChange={e => setEditData({ ...editData, colorHex: e.target.value })}
                            className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Light Color</label>
                          <input
                            type="color"
                            value={editData.colorHexLight || '#f3f4f6'}
                            onChange={e => setEditData({ ...editData, colorHexLight: e.target.value })}
                            className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Icon Upload */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Department Icon (SVG)</label>
                        <div className="flex items-center gap-3">
                          {editData.iconURL && (
                            <img src={editData.iconURL} alt="Icon" className="w-8 h-8" />
                          )}
                          <input
                            type="file"
                            accept=".svg,image/svg+xml"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handleIconUpload(department.id, file);
                            }}
                            className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            disabled={uploadingIcon === department.id}
                          />
                          {uploadingIcon === department.id && (
                            <span className="text-xs text-gray-500">Uploading...</span>
                          )}
                        </div>
                      </div>

                      {/* Preview */}
                      <div>
                        <span className="text-xs text-gray-600">Preview:</span>
                        <DeptBadge
                          departmentName={editData.name || department.name}
                          colorHex={editData.colorHex}
                          colorHexLight={editData.colorHexLight}
                          className="ml-2"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveDepartmentEdit(department.id)}
                          className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        >
                          {t('common.save')}
                        </button>
                        <button
                          onClick={() => {
                            setEditingDepartment(null);
                            setEditData({});
                          }}
                          className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                          {t('common.cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {department.iconURL && (
                          <img src={department.iconURL} alt={department.name} className="w-6 h-6" />
                        )}
                        <DeptBadge
                          departmentName={department.name}
                          colorHex={department.colorHex}
                          colorHexLight={department.colorHexLight}
                        />
                        <span className={`px-2 py-1 text-xs rounded-full ${department.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {department.isActive ? t('department.active') : t('department.inactive')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStartEdit(department)}
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
                    </div>
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
