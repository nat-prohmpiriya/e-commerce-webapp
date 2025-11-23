'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

export interface NotificationSettings {
  email: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  push: {
    orderUpdates: boolean;
    promotions: boolean;
    newArrivals: boolean;
  };
}

export interface AppSettings {
  appearance: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  privacy: {
    shareData: boolean;
    personalizedAds: boolean;
  };
  media: {
    autoPlayVideos: boolean;
    downloadOverWifi: boolean;
  };
}

export interface UserSettings {
  notifications: NotificationSettings;
  app: AppSettings;
}

interface SettingsContextType {
  settings: UserSettings;
  loading: boolean;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  updateAppSettings: (settings: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const defaultSettings: UserSettings = {
  notifications: {
    email: {
      orderUpdates: true,
      promotions: true,
      newsletter: false,
    },
    push: {
      orderUpdates: true,
      promotions: false,
      newArrivals: false,
    },
  },
  app: {
    appearance: 'system',
    language: 'en',
    currency: 'USD',
    privacy: {
      shareData: false,
      personalizedAds: false,
    },
    media: {
      autoPlayVideos: false,
      downloadOverWifi: true,
    },
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'ecommerce_settings';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage
  const loadSettingsFromLocalStorage = (): UserSettings => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
    return defaultSettings;
  };

  // Save settings to localStorage
  const saveSettingsToLocalStorage = (userSettings: UserSettings) => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(userSettings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  };

  // Load settings from Firestore
  const loadSettingsFromFirestore = async (userId: string): Promise<UserSettings> => {
    try {
      const settingsRef = doc(db, 'userSettings', userId);
      const settingsDoc = await getDoc(settingsRef);

      if (settingsDoc.exists()) {
        return settingsDoc.data() as UserSettings;
      }
    } catch (error) {
      console.error('Error loading settings from Firestore:', error);
    }
    return defaultSettings;
  };

  // Save settings to Firestore
  const saveSettingsToFirestore = async (userId: string, userSettings: UserSettings) => {
    try {
      const settingsRef = doc(db, 'userSettings', userId);
      await setDoc(settingsRef, userSettings, { merge: true });
    } catch (error) {
      console.error('Error saving settings to Firestore:', error);
      throw error;
    }
  };

  // Initialize settings
  useEffect(() => {
    const initSettings = async () => {
      setLoading(true);

      if (user) {
        // User is logged in, load from Firestore
        const firestoreSettings = await loadSettingsFromFirestore(user.id);
        setSettings(firestoreSettings);
      } else {
        // User is not logged in, load from localStorage
        const localSettings = loadSettingsFromLocalStorage();
        setSettings(localSettings);
      }

      setLoading(false);
    };

    initSettings();
  }, [user]);

  // Update notification settings
  const updateNotificationSettings = async (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings: UserSettings = {
      ...settings,
      notifications: {
        email: {
          ...settings.notifications.email,
          ...(newSettings.email || {}),
        },
        push: {
          ...settings.notifications.push,
          ...(newSettings.push || {}),
        },
      },
    };

    setSettings(updatedSettings);

    // Save to appropriate storage
    if (user) {
      await saveSettingsToFirestore(user.id, updatedSettings);
    } else {
      saveSettingsToLocalStorage(updatedSettings);
    }
  };

  // Update app settings
  const updateAppSettings = async (newSettings: Partial<AppSettings>) => {
    const updatedSettings: UserSettings = {
      ...settings,
      app: {
        ...settings.app,
        ...newSettings,
        privacy: {
          ...settings.app.privacy,
          ...(newSettings.privacy || {}),
        },
        media: {
          ...settings.app.media,
          ...(newSettings.media || {}),
        },
      },
    };

    setSettings(updatedSettings);

    // Save to appropriate storage
    if (user) {
      await saveSettingsToFirestore(user.id, updatedSettings);
    } else {
      saveSettingsToLocalStorage(updatedSettings);
    }
  };

  // Reset to default settings
  const resetSettings = async () => {
    setSettings(defaultSettings);

    if (user) {
      await saveSettingsToFirestore(user.id, defaultSettings);
    } else {
      saveSettingsToLocalStorage(defaultSettings);
    }
  };

  const value: SettingsContextType = {
    settings,
    loading,
    updateNotificationSettings,
    updateAppSettings,
    resetSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
