/**
 * Department theming utilities
 * Dynamically apply department colors to CSS variables
 */

export interface DepartmentColors {
  colorHex: string;
  colorHexLight: string;
}

/**
 * Apply department theme to the document root
 * This updates CSS variables that can be used throughout the app
 */
export const applyDepartmentTheme = (colors: DepartmentColors): void => {
  const root = document.documentElement;
  root.style.setProperty('--dept-color', colors.colorHex);
  root.style.setProperty('--dept-color-light', colors.colorHexLight);
};

/**
 * Reset department theme to default colors
 */
export const resetDepartmentTheme = (): void => {
  const root = document.documentElement;
  root.style.setProperty('--dept-color', '#6b7280'); // Default gray
  root.style.setProperty('--dept-color-light', '#f3f4f6'); // Default light gray
};

/**
 * Get department colors by department name
 * Default colors for standard departments
 */
export const getDefaultDepartmentColors = (departmentName: string): DepartmentColors => {
  const colorMap: Record<string, DepartmentColors> = {
    Design: { colorHex: '#06b6d4', colorHexLight: '#cffafe' }, // Cyan
    Animation: { colorHex: '#a855f7', colorHexLight: '#f3e8ff' }, // Purple
    Programmer: { colorHex: '#10b981', colorHexLight: '#d1fae5' }, // Green
    QA: { colorHex: '#ef4444', colorHexLight: '#fee2e2' }, // Red
    IT: { colorHex: '#3b82f6', colorHexLight: '#dbeafe' }, // Blue
    Game: { colorHex: '#f59e0b', colorHexLight: '#fef3c7' }, // Amber
    Marketing: { colorHex: '#ec4899', colorHexLight: '#fce7f3' }, // Pink
    Management: { colorHex: '#8b5cf6', colorHexLight: '#ede9fe' }, // Violet
    Other: { colorHex: '#6b7280', colorHexLight: '#f3f4f6' }, // Gray
  };

  return colorMap[departmentName] || { colorHex: '#6b7280', colorHexLight: '#f3f4f6' };
};
