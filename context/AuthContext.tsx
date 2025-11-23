'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Create user document in Firestore
  const createUserDocument = async (
    firebaseUser: FirebaseUser,
    additionalData?: { displayName?: string }
  ) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const newUser: any = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: additionalData?.displayName || firebaseUser.displayName || '',
          role: 'customer',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          addresses: [],
          paymentMethods: [],
        };

        // Only add optional fields if they exist
        if (firebaseUser.photoURL) {
          newUser.photoURL = firebaseUser.photoURL;
        }
        if (firebaseUser.phoneNumber) {
          newUser.phoneNumber = firebaseUser.phoneNumber;
        }

        await setDoc(userRef, newUser);

        // Return user object with Date for local state
        return {
          ...newUser,
          photoURL: firebaseUser.photoURL || undefined,
          phoneNumber: firebaseUser.phoneNumber || undefined,
          createdAt: new Date() as any,
          updatedAt: new Date() as any,
        } as User;
      }

      return userSnap.data() as User;
    } catch (error) {
      console.error('Error creating user document:', error);
      // Return a minimal user object if Firestore fails
      const fallbackUser: any = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: additionalData?.displayName || firebaseUser.displayName || '',
        role: 'customer' as const,
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
        addresses: [],
        paymentMethods: [],
      };

      // Only add optional fields if they exist
      if (firebaseUser.photoURL) {
        fallbackUser.photoURL = firebaseUser.photoURL;
      }
      if (firebaseUser.phoneNumber) {
        fallbackUser.phoneNumber = firebaseUser.phoneNumber;
      }

      return fallbackUser as User;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await createUserDocument(userCredential.user, { displayName });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserDocument(result.user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      // Update local state
      const updatedUser = await fetchUserData(user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        try {
          const userData = await fetchUserData(firebaseUser.uid);
          if (userData) {
            setUser(userData);
          } else {
            // Create user document if it doesn't exist
            const newUser = await createUserDocument(firebaseUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
          // Create a basic user object from Firebase Auth data if Firestore fails
          const fallbackUser: any = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            role: 'customer' as const,
            createdAt: new Date() as any,
            updatedAt: new Date() as any,
            addresses: [],
            paymentMethods: [],
          };

          // Only add optional fields if they exist
          if (firebaseUser.photoURL) {
            fallbackUser.photoURL = firebaseUser.photoURL;
          }
          if (firebaseUser.phoneNumber) {
            fallbackUser.phoneNumber = firebaseUser.phoneNumber;
          }

          setUser(fallbackUser as User);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
