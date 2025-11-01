import { useState, useEffect, useCallback } from 'react';
import type { WeeklyPlan, WeeklyPlanFormData, Department } from '@/types';
import {
  createWeeklyPlan,
  updateWeeklyPlan,
  getWeeklyPlan,
  subscribeToWeeklyPlan,
} from '@/services/planService';
import { getCurrentWeekIdentifier } from '@/utils/date';

interface UsePlanResult {
  plan: WeeklyPlan | null;
  loading: boolean;
  error: string | null;
  savePlan: (data: WeeklyPlanFormData) => Promise<void>;
  refreshPlan: () => Promise<void>;
}

export const usePlan = (
  userId: string,
  userName: string,
  userDepartment: Department,
  weekIdentifier?: string
): UsePlanResult => {
  const week = weekIdentifier || getCurrentWeekIdentifier();

  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch plan on mount
  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedPlan = await getWeeklyPlan(userId, week);
      setPlan(fetchedPlan);
    } catch (err) {
      console.error('Error fetching plan:', err);
      setError('Failed to load plan');
    } finally {
      setLoading(false);
    }
  }, [userId, week]);

  useEffect(() => {
    fetchPlan();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToWeeklyPlan(userId, week, updatedPlan => {
      setPlan(updatedPlan);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [userId, week, fetchPlan]);

  // Save plan (create or update)
  const savePlan = useCallback(
    async (data: WeeklyPlanFormData) => {
      setError(null);

      try {
        let savedPlan: WeeklyPlan;

        if (plan) {
          // Update existing plan
          savedPlan = await updateWeeklyPlan(plan.id, userId, data, plan);
        } else {
          // Create new plan
          savedPlan = await createWeeklyPlan(userId, userName, userDepartment, data);
        }

        setPlan(savedPlan);
      } catch (err) {
        console.error('Error saving plan:', err);
        setError('Failed to save plan');
        throw err;
      }
    },
    [plan, userId, userName, userDepartment]
  );

  return {
    plan,
    loading,
    error,
    savePlan,
    refreshPlan: fetchPlan,
  };
};
