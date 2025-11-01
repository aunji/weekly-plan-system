import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatWeekIdentifier } from '@/utils/date';

interface WeekSelectorProps {
  currentWeek: string;
  onWeekChange: (week: string) => void;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({ currentWeek, onWeekChange }) => {
  const { t } = useTranslation();

  // Calculate previous and next week identifiers
  const getPreviousWeek = (week: string): string => {
    const [year, weekNum] = week.split('-W').map(Number);
    const newWeek = weekNum - 1;

    if (newWeek < 1) {
      return `${year - 1}-W52`;
    }

    return `${year}-W${newWeek.toString().padStart(2, '0')}`;
  };

  const getNextWeek = (week: string): string => {
    const [year, weekNum] = week.split('-W').map(Number);
    const newWeek = weekNum + 1;

    if (newWeek > 52) {
      return `${year + 1}-W01`;
    }

    return `${year}-W${newWeek.toString().padStart(2, '0')}`;
  };

  const handlePrevious = () => {
    onWeekChange(getPreviousWeek(currentWeek));
  };

  const handleNext = () => {
    onWeekChange(getNextWeek(currentWeek));
  };

  return (
    <div className="flex items-center justify-center gap-4 py-3">
      <button
        onClick={handlePrevious}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        ← {t('dashboard.previousWeek')}
      </button>

      <div className="text-center">
        <div className="text-lg font-semibold text-gray-900">
          {formatWeekIdentifier(currentWeek)}
        </div>
        <div className="text-xs text-gray-500">{currentWeek}</div>
      </div>

      <button
        onClick={handleNext}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {t('dashboard.nextWeek')} →
      </button>
    </div>
  );
};
