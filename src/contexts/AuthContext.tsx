import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import type { User, UserFormData } from '@/types';
import { userConverter, now } from '@/utils/firestore';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: UserFormData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid).withConverter(userConverter);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Check if user profile exists, if not create it
    const userDocRef = doc(db, 'users', result.user.uid).withConverter(userConverter);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create basic user profile from Google data
      const newUser: User = {
        id: result.user.uid,
        email: result.user.email || '',
        name: result.user.displayName || '',
        department: 'Other', // Default department
        language: 'en', // Default language
        projects: [],
        createdAt: now(),
        updatedAt: now(),
      };
      await setDoc(userDocRef, newUser);
      setUserData(newUser);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (data: UserFormData) => {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    const userDocRef = doc(db, 'users', currentUser.uid).withConverter(userConverter);
    const timestamp = now();

    // Check if user document exists
    const userDoc = await getDoc(userDocRef);
    const oldUserData = userDoc.exists() ? userDoc.data() : null;

    let updatedUser: User;

    if (userDoc.exists()) {
      // Update existing user
      updatedUser = {
        ...userDoc.data(),
        ...data,
        updatedAt: timestamp,
      };
      await setDoc(userDocRef, updatedUser);
      setUserData(updatedUser);
    } else {
      // Create new user document
      const newUser: User = {
        id: currentUser.uid,
        email: currentUser.email || '',
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      await setDoc(userDocRef, newUser);
      setUserData(newUser);
      updatedUser = newUser;
    }

    // Update all weekly plans if name or department changed
    const nameChanged = oldUserData && oldUserData.name !== data.name;
    const departmentChanged = oldUserData && oldUserData.department !== data.department;

    console.log('Profile Update Check:', {
      oldName: oldUserData?.name,
      newName: data.name,
      nameChanged,
      oldDepartment: oldUserData?.department,
      newDepartment: data.department,
      departmentChanged,
    });

    if (nameChanged || departmentChanged) {
      try {
        console.log('Updating weekly plans...');
        // Query all plans for this user
        const plansRef = collection(db, 'weekly_plans');
        const q = query(plansRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        console.log(`Found ${querySnapshot.size} plan(s) to update`);

        if (!querySnapshot.empty) {
          // Use batch to update all plans
          const batch = writeBatch(db);

          querySnapshot.forEach((planDoc) => {
            const planRef = doc(db, 'weekly_plans', planDoc.id);
            const updates: any = {
              updatedAt: timestamp,
            };

            if (nameChanged) {
              updates.userName = data.name;
            }
            if (departmentChanged) {
              updates.userDepartment = data.department;
            }

            console.log(`Updating plan ${planDoc.id}:`, updates);
            batch.update(planRef, updates);
          });

          await batch.commit();
          console.log(`✅ Successfully updated ${querySnapshot.size} plan(s) with new user info`);
        } else {
          console.log('No plans found to update');
        }
      } catch (error) {
        console.error('❌ Error updating weekly plans:', error);
        // Don't throw error - profile update succeeded even if plans update failed
      }
    } else {
      console.log('No changes to name or department - skipping plan updates');
    }
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    login,
    signup,
    signInWithGoogle,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
