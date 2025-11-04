# Department Theme & Profile Upgrade Migration Guide

This guide explains how to migrate existing data to support the new department theming and profile picture features.

## Overview

The upgrade adds:
- Department color theming (colorHex, colorHexLight fields)
- User profile pictures (photoURL, photoUpdatedAt fields)
- Firebase Storage integration

## Migration Steps

### 1. Update Firebase Configuration

Ensure Firebase Storage is enabled in your Firebase Console:
1. Go to Firebase Console → Storage
2. Click "Get Started"
3. Choose security rules (production mode recommended)
4. Deploy storage rules: `firebase deploy --only storage`

### 2. Seed Department Colors

Run the department seeding script to add colors to existing departments:

```bash
# Option 1: Using the seeding utility (from app)
# Add this to a button in your admin panel or run in browser console:
import { seedDepartments } from '@/utils/seedDepartments';
seedDepartments();

# Option 2: Using the standalone script
# First, create a .env file with your Firebase credentials
npm run seed:departments
```

**Default Department Colors:**
- Design: Cyan (#06b6d4)
- Animation: Purple (#a855f7)
- Programmer: Green (#10b981)
- QA: Red (#ef4444)
- IT: Blue (#3b82f6)
- Game: Amber (#f59e0b)
- Marketing: Pink (#ec4899)
- Management: Violet (#8b5cf6)
- Other: Gray (#6b7280)

### 3. User Profile Pictures

No migration needed for photoURL fields - they are optional and will be populated when users upload their profile pictures.

## Schema Changes

### Departments Collection

**Before:**
```typescript
{
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**After:**
```typescript
{
  id: string;
  name: string;
  colorHex: string;        // NEW
  colorHexLight: string;   // NEW
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Users Collection

**Before:**
```typescript
{
  id: string;
  email: string;
  name: string;
  department: Department;
  language: Language;
  projects: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**After:**
```typescript
{
  id: string;
  email: string;
  name: string;
  department: Department;
  language: Language;
  projects: string[];
  photoURL?: string;        // NEW
  photoUpdatedAt?: Timestamp; // NEW
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Rollback Plan

If you need to rollback:

1. The new fields are optional, so old code will continue to work
2. Remove the storage rules from `storage.rules`
3. Revert the Firestore schema by removing colorHex/colorHexLight from departments
4. Remove photoURL/photoUpdatedAt from users

## Testing

After migration:

1. ✅ Verify departments have colors assigned
2. ✅ Test profile picture upload
3. ✅ Check department badge colors in dashboard
4. ✅ Verify theme colors apply based on user's department
5. ✅ Test with different departments to see color variations

## Troubleshooting

**Issue:** Department colors not showing
- **Fix:** Run the seed script again or manually add colorHex/colorHexLight fields

**Issue:** Profile picture upload fails
- **Fix:** Check Firebase Storage is enabled and rules are deployed

**Issue:** "Permission denied" on storage
- **Fix:** Verify storage.rules are correctly deployed with `firebase deploy --only storage`
