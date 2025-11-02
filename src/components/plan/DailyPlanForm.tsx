import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { DailyPlan } from '@/types';
import { BlockerInput } from './BlockerInput';
import { getWeekdayDates, getCurrentWeekIdentifier } from '@/utils/date';
import { useProjects } from '@/hooks/useProjects';

interface DailyPlanFormProps {
  dailyPlans: DailyPlan[];
  onChange: (plans: DailyPlan[]) => void;
  weekIdentifier?: string;
  disabled?: boolean;
}

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export const DailyPlanForm: React.FC<DailyPlanFormProps> = ({
  dailyPlans,
  onChange,
  weekIdentifier,
  disabled,
}) => {
  const { t } = useTranslation();
  const { activeProjects } = useProjects();
  const week = weekIdentifier || getCurrentWeekIdentifier();
  const weekdayDates = getWeekdayDates(week);

  // Initialize plans if empty
  React.useEffect(() => {
    if (dailyPlans.length === 0) {
      const initialPlans: DailyPlan[] = weekdayDates.map(date => ({
        date,
        tasks: [''],
        isOffDay: false,
        blockers: [],
      }));
      onChange(initialPlans);
    }
  }, []);

  const updateDailyPlan = (index: number, field: keyof DailyPlan, value: any) => {
    const updated = [...dailyPlans];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const addTask = (index: number) => {
    const updated = [...dailyPlans];
    updated[index].tasks.push('');
    onChange(updated);
  };

  const removeTask = (planIndex: number, taskIndex: number) => {
    const updated = [...dailyPlans];
    updated[planIndex].tasks = updated[planIndex].tasks.filter((_, i) => i !== taskIndex);
    onChange(updated);
  };

  const updateTask = (planIndex: number, taskIndex: number, value: string) => {
    const updated = [...dailyPlans];
    updated[planIndex].tasks[taskIndex] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {dailyPlans.map((plan, planIndex) => (
        <div key={plan.date} className="card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                {t(`weekdays.${weekdays[planIndex]}`)}
              </h3>
              <p className="text-xs text-gray-500">{plan.date}</p>
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={plan.isOffDay}
                onChange={e => updateDailyPlan(planIndex, 'isOffDay', e.target.checked)}
                disabled={disabled}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
              />
              <span className="text-sm text-gray-700">{t('plan.offDay')}</span>
            </label>
          </div>

          {plan.isOffDay ? (
            <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
              {t('plan.offDay')}
            </div>
          ) : (
            <>
              {/* Project Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('plan.project')}
                </label>
                <div className="flex gap-2">
                  <select
                    value={plan.project || ''}
                    onChange={e => updateDailyPlan(planIndex, 'project', e.target.value || undefined)}
                    disabled={disabled}
                    className="flex-1 rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500 text-sm disabled:opacity-50"
                  >
                    <option value="">{t('plan.selectProject')}</option>
                    {activeProjects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <Link
                    to="/profile"
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 whitespace-nowrap"
                  >
                    + {t('plan.addProject')}
                  </Link>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('plan.dailyTasks')}
                  </label>
                  <button
                    type="button"
                    onClick={() => addTask(planIndex)}
                    disabled={disabled}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                  >
                    + {t('plan.addTask')}
                  </button>
                </div>

                {plan.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={task}
                      onChange={e => updateTask(planIndex, taskIndex, e.target.value)}
                      placeholder={`${t('plan.dailyTasks')} ${taskIndex + 1}`}
                      disabled={disabled}
                      className="flex-1 rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500 text-sm disabled:opacity-50"
                    />
                    {plan.tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTask(planIndex, taskIndex)}
                        disabled={disabled}
                        className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                      >
                        {t('common.delete')}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Blockers */}
              <BlockerInput
                blockers={plan.blockers}
                onChange={blockers => updateDailyPlan(planIndex, 'blockers', blockers)}
                disabled={disabled}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};
