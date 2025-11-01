import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Blocker } from '@/types';
import { Timestamp } from 'firebase/firestore';

interface BlockerInputProps {
  blockers: Blocker[];
  onChange: (blockers: Blocker[]) => void;
  disabled?: boolean;
}

export const BlockerInput: React.FC<BlockerInputProps> = ({ blockers, onChange, disabled }) => {
  const { t } = useTranslation();

  const addBlocker = () => {
    const newBlocker: Blocker = {
      id: `blocker_${Date.now()}`,
      description: '',
      severity: 'medium',
      createdAt: Timestamp.now(),
      isResolved: false,
    };

    onChange([...blockers, newBlocker]);
  };

  const removeBlocker = (id: string) => {
    onChange(blockers.filter(b => b.id !== id));
  };

  const updateBlocker = (id: string, field: keyof Blocker, value: any) => {
    onChange(
      blockers.map(b =>
        b.id === id
          ? {
              ...b,
              [field]: value,
            }
          : b
      )
    );
  };

  const getSeverityColor = (severity: Blocker['severity']) => {
    switch (severity) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'medium':
        return 'border-orange-300 bg-orange-50';
      case 'low':
        return 'border-yellow-300 bg-yellow-50';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          {t('plan.blockers')}
        </label>
        <button
          type="button"
          onClick={addBlocker}
          disabled={disabled}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
        >
          + {t('plan.addBlocker')}
        </button>
      </div>

      {blockers.length === 0 ? (
        <p className="text-sm text-gray-500 italic">{t('plan.blockers')} - {t('common.none')}</p>
      ) : (
        <div className="space-y-2">
          {blockers.map(blocker => (
            <div
              key={blocker.id}
              className={`border rounded-lg p-3 ${getSeverityColor(blocker.severity)}`}
            >
              <div className="flex gap-2 mb-2">
                <select
                  value={blocker.severity}
                  onChange={e =>
                    updateBlocker(blocker.id, 'severity', e.target.value as Blocker['severity'])
                  }
                  disabled={disabled}
                  className="text-xs border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                >
                  <option value="low">{t('plan.severityLow')}</option>
                  <option value="medium">{t('plan.severityMedium')}</option>
                  <option value="high">{t('plan.severityHigh')}</option>
                </select>

                <button
                  type="button"
                  onClick={() => removeBlocker(blocker.id)}
                  disabled={disabled}
                  className="ml-auto text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {t('common.delete')}
                </button>
              </div>

              <textarea
                value={blocker.description}
                onChange={e => updateBlocker(blocker.id, 'description', e.target.value)}
                placeholder={t('plan.blockerDescription')}
                disabled={disabled}
                rows={2}
                className="w-full text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
