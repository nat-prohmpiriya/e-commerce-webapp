'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const { settings, loading, updateAppSettings } = useSettings();

  const handleToggleAppearance = async (value: 'light' | 'dark' | 'system') => {
    try {
      await updateAppSettings({ appearance: value });
      toast.success('Appearance updated');
    } catch (error) {
      toast.error('Failed to update appearance');
    }
  };

  const handlePrivacyToggle = async (key: 'shareData' | 'personalizedAds') => {
    try {
      await updateAppSettings({
        privacy: {
          ...settings.app.privacy,
          [key]: !settings.app.privacy[key],
        },
      });
      toast.success('Privacy setting updated');
    } catch (error) {
      toast.error('Failed to update privacy setting');
    }
  };

  const handleMediaToggle = async (key: 'autoPlayVideos' | 'downloadOverWifi') => {
    try {
      await updateAppSettings({
        media: {
          ...settings.app.media,
          [key]: !settings.app.media[key],
        },
      });
      toast.success('Media setting updated');
    } catch (error) {
      toast.error('Failed to update media setting');
    }
  };

  const handleLanguageChange = async (language: string) => {
    try {
      await updateAppSettings({ language });
      toast.success(`Language changed to ${language}`);
    } catch (error) {
      toast.error('Failed to change language');
    }
  };

  const handleCurrencyChange = async (currency: string) => {
    try {
      await updateAppSettings({ currency });
      toast.success(`Currency changed to ${currency}`);
    } catch (error) {
      toast.error('Failed to change currency');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  const appearanceOptions = [
    { value: 'light' as const, label: 'Light' },
    { value: 'dark' as const, label: 'Dark' },
    { value: 'system' as const, label: 'System' },
  ];

  const privacySettings = [
    {
      key: 'shareData' as const,
      label: 'Share Usage Data',
      description: 'Help us improve by sharing anonymous usage data',
      enabled: settings.app.privacy.shareData,
    },
    {
      key: 'personalizedAds' as const,
      label: 'Personalized Ads',
      description: 'Show ads based on your preferences',
      enabled: settings.app.privacy.personalizedAds,
    },
  ];

  const mediaSettings = [
    {
      key: 'autoPlayVideos' as const,
      label: 'Auto-play Videos',
      description: 'Automatically play product videos',
      enabled: settings.app.media.autoPlayVideos,
    },
    {
      key: 'downloadOverWifi' as const,
      label: 'Download Over Wi-Fi Only',
      description: 'Save mobile data by downloading only on Wi-Fi',
      enabled: settings.app.media.downloadOverWifi,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      {/* Settings Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Appearance */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Appearance</h2>
          <p className="text-sm text-gray-500 mb-4">
            Choose how the app looks on your device
          </p>
          <div className="bg-white rounded-2xl p-4">
            <div className="flex gap-2">
              {appearanceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleToggleAppearance(option.value)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    settings.app.appearance === option.value
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Privacy</h2>
          <p className="text-sm text-gray-500 mb-4">
            Manage your privacy preferences
          </p>
          <div className="space-y-3">
            {privacySettings.map((item) => (
              <div
                key={item.key}
                className="bg-white rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.label}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
                <button
                  onClick={() => handlePrivacyToggle(item.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    item.enabled ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      item.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Media */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Media</h2>
          <p className="text-sm text-gray-500 mb-4">
            Control how media is displayed and downloaded
          </p>
          <div className="space-y-3">
            {mediaSettings.map((item) => (
              <div
                key={item.key}
                className="bg-white rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.label}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
                <button
                  onClick={() => handleMediaToggle(item.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    item.enabled ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      item.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* General Settings */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">General</h2>
          <div className="space-y-3">
            <button
              onClick={() => toast('Language selection menu', { icon: 'ℹ️' })}
              className="w-full bg-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Language
                </h3>
                <p className="text-sm text-gray-500">
                  {settings.app.language === 'en' ? 'English (US)' : settings.app.language}
                </p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button
              onClick={() => toast('Currency selection menu', { icon: 'ℹ️' })}
              className="w-full bg-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Currency
                </h3>
                <p className="text-sm text-gray-500">
                  {settings.app.currency} ({settings.app.currency === 'USD' ? '$' : settings.app.currency})
                </p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                toast.success('Cache cleared successfully');
              }}
              className="w-full bg-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Clear Cache
                </h3>
                <p className="text-sm text-gray-500">
                  Free up storage space
                </p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Legal</h2>
          <div className="space-y-3">
            <button
              onClick={() => toast('Terms of Service page', { icon: 'ℹ️' })}
              className="w-full bg-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">
                Terms of Service
              </h3>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button
              onClick={() => toast('Privacy Policy page', { icon: 'ℹ️' })}
              className="w-full bg-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">
                Privacy Policy
              </h3>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button
              onClick={() => toast('About page', { icon: 'ℹ️' })}
              className="w-full bg-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">
                About
              </h3>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-400">Version 1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">© 2024 E-Commerce Store</p>
        </div>
      </div>
    </div>
  );
}
