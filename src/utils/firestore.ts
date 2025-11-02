import {
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  Timestamp,
} from 'firebase/firestore';
import type { User, Project, WeeklyPlan } from '@/types';

/**
 * Firestore converter for User documents
 */
export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): DocumentData {
    return {
      email: user.email,
      name: user.name,
      department: user.department,
      language: user.language,
      projects: user.projects,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      email: data.email,
      name: data.name,
      department: data.department,
      language: data.language || 'en',
      projects: data.projects || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/**
 * Firestore converter for Project documents
 */
export const projectConverter: FirestoreDataConverter<Project> = {
  toFirestore(project: Project): DocumentData {
    return {
      name: project.name,
      isActive: project.isActive,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Project {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/**
 * Firestore converter for WeeklyPlan documents
 */
export const weeklyPlanConverter: FirestoreDataConverter<WeeklyPlan> = {
  toFirestore(plan: WeeklyPlan): DocumentData {
    return {
      weekIdentifier: plan.weekIdentifier,
      userId: plan.userId,
      userName: plan.userName,
      userDepartment: plan.userDepartment,
      mode: plan.mode,
      dailyPlans: plan.dailyPlans.map(dp => ({
        date: dp.date,
        tasks: dp.tasks,
        project: dp.project || null,
        isOffDay: dp.isOffDay,
        blockers: dp.blockers.map(b => ({
          id: b.id,
          description: b.description,
          severity: b.severity,
          createdAt: b.createdAt,
          resolvedAt: b.resolvedAt || null,
          isResolved: b.isResolved,
        })),
      })),
      summary: plan.summary,
      updateLogs: plan.updateLogs,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): WeeklyPlan {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      weekIdentifier: data.weekIdentifier,
      userId: data.userId,
      userName: data.userName,
      userDepartment: data.userDepartment,
      mode: data.mode,
      dailyPlans: (data.dailyPlans || []).map((dp: any) => ({
        date: dp.date,
        tasks: dp.tasks || [],
        project: dp.project || undefined,
        isOffDay: dp.isOffDay || false,
        blockers: dp.blockers || [],
      })),
      summary: data.summary || null,
      updateLogs: data.updateLogs || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/**
 * Helper to create a Firestore Timestamp from current date
 */
export const now = (): Timestamp => {
  return Timestamp.now();
};

/**
 * Convert Firestore Timestamp to JavaScript Date
 */
export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};
