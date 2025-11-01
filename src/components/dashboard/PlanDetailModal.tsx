import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { WeeklyPlan } from '@/types';
import { timestampToDate } from '@/utils/firestore';
import { formatBangkokDate } from '@/utils/date';
import { useAuth } from '@/contexts/AuthContext';

interface PlanDetailModalProps {
  plan: WeeklyPlan;
  isOpen: boolean;
  onClose: () => void;
}

export const PlanDetailModal: React.FC<PlanDetailModalProps> = ({ plan, isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userData } = useAuth();

  const isOwnPlan = userData?.id === plan.userId;

  if (!isOpen) return null;

  const handleEditClick = () => {
    navigate('/my-plan');
    onClose();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl transform transition-all">
          {/* Header */}
          <div className="bg-primary-600 text-white px-6 py-4 rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{plan.userName}</h2>
                <p className="text-primary-100 text-sm">{t(`departments.${plan.userDepartment}`)}</p>
                <p className="text-primary-200 text-xs mt-1">
                  {t('plan.weeklyPlan')}: {plan.weekIdentifier}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-primary-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* Mode Badge */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  plan.mode === 'daily'
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                {plan.mode === 'daily' ? t('plan.dailyMode') : t('plan.summaryMode')}
              </span>
            </div>

            {/* Daily Mode Content */}
            {plan.mode === 'daily' && (
              <div className="space-y-4">
                {plan.dailyPlans.map((day, index) => {
                  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                  const dayName = dayNames[index];

                  return (
                    <div key={day.date} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-3">
                        {t(`weekdays.${dayName}`)} - {formatBangkokDate(new Date(day.date), 'MMM dd, yyyy')}
                      </h3>

                      {day.isOffDay ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                          <p className="text-blue-800 font-medium">📅 {t('plan.offDay')}</p>
                        </div>
                      ) : (
                        <>
                          {/* Tasks */}
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">{t('plan.dailyTasks')}</h4>
                            {day.tasks.length > 0 && day.tasks.some(task => task.trim()) ? (
                              <ul className="list-disc list-inside space-y-1">
                                {day.tasks.filter(task => task.trim()).map((task, idx) => (
                                  <li key={idx} className="text-gray-600">{task}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-400 italic text-sm">No tasks</p>
                            )}
                          </div>

                          {/* Blockers */}
                          {day.blockers.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">{t('plan.blockers')}</h4>
                              <div className="space-y-2">
                                {day.blockers.map((blocker, idx) => (
                                  <div
                                    key={idx}
                                    className={`border rounded-md p-3 ${
                                      blocker.isResolved
                                        ? 'bg-green-50 border-green-300'
                                        : 'bg-white border-gray-300'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between mb-1">
                                      <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                                          blocker.severity
                                        )}`}
                                      >
                                        {t(`plan.severity${blocker.severity.charAt(0).toUpperCase() + blocker.severity.slice(1)}`)}
                                      </span>
                                      {blocker.isResolved && (
                                        <span className="text-xs text-green-600 font-medium">
                                          ✓ {t('plan.resolveBlocker')}d
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-gray-700 text-sm mt-2">{blocker.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Summary Mode Content */}
            {plan.mode === 'summary' && plan.summary && (
              <div className="space-y-4">
                {/* Achievements */}
                {plan.summary.achievements && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{t('plan.achievements')}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{plan.summary.achievements}</p>
                  </div>
                )}

                {/* Challenges */}
                {plan.summary.challenges && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{t('plan.challenges')}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{plan.summary.challenges}</p>
                  </div>
                )}

                {/* Next Week Plans */}
                {plan.summary.nextWeekPlans && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{t('plan.nextWeekPlans')}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{plan.summary.nextWeekPlans}</p>
                  </div>
                )}
              </div>
            )}

            {/* Update History */}
            {plan.updateLogs.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Update History</h3>
                <div className="space-y-2">
                  {plan.updateLogs.slice(0, 5).map((log, idx) => (
                    <div key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <div className="flex-1">
                        <span className="font-medium">{log.field}</span>
                        {log.newValue && (
                          <span className="text-gray-500"> - {log.newValue}</span>
                        )}
                        <div className="text-xs text-gray-400">
                          {formatBangkokDate(timestampToDate(log.timestamp), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {t('dashboard.lastUpdated')}: {formatBangkokDate(timestampToDate(plan.updatedAt), 'MMM dd, yyyy HH:mm')}
            </div>
            <div className="flex gap-3">
              {isOwnPlan && (
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  {t('common.edit')} {t('plan.myPlan')}
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
