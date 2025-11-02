import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Project } from '@/types';
import { now } from '@/utils/firestore';

const PROJECTS_COLLECTION = 'projects';

// Firestore converter for Project
const projectConverter = {
  toFirestore: (project: Project) => ({
    name: project.name,
    isActive: project.isActive,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }),
  fromFirestore: (snapshot: any): Project => {
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

export const projectService = {
  /**
   * Get all active projects
   */
  async getActiveProjects(): Promise<Project[]> {
    const projectsRef = collection(db, PROJECTS_COLLECTION).withConverter(projectConverter);
    const q = query(projectsRef, where('isActive', '==', true), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  },

  /**
   * Get all projects (including inactive)
   */
  async getAllProjects(): Promise<Project[]> {
    const projectsRef = collection(db, PROJECTS_COLLECTION).withConverter(projectConverter);
    const q = query(projectsRef, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  },

  /**
   * Get a project by ID
   */
  async getProjectById(projectId: string): Promise<Project | null> {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId).withConverter(projectConverter);
    const snapshot = await getDoc(projectRef);
    return snapshot.exists() ? snapshot.data() : null;
  },

  /**
   * Create a new project
   */
  async createProject(name: string): Promise<Project> {
    const projectId = doc(collection(db, PROJECTS_COLLECTION)).id;
    const timestamp = now();

    const newProject: Project = {
      id: projectId,
      name: name.trim(),
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const projectRef = doc(db, PROJECTS_COLLECTION, projectId).withConverter(projectConverter);
    await setDoc(projectRef, newProject);

    return newProject;
  },

  /**
   * Update a project
   */
  async updateProject(projectId: string, updates: Partial<Pick<Project, 'name' | 'isActive'>>): Promise<void> {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: now(),
    });
  },

  /**
   * Toggle project active status
   */
  async toggleProjectStatus(projectId: string, isActive: boolean): Promise<void> {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(projectRef, {
      isActive,
      updatedAt: now(),
    });
  },
};
