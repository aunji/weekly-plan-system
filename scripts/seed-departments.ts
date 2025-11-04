/**
 * Standalone Department Seeding Script
 * Run with: node --loader ts-node/esm scripts/seed-departments.ts
 * Or add to package.json scripts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';

// Firebase configuration - update with your credentials
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Default department configurations
const DEFAULT_DEPARTMENTS = [
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

async function seedDepartments() {
  console.log('🌱 Starting department seeding...');

  const departmentsRef = collection(db, 'departments');
  const snapshot = await getDocs(departmentsRef);

  // Get existing departments
  const existingDepartments = new Map<string, { id: string; hasColors: boolean }>();
  snapshot.docs.forEach(docSnap => {
    const data = docSnap.data();
    existingDepartments.set(data.name, {
      id: docSnap.id,
      hasColors: !!(data.colorHex && data.colorHexLight),
    });
  });

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const deptConfig of DEFAULT_DEPARTMENTS) {
    const existing = existingDepartments.get(deptConfig.name);
    const timestamp = Timestamp.now();

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
            updatedAt: timestamp,
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
      const newDepartment = {
        id: newDeptRef.id,
        ...deptConfig,
        createdAt: timestamp,
        updatedAt: timestamp,
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
}

// Run the seeding
seedDepartments()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error seeding departments:', error);
    process.exit(1);
  });
