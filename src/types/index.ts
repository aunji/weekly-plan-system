import { Timestamp } from 'firebase/firestore';

// User types
export type Language = 'en' | 'th';

export type Department =
  | 'IT'
  | 'Game'
  | 'Design'
  | 'QA'
  | 'Marketing'
  | 'Management'
  | 'Other';

export interface User {
  id: string;
  email: string;
  name: string;
  department: Department;
  language: Language;
  projects: string[]; // Array of project IDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserFormData {
  name: string;
  department: Department;
  language: Language;
  projects: string[];
}

// Project types
export interface Project {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Weekly Plan types
export type PlanMode = 'daily' | 'summary';

export interface DailyPlan {
  date: string; // Format: YYYY-MM-DD
  tasks: string[];
  isOffDay: boolean;
  blockers: Blocker[];
}

export interface Blocker {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: Timestamp;
  resolvedAt?: Timestamp;
  isResolved: boolean;
}

export interface WeeklySummary {
  achievements: string;
  challenges: string;
  nextWeekPlans: string;
}

export interface UpdateLog {
  timestamp: Timestamp;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  userId: string;
}

export interface WeeklyPlan {
  id: string;
  weekIdentifier: string; // Format: YYYY-WW (e.g., "2024-W45")
  userId: string;
  userName: string;
  userDepartment: Department;
  mode: PlanMode;
  dailyPlans: DailyPlan[];
  summary: WeeklySummary | null;
  updateLogs: UpdateLog[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WeeklyPlanFormData {
  mode: PlanMode;
  dailyPlans: DailyPlan[];
  summary: WeeklySummary | null;
}

// Filter types
export interface DashboardFilters {
  department?: Department;
  project?: string;
  searchQuery?: string;
  showBlockersOnly?: boolean;
  showOffDaysOnly?: boolean;
}

// Export types
export interface ExportOptions {
  weekIdentifier: string;
  department?: Department;
  format: 'csv' | 'json';
}
