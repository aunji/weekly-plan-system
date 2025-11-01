import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DashboardFilters, Department } from '@/types';

interface FilterBarProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
}

const departments: Department[] = [
  'IT',
  'Game',
  'Design',
  'QA',
  'Marketing',
  'Management',
  'Other',
];

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange }) => {
  const { t } = useTranslation();

  const handleDepartmentChange = (department: Department | '') => {
    onFiltersChange({
      ...filters,
      department: department || undefined,
    });
  };

  const handleSearchChange = (query: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: query || undefined,
    });
  };

  const handleBlockersOnlyToggle = () => {
    onFiltersChange({
      ...filters,
      showBlockersOnly: !filters.showBlockersOnly,
    });
  };

  const handleOffDaysOnlyToggle = () => {
    onFiltersChange({
      ...filters,
      showOffDaysOnly: !filters.showOffDaysOnly,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.department ||
    filters.searchQuery ||
    filters.showBlockersOnly ||
    filters.showOffDaysOnly;

  return (
    <div className="card mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            {t('common.search')}
          </label>
          <input
            type="text"
            id="search"
            value={filters.searchQuery || ''}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder={`${t('common.search')} ${t('profile.name')}...`}
            className="w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500 text-sm"
          />
        </div>

        {/* Department Filter */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            {t('dashboard.filterByDepartment')}
          </label>
          <select
            id="department"
            value={filters.department || ''}
            onChange={e => handleDepartmentChange(e.target.value as Department | '')}
            className="w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="">{t('dashboard.allPlans')}</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {t(`departments.${dept}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Filters */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('common.filter')}
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={filters.showBlockersOnly || false}
              onChange={handleBlockersOnlyToggle}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              {t('dashboard.showBlockersOnly')}
            </span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={filters.showOffDaysOnly || false}
              onChange={handleOffDaysOnlyToggle}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              {t('dashboard.showOffDaysOnly')}
            </span>
          </label>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {t('common.clear')} {t('common.filter')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
