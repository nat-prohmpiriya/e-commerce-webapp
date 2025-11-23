'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();

  const [settings, setSettings] = useState({
    darkMode: false,
    saveSearchHistory: true,
    showRecommendations: true,
    autoPlayVideos: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success('Setting updated');
  };

  const settingsGroups = [
    {
      title: 'Appearance',
      items: [
        {
          key: 'darkMode' as const,
          label: 'Dark Mode',
          description: 'Use dark theme throughout the app',
          enabled: settings.darkMode,
        },
      ],
    },
    {
      title: 'Privacy',
      items: [
        {
          key: 'saveSearchHistory' as const,
          label: 'Save Search History',
          description: 'Remember your recent searches',
          enabled: settings.saveSearchHistory,
        },
        {
          key: 'showRecommendations' as const,
          label: 'Personalized Recommendations',
          description: 'Show products based on your preferences',
          enabled: settings.showRecommendations,
        },
      ],
    },
    {
      title: 'Media',
      items: [
        {
          key: 'autoPlayVideos' as const,
          label: 'Auto-play Videos',
          description: 'Automatically play product videos',
          enabled: settings.autoPlayVideos,
        },
      ],
    },
  ];

  const actionItems = [
    {
      label: 'Language',
      description: 'English (US)',
      action: () => toast('Language selection will be implemented', { icon: 'ℹ️' }),
    },
    {
      label: 'Currency',
      description: 'USD ($)',
      action: () => toast('Currency selection will be implemented', { icon: 'ℹ️' }),
    },
    {
      label: 'Clear Cache',
      description: 'Free up storage space',
      action: () => {
        toast.success('Cache cleared successfully');
      },
    },
  ];

  const legalItems = [
    {
      label: 'Terms of Service',
      action: () => toast('Terms of Service page will be implemented', { icon: 'ℹ️' }),
    },
    {
      label: 'Privacy Policy',
      action: () => toast('Privacy Policy page will be implemented', { icon: 'ℹ️' }),
    },
    {
      label: 'About',
      action: () => toast('About page will be implemented', { icon: 'ℹ️' }),
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
        {/* Toggle Settings */}
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{group.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              Customize your {group.title.toLowerCase()} preferences
            </p>
            <div className="space-y-3">
              {group.items.map((item) => (
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
                    onClick={() => handleToggle(item.key)}
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
        ))}

        {/* Action Items */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">General</h2>
          <div className="space-y-3">
            {actionItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full bg-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.label}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Legal</h2>
          <div className="space-y-3">
            {legalItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full bg-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900">
                  {item.label}
                </h3>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            ))}
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
