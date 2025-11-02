import { useState, useEffect } from 'react';
import type { DepartmentEntity } from '@/types';
import { departmentService } from '@/services/departmentService';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const allDepartments = await departmentService.getAllDepartments();
      setDepartments(allDepartments);
    } catch (err) {
      console.error('Error loading departments:', err);
      setError('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const createDepartment = async (name: string): Promise<DepartmentEntity | null> => {
    try {
      setError(null);
      const newDepartment = await departmentService.createDepartment(name);
      setDepartments(prev => [...prev, newDepartment].sort((a, b) => a.name.localeCompare(b.name)));
      return newDepartment;
    } catch (err) {
      console.error('Error creating department:', err);
      setError('Failed to create department');
      return null;
    }
  };

  const updateDepartment = async (departmentId: string, updates: Partial<Pick<DepartmentEntity, 'name' | 'isActive'>>): Promise<boolean> => {
    try {
      setError(null);
      await departmentService.updateDepartment(departmentId, updates);
      setDepartments(prev =>
        prev
          .map(d => (d.id === departmentId ? { ...d, ...updates } : d))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      return true;
    } catch (err) {
      console.error('Error updating department:', err);
      setError('Failed to update department');
      return false;
    }
  };

  const toggleDepartmentStatus = async (departmentId: string, isActive: boolean): Promise<boolean> => {
    try {
      setError(null);
      await departmentService.toggleDepartmentStatus(departmentId, isActive);
      setDepartments(prev => prev.map(d => (d.id === departmentId ? { ...d, isActive } : d)));
      return true;
    } catch (err) {
      console.error('Error toggling department status:', err);
      setError('Failed to update department status');
      return false;
    }
  };

  const deleteDepartment = async (departmentId: string): Promise<boolean> => {
    try {
      setError(null);
      await departmentService.deleteDepartment(departmentId);
      setDepartments(prev => prev.filter(d => d.id !== departmentId));
      return true;
    } catch (err) {
      console.error('Error deleting department:', err);
      setError('Failed to delete department');
      return false;
    }
  };

  const activeDepartments = departments.filter(d => d.isActive);

  return {
    departments,
    activeDepartments,
    loading,
    error,
    createDepartment,
    updateDepartment,
    toggleDepartmentStatus,
    deleteDepartment,
    reload: loadDepartments,
  };
};
