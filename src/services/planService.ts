import {
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { WeeklyPlan, WeeklyPlanFormData, UpdateLog, Department } from '@/types';
import { weeklyPlanConverter, now } from '@/utils/firestore';
import { getCurrentWeekIdentifier } from '@/utils/date';

/**
 * Create a new weekly plan
 */
export const createWeeklyPlan = async (
  userId: string,
  userName: string,
  userDepartment: Department,
  data: WeeklyPlanFormData
): Promise<WeeklyPlan> => {
  const weekIdentifier = getCurrentWeekIdentifier();
  const planId = `${userId}_${weekIdentifier}`;
  const timestamp = now();

  const newPlan: WeeklyPlan = {
    id: planId,
    weekIdentifier,
    userId,
    userName,
    userDepartment,
    mode: data.mode,
    dailyPlans: data.dailyPlans,
    summary: data.summary,
    updateLogs: [
      {
        timestamp,
        field: 'created',
        oldValue: null,
        newValue: 'Plan created',
        userId,
      },
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const planRef = doc(db, 'weekly_plans', planId).withConverter(weeklyPlanConverter);
  await setDoc(planRef, newPlan);

  return newPlan;
};

/**
 * Update an existing weekly plan
 */
export const updateWeeklyPlan = async (
  planId: string,
  userId: string,
  data: WeeklyPlanFormData,
  existingPlan: WeeklyPlan
): Promise<WeeklyPlan> => {
  const timestamp = now();
  const updateLogs: UpdateLog[] = [...existingPlan.updateLogs];

  // Track changes
  if (existingPlan.mode !== data.mode) {
    updateLogs.push({
      timestamp,
      field: 'mode',
      oldValue: existingPlan.mode,
      newValue: data.mode,
      userId,
    });
  }

  // Add update log entry
  updateLogs.push({
    timestamp,
    field: 'updated',
    oldValue: null,
    newValue: 'Plan updated',
    userId,
  });

  const updatedPlan: WeeklyPlan = {
    ...existingPlan,
    mode: data.mode,
    dailyPlans: data.dailyPlans,
    summary: data.summary,
    updateLogs,
    updatedAt: timestamp,
  };

  const planRef = doc(db, 'weekly_plans', planId).withConverter(weeklyPlanConverter);
  await setDoc(planRef, updatedPlan);

  return updatedPlan;
};

/**
 * Get a weekly plan by user ID and week identifier
 */
export const getWeeklyPlan = async (
  userId: string,
  weekIdentifier?: string
): Promise<WeeklyPlan | null> => {
  const week = weekIdentifier || getCurrentWeekIdentifier();
  const planId = `${userId}_${week}`;

  const planRef = doc(db, 'weekly_plans', planId).withConverter(weeklyPlanConverter);
  const planDoc = await getDoc(planRef);

  if (planDoc.exists()) {
    return planDoc.data();
  }

  return null;
};

/**
 * Get all weekly plans for a specific week
 */
export const getAllWeeklyPlans = async (weekIdentifier?: string): Promise<WeeklyPlan[]> => {
  const week = weekIdentifier || getCurrentWeekIdentifier();

  const plansRef = collection(db, 'weekly_plans').withConverter(weeklyPlanConverter);
  const q = query(plansRef, where('weekIdentifier', '==', week));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

/**
 * Subscribe to weekly plan updates
 */
export const subscribeToWeeklyPlan = (
  userId: string,
  weekIdentifier: string,
  callback: (plan: WeeklyPlan | null) => void
): Unsubscribe => {
  const planId = `${userId}_${weekIdentifier}`;
  const planRef = doc(db, 'weekly_plans', planId).withConverter(weeklyPlanConverter);

  return onSnapshot(planRef, snapshot => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback(null);
    }
  });
};

/**
 * Subscribe to all weekly plans for a specific week
 */
export const subscribeToAllWeeklyPlans = (
  weekIdentifier: string,
  callback: (plans: WeeklyPlan[]) => void
): Unsubscribe => {
  const plansRef = collection(db, 'weekly_plans').withConverter(weeklyPlanConverter);
  const q = query(plansRef, where('weekIdentifier', '==', weekIdentifier));

  return onSnapshot(q, snapshot => {
    const plans = snapshot.docs.map(doc => doc.data());
    callback(plans);
  });
};
