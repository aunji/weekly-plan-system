import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatWeekIdentifier } from '@/utils/date';

interface WeekSelectorProps {
  currentWeek: string;
  onWeekChange: (week: string) => void;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({ currentWeek, onWeekChange }) => {
  const { t } = useTranslation();

  // Get week date range (Monday - Friday) using ISO 8601 week date
  const getWeekDateRange = (weekIdentifier: string) => {
    const [year, weekNum] = weekIdentifier.split('-W').map(Number);

    // ISO 8601 week date calculation
    // Week 1 is the first week with Thursday in it
    const jan4 = new Date(year, 0, 4); // Jan 4 is always in Week 1
    const jan4Day = jan4.getDay() || 7; // Convert Sunday (0) to 7

    // Find Monday of Week 1
    const week1Monday = new Date(jan4);
    week1Monday.setDate(jan4.getDate() - (jan4Day - 1));

    // Calculate target Monday
    const targetMonday = new Date(week1Monday);
    targetMonday.setDate(week1Monday.getDate() + (weekNum - 1) * 7);

    // Calculate Friday (4 days after Monday)
    const targetFriday = new Date(targetMonday);
    targetFriday.setDate(targetMonday.getDate() + 4);

    // Format dates
    const mondayStr = targetMonday.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    const fridayStr = targetFriday.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return `${mondayStr} - ${fridayStr}`;
  };

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevious}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('dashboard.previousWeek')}
        </button>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatWeekIdentifier(currentWeek)}
          </div>
          <div className="text-sm font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded-md inline-block mb-2">
            {currentWeek}
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{getWeekDateRange(currentWeek)}</span>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          {t('dashboard.nextWeek')}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
