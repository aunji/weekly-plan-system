import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDepartments } from '@/hooks/useDepartments';
import { applyDepartmentTheme, resetDepartmentTheme } from '@/utils/theme';

/**
 * Theme Provider Component
 * Applies department theming based on the current user's department
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData } = useAuth();
  const { activeDepartments } = useDepartments();

  useEffect(() => {
    if (userData && activeDepartments.length > 0) {
      // Find the user's department
      const department = activeDepartments.find(d => d.name === userData.department);

      if (department) {
        applyDepartmentTheme({
          colorHex: department.colorHex,
          colorHexLight: department.colorHexLight,
        });
      } else {
        resetDepartmentTheme();
      }
    } else {
      resetDepartmentTheme();
    }
  }, [userData, activeDepartments]);

  return <>{children}</>;
};
