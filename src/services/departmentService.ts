import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { DepartmentEntity } from '@/types';
import { now } from '@/utils/firestore';

const DEPARTMENTS_COLLECTION = 'departments';

// Firestore converter for DepartmentEntity
const departmentConverter = {
  toFirestore: (department: DepartmentEntity) => ({
    name: department.name,
    isActive: department.isActive,
    createdAt: department.createdAt,
    updatedAt: department.updatedAt,
  }),
  fromFirestore: (snapshot: any): DepartmentEntity => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data.name,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

export const departmentService = {
  /**
   * Get all active departments
   */
  async getActiveDepartments(): Promise<DepartmentEntity[]> {
    const departmentsRef = collection(db, DEPARTMENTS_COLLECTION).withConverter(departmentConverter);
    const q = query(departmentsRef, where('isActive', '==', true), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  },

  /**
   * Get all departments (including inactive)
   */
  async getAllDepartments(): Promise<DepartmentEntity[]> {
    const departmentsRef = collection(db, DEPARTMENTS_COLLECTION).withConverter(departmentConverter);
    const q = query(departmentsRef, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  },

  /**
   * Get a department by ID
   */
  async getDepartmentById(departmentId: string): Promise<DepartmentEntity | null> {
    const departmentRef = doc(db, DEPARTMENTS_COLLECTION, departmentId).withConverter(departmentConverter);
    const snapshot = await getDoc(departmentRef);
    return snapshot.exists() ? snapshot.data() : null;
  },

  /**
   * Create a new department
   */
  async createDepartment(name: string): Promise<DepartmentEntity> {
    const departmentId = doc(collection(db, DEPARTMENTS_COLLECTION)).id;
    const timestamp = now();

    const newDepartment: DepartmentEntity = {
      id: departmentId,
      name: name.trim(),
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const departmentRef = doc(db, DEPARTMENTS_COLLECTION, departmentId).withConverter(departmentConverter);
    await setDoc(departmentRef, newDepartment);

    return newDepartment;
  },

  /**
   * Update a department
   */
  async updateDepartment(departmentId: string, updates: Partial<Pick<DepartmentEntity, 'name' | 'isActive'>>): Promise<void> {
    const departmentRef = doc(db, DEPARTMENTS_COLLECTION, departmentId);
    await updateDoc(departmentRef, {
      ...updates,
      updatedAt: now(),
    });
  },

  /**
   * Toggle department active status
   */
  async toggleDepartmentStatus(departmentId: string, isActive: boolean): Promise<void> {
    const departmentRef = doc(db, DEPARTMENTS_COLLECTION, departmentId);
    await updateDoc(departmentRef, {
      isActive,
      updatedAt: now(),
    });
  },

  /**
   * Delete a department
   */
  async deleteDepartment(departmentId: string): Promise<void> {
    const departmentRef = doc(db, DEPARTMENTS_COLLECTION, departmentId);
    await deleteDoc(departmentRef);
  },
};
