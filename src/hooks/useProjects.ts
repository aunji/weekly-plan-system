import { useState, useEffect } from 'react';
import type { Project } from '@/types';
import { projectService } from '@/services/projectService';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const allProjects = await projectService.getAllProjects();
      setProjects(allProjects);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (name: string): Promise<Project | null> => {
    try {
      setError(null);
      const newProject = await projectService.createProject(name);
      setProjects(prev => [...prev, newProject].sort((a, b) => a.name.localeCompare(b.name)));
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project');
      return null;
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Pick<Project, 'name' | 'isActive'>>): Promise<boolean> => {
    try {
      setError(null);
      await projectService.updateProject(projectId, updates);
      setProjects(prev =>
        prev
          .map(p => (p.id === projectId ? { ...p, ...updates } : p))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      return true;
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project');
      return false;
    }
  };

  const toggleProjectStatus = async (projectId: string, isActive: boolean): Promise<boolean> => {
    try {
      setError(null);
      await projectService.toggleProjectStatus(projectId, isActive);
      setProjects(prev => prev.map(p => (p.id === projectId ? { ...p, isActive } : p)));
      return true;
    } catch (err) {
      console.error('Error toggling project status:', err);
      setError('Failed to update project status');
      return false;
    }
  };

  const activeProjects = projects.filter(p => p.isActive);

  return {
    projects,
    activeProjects,
    loading,
    error,
    createProject,
    updateProject,
    toggleProjectStatus,
    reload: loadProjects,
  };
};
