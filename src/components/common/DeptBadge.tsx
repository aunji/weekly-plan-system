import React from 'react';

interface DeptBadgeProps {
  departmentName: string;
  colorHex?: string;
  colorHexLight?: string;
  className?: string;
}

/**
 * Department Badge Component
 * Displays department name with themed styling
 */
export const DeptBadge: React.FC<DeptBadgeProps> = ({
  departmentName,
  colorHex,
  colorHexLight,
  className = '',
}) => {
  const style: React.CSSProperties = {};

  if (colorHex && colorHexLight) {
    style.backgroundColor = colorHexLight;
    style.color = colorHex;
  }

  return (
    <span
      className={`dept-badge ${className}`}
      style={Object.keys(style).length > 0 ? style : undefined}
    >
      {departmentName}
    </span>
  );
};
