import { useState, useEffect } from 'react';
import type { WeeklyPlan, DashboardFilters } from '@/types';
import { subscribeToAllWeeklyPlans } from '@/services/planService';
import { getCurrentWeekIdentifier } from '@/utils/date';

interface UseTeamPlansResult {
  plans: WeeklyPlan[];
  filteredPlans: WeeklyPlan[];
  loading: boolean;
  error: string | null;
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
}

export const useTeamPlans = (weekIdentifier?: string): UseTeamPlansResult => {
  const week = weekIdentifier || getCurrentWeekIdentifier();

  const [plans, setPlans] = useState<WeeklyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({});

  // Subscribe to all plans for the week
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToAllWeeklyPlans(week, updatedPlans => {
      setPlans(updatedPlans);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [week]);

  // Apply filters
  const filteredPlans = plans.filter(plan => {
    // Department filter
    if (filters.department && plan.userDepartment !== filters.department) {
      return false;
    }

    // Search query (name)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (!plan.userName.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Blockers only filter
    if (filters.showBlockersOnly) {
      const hasBlockers = plan.dailyPlans.some(dp =>
        dp.blockers.some(b => !b.isResolved)
      );
      if (!hasBlockers) {
        return false;
      }
    }

    // Off-days only filter
    if (filters.showOffDaysOnly) {
      const hasOffDays = plan.dailyPlans.some(dp => dp.isOffDay);
      if (!hasOffDays) {
        return false;
      }
    }

    return true;
  });

  return {
    plans,
    filteredPlans,
    loading,
    error,
    filters,
    setFilters,
  };
};
