/**
 * Department Seed Script
 * Seeds default departments with predefined colors
 */

import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { DepartmentEntity } from '@/types';
import { now } from '@/utils/firestore';

// Default department configurations
const DEFAULT_DEPARTMENTS: Array<Omit<DepartmentEntity, 'id' | 'createdAt' | 'updatedAt'>> = [
  {
    name: 'Design',
    colorHex: '#06b6d4', // Cyan
    colorHexLight: '#cffafe',
    isActive: true,
  },
  {
    name: 'Animation',
    colorHex: '#a855f7', // Purple
    colorHexLight: '#f3e8ff',
    isActive: true,
  },
  {
    name: 'Programmer',
    colorHex: '#10b981', // Green
    colorHexLight: '#d1fae5',
    isActive: true,
  },
  {
    name: 'QA',
    colorHex: '#ef4444', // Red
    colorHexLight: '#fee2e2',
    isActive: true,
  },
  {
    name: 'IT',
    colorHex: '#3b82f6', // Blue
    colorHexLight: '#dbeafe',
    isActive: true,
  },
  {
    name: 'Game',
    colorHex: '#f59e0b', // Amber
    colorHexLight: '#fef3c7',
    isActive: true,
  },
  {
    name: 'Marketing',
    colorHex: '#ec4899', // Pink
    colorHexLight: '#fce7f3',
    isActive: true,
  },
  {
    name: 'Management',
    colorHex: '#8b5cf6', // Violet
    colorHexLight: '#ede9fe',
    isActive: true,
  },
  {
    name: 'Other',
    colorHex: '#6b7280', // Gray
    colorHexLight: '#f3f4f6',
    isActive: true,
  },
];

/**
 * Seed departments into Firestore
 * Creates departments if they don't exist, updates colors if they do
 */
export const seedDepartments = async (): Promise<void> => {
  console.log('🌱 Starting department seeding...');

  const departmentsRef = collection(db, 'departments');
  const snapshot = await getDocs(departmentsRef);

  // Get existing departments
  const existingDepartments = new Map<string, { id: string; hasColors: boolean }>();
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    existingDepartments.set(data.name, {
      id: doc.id,
      hasColors: !!(data.colorHex && data.colorHexLight),
    });
  });

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const deptConfig of DEFAULT_DEPARTMENTS) {
    const existing = existingDepartments.get(deptConfig.name);

    if (existing) {
      // Department exists
      if (!existing.hasColors) {
        // Update with colors
        const deptRef = doc(db, 'departments', existing.id);
        await setDoc(
          deptRef,
          {
            colorHex: deptConfig.colorHex,
            colorHexLight: deptConfig.colorHexLight,
            updatedAt: now(),
          },
          { merge: true }
        );
        console.log(`✅ Updated "${deptConfig.name}" with colors`);
        updated++;
      } else {
        console.log(`⏭️  Skipped "${deptConfig.name}" (already has colors)`);
        skipped++;
      }
    } else {
      // Create new department
      const newDeptRef = doc(departmentsRef);
      const newDepartment: DepartmentEntity = {
        id: newDeptRef.id,
        ...deptConfig,
        createdAt: now(),
        updatedAt: now(),
      };

      await setDoc(newDeptRef, newDepartment);
      console.log(`✨ Created "${deptConfig.name}"`);
      created++;
    }
  }

  console.log(`\n🎉 Department seeding complete!`);
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
};
