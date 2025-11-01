import React from 'react';
import { useTranslation } from 'react-i18next';
import type { WeeklySummary } from '@/types';

interface WeeklySummaryFormProps {
  summary: WeeklySummary | null;
  onChange: (summary: WeeklySummary) => void;
  disabled?: boolean;
}

export const WeeklySummaryForm: React.FC<WeeklySummaryFormProps> = ({
  summary,
  onChange,
  disabled,
}) => {
  const { t } = useTranslation();

  const currentSummary: WeeklySummary = summary || {
    achievements: '',
    challenges: '',
    nextWeekPlans: '',
  };

  const updateField = (field: keyof WeeklySummary, value: string) => {
    onChange({
      ...currentSummary,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Achievements */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('plan.achievements')}
        </label>
        <textarea
          value={currentSummary.achievements}
          onChange={e => updateField('achievements', e.target.value)}
          placeholder={t('plan.achievements')}
          disabled={disabled}
          rows={6}
          className="w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500 text-sm disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-gray-500">
          {currentSummary.achievements.length} {t('common.characters')}
        </p>
      </div>

      {/* Challenges */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('plan.challenges')}
        </label>
        <textarea
          value={currentSummary.challenges}
          onChange={e => updateField('challenges', e.target.value)}
          placeholder={t('plan.challenges')}
          disabled={disabled}
          rows={6}
          className="w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500 text-sm disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-gray-500">
          {currentSummary.challenges.length} {t('common.characters')}
        </p>
      </div>

      {/* Next Week Plans */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('plan.nextWeekPlans')}
        </label>
        <textarea
          value={currentSummary.nextWeekPlans}
          onChange={e => updateField('nextWeekPlans', e.target.value)}
          placeholder={t('plan.nextWeekPlans')}
          disabled={disabled}
          rows={6}
          className="w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500 text-sm disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-gray-500">
          {currentSummary.nextWeekPlans.length} {t('common.characters')}
        </p>
      </div>
    </div>
  );
};
