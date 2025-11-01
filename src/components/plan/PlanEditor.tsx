import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { PlanMode, DailyPlan, WeeklySummary, WeeklyPlanFormData } from '@/types';
import { DailyPlanForm } from './DailyPlanForm';
import { WeeklySummaryForm } from './WeeklySummaryForm';
import { getWeekdayDates, getCurrentWeekIdentifier } from '@/utils/date';

interface PlanEditorProps {
  initialData?: WeeklyPlanFormData;
  onSave: (data: WeeklyPlanFormData) => Promise<void>;
  weekIdentifier?: string;
}

export const PlanEditor: React.FC<PlanEditorProps> = ({
  initialData,
  onSave,
  weekIdentifier,
}) => {
  const { t } = useTranslation();
  const week = weekIdentifier || getCurrentWeekIdentifier();

  const [mode, setMode] = useState<PlanMode>(initialData?.mode || 'daily');
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>(initialData?.dailyPlans || []);
  const [summary, setSummary] = useState<WeeklySummary | null>(
    initialData?.summary || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize daily plans if mode is daily and plans are empty
  useEffect(() => {
    if (mode === 'daily' && dailyPlans.length === 0) {
      const weekdayDates = getWeekdayDates(week);
      const initialPlans: DailyPlan[] = weekdayDates.map(date => ({
        date,
        tasks: [''],
        isOffDay: false,
        blockers: [],
      }));
      setDailyPlans(initialPlans);
    }
  }, [mode, week]);

  // Track changes
  useEffect(() => {
    setHasChanges(true);
  }, [mode, dailyPlans, summary]);

  // Handle mode change
  const handleModeChange = (newMode: PlanMode) => {
    if (hasChanges) {
      if (!window.confirm(t('plan.unsavedChanges'))) {
        return;
      }
    }
    setMode(newMode);
    setHasChanges(false);
  };

  // Handle save
  const handleSave = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const formData: WeeklyPlanFormData = {
        mode,
        dailyPlans: mode === 'daily' ? dailyPlans : [],
        summary: mode === 'summary' ? summary : null,
      };

      await onSave(formData);
      setSuccessMessage(t('plan.planSaved'));
      setHasChanges(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError(t('plan.planError'));
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcut (Ctrl+S / Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!loading) {
          handleSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, mode, dailyPlans, summary]);

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('plan.mode')}
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleModeChange('daily')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
              mode === 'daily'
                ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            {t('plan.dailyMode')}
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('summary')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
              mode === 'summary'
                ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            {t('plan.summaryMode')}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Plan Form */}
      {mode === 'daily' ? (
        <DailyPlanForm
          dailyPlans={dailyPlans}
          onChange={setDailyPlans}
          weekIdentifier={week}
          disabled={loading}
        />
      ) : (
        <WeeklySummaryForm
          summary={summary}
          onChange={setSummary}
          disabled={loading}
        />
      )}

      {/* Save Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="max-w-7xl mx-auto flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !hasChanges}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
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
                {t('common.loading')}
              </>
            ) : (
              <>
                {t('common.save')}
                <span className="text-xs opacity-75">(Ctrl+S)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
