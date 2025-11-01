import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { WeeklyPlan, Blocker } from '@/types';
import { timestampToDate } from '@/utils/firestore';
import { formatBangkokDate } from '@/utils/date';
import { PlanDetailModal } from './PlanDetailModal';

interface PlanCardProps {
  plan: WeeklyPlan;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Count active blockers
  const activeBlockers = plan.dailyPlans.reduce((count, day) => {
    return count + day.blockers.filter(b => !b.isResolved).length;
  }, 0);

  // Count off-days
  const offDays = plan.dailyPlans.filter(day => day.isOffDay).length;

  // Get highest blocker severity
  const getHighestSeverity = (): Blocker['severity'] | null => {
    let highest: Blocker['severity'] | null = null;

    plan.dailyPlans.forEach(day => {
      day.blockers.forEach(blocker => {
        if (!blocker.isResolved) {
          if (blocker.severity === 'high') {
            highest = 'high';
          } else if (blocker.severity === 'medium' && (!highest || highest === 'low')) {
            highest = 'medium';
          } else if (blocker.severity === 'low' && highest === null) {
            highest = 'low';
          }
        }
      });
    });

    return highest;
  };

  const highestSeverity = getHighestSeverity();

  // Get severity badge color
  const getSeverityColor = () => {
    switch (highestSeverity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <>
      <div
        className="card hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{plan.userName}</h3>
          <p className="text-xs text-gray-500">{t(`departments.${plan.userDepartment}`)}</p>
        </div>

        {/* Indicators */}
        <div className="flex gap-2">
          {/* Blocker Badge */}
          {activeBlockers > 0 && (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor()}`}
              title={`${activeBlockers} active blocker(s)`}
            >
              🚫 {activeBlockers}
            </span>
          )}

          {/* Off-day Badge */}
          {offDays > 0 && (
            <span
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300"
              title={`${offDays} off day(s)`}
            >
              📅 {offDays}
            </span>
          )}
        </div>
      </div>

      {/* Mode Badge */}
      <div className="mb-3">
        <span
          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
            plan.mode === 'daily'
              ? 'bg-primary-100 text-primary-800'
              : 'bg-purple-100 text-purple-800'
          }`}
        >
          {plan.mode === 'daily' ? t('plan.dailyMode') : t('plan.summaryMode')}
        </span>
      </div>

      {/* Content Preview */}
      <div className="mb-3 text-sm text-gray-600">
        {plan.mode === 'daily' ? (
          <div className="space-y-1">
            {plan.dailyPlans.slice(0, 3).map((day, idx) => (
              <div key={day.date} className="flex items-start gap-2">
                <span className="text-xs text-gray-400 mt-0.5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][idx]}:
                </span>
                <span className="flex-1">
                  {day.isOffDay ? (
                    <span className="italic text-gray-400">{t('plan.offDay')}</span>
                  ) : day.tasks.length > 0 && day.tasks[0] ? (
                    <span className="line-clamp-1">{day.tasks[0]}</span>
                  ) : (
                    <span className="italic text-gray-400">No tasks</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {plan.summary?.achievements && (
              <p className="line-clamp-2">{plan.summary.achievements}</p>
            )}
          </div>
        )}
      </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-200 text-xs text-gray-500">
          {t('dashboard.lastUpdated')}: {formatBangkokDate(timestampToDate(plan.updatedAt), 'MMM dd, HH:mm')}
        </div>
      </div>

      {/* Modal */}
      <PlanDetailModal plan={plan} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
