import { useState, useEffect } from 'react';
import type { WeeklyPlan, Department } from '@/types';
import { subscribeToAllWeeklyPlans } from '@/services/planService';

export interface WeeklyAnalytics {
  totalPlans: number;
  plansByDepartment: Record<Department, number>;
  plansByMode: {
    daily: number;
    summary: number;
  };
  blockers: {
    total: number;
    active: number;
    resolved: number;
    bySeverity: {
      high: number;
      medium: number;
      low: number;
    };
  };
  offDays: {
    total: number;
    byDepartment: Record<Department, number>;
  };
  tasksStats: {
    totalTasks: number;
    avgTasksPerPlan: number;
    plansWithTasks: number;
  };
}

export interface MultiWeekAnalytics {
  weeks: string[];
  blockerTrends: {
    week: string;
    total: number;
    active: number;
    resolved: number;
  }[];
  planCountTrends: {
    week: string;
    count: number;
  }[];
}

export interface UseAnalyticsResult {
  analytics: WeeklyAnalytics | null;
  loading: boolean;
  error: string | null;
}

const emptyDepartmentStats = (): Record<Department, number> => ({
  IT: 0,
  Game: 0,
  Design: 0,
  QA: 0,
  Marketing: 0,
  Management: 0,
  Other: 0,
});

export const useAnalytics = (weekIdentifier?: string): UseAnalyticsResult => {
  const [analytics, setAnalytics] = useState<WeeklyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!weekIdentifier) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToAllWeeklyPlans(weekIdentifier, (plans: WeeklyPlan[]) => {
      try {
        const stats: WeeklyAnalytics = {
          totalPlans: plans.length,
          plansByDepartment: emptyDepartmentStats(),
          plansByMode: {
            daily: 0,
            summary: 0,
          },
          blockers: {
            total: 0,
            active: 0,
            resolved: 0,
            bySeverity: {
              high: 0,
              medium: 0,
              low: 0,
            },
          },
          offDays: {
            total: 0,
            byDepartment: emptyDepartmentStats(),
          },
          tasksStats: {
            totalTasks: 0,
            avgTasksPerPlan: 0,
            plansWithTasks: 0,
          },
        };

        plans.forEach(plan => {
          // Department stats
          stats.plansByDepartment[plan.userDepartment]++;

          // Mode stats
          if (plan.mode === 'daily') {
            stats.plansByMode.daily++;
          } else {
            stats.plansByMode.summary++;
          }

          // Daily plans stats (only for daily mode)
          if (plan.mode === 'daily') {
            plan.dailyPlans.forEach(day => {
              // Off-days
              if (day.isOffDay) {
                stats.offDays.total++;
                stats.offDays.byDepartment[plan.userDepartment]++;
              }

              // Tasks
              const validTasks = day.tasks.filter(task => task.trim());
              if (validTasks.length > 0) {
                stats.tasksStats.totalTasks += validTasks.length;
                stats.tasksStats.plansWithTasks++;
              }

              // Blockers
              day.blockers.forEach(blocker => {
                stats.blockers.total++;
                if (blocker.isResolved) {
                  stats.blockers.resolved++;
                } else {
                  stats.blockers.active++;
                }
                stats.blockers.bySeverity[blocker.severity]++;
              });
            });
          }
        });

        // Calculate averages
        if (stats.tasksStats.plansWithTasks > 0) {
          stats.tasksStats.avgTasksPerPlan = Math.round(
            (stats.tasksStats.totalTasks / stats.tasksStats.plansWithTasks) * 10
          ) / 10;
        }

        setAnalytics(stats);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to calculate analytics');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [weekIdentifier]);

  return { analytics, loading, error };
};

export const useMultiWeekAnalytics = (weekIdentifiers: string[]): MultiWeekAnalytics | null => {
  const [multiWeekData, setMultiWeekData] = useState<MultiWeekAnalytics | null>(null);

  useEffect(() => {
    if (weekIdentifiers.length === 0) {
      return;
    }

    const unsubscribers: (() => void)[] = [];
    const weeklyData: Record<string, WeeklyPlan[]> = {};

    weekIdentifiers.forEach(week => {
      const unsubscribe = subscribeToAllWeeklyPlans(week, (plans: WeeklyPlan[]) => {
        weeklyData[week] = plans;

        // Calculate trends when we have data for all weeks
        if (Object.keys(weeklyData).length === weekIdentifiers.length) {
          const blockerTrends = weekIdentifiers.map(w => {
            const plans = weeklyData[w] || [];
            let total = 0;
            let active = 0;
            let resolved = 0;

            plans.forEach(plan => {
              plan.dailyPlans.forEach(day => {
                day.blockers.forEach(blocker => {
                  total++;
                  if (blocker.isResolved) {
                    resolved++;
                  } else {
                    active++;
                  }
                });
              });
            });

            return { week: w, total, active, resolved };
          });

          const planCountTrends = weekIdentifiers.map(w => ({
            week: w,
            count: weeklyData[w]?.length || 0,
          }));

          setMultiWeekData({
            weeks: weekIdentifiers,
            blockerTrends,
            planCountTrends,
          });
        }
      });

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [weekIdentifiers]);

  return multiWeekData;
};
