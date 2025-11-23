'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const router = useRouter();
  const { settings, loading, updateNotificationSettings } = useSettings();

  const handleEmailToggle = async (key: 'orderUpdates' | 'promotions' | 'newsletter') => {
    try {
      await updateNotificationSettings({
        email: {
          ...settings.notifications.email,
          [key]: !settings.notifications.email[key],
        },
      });
      toast.success('Email notification preference updated');
    } catch (error) {
      toast.error('Failed to update preference');
    }
  };

  const handlePushToggle = async (key: 'orderUpdates' | 'promotions' | 'newArrivals') => {
    try {
      await updateNotificationSettings({
        push: {
          ...settings.notifications.push,
          [key]: !settings.notifications.push[key],
        },
      });
      toast.success('Push notification preference updated');
    } catch (error) {
      toast.error('Failed to update preference');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  const emailNotifications = [
    {
      key: 'orderUpdates' as const,
      title: 'Order Updates',
      description: 'Get notified about order status changes',
      enabled: settings.notifications.email.orderUpdates,
    },
    {
      key: 'promotions' as const,
      title: 'Promotions & Offers',
      description: 'Receive exclusive deals and discounts',
      enabled: settings.notifications.email.promotions,
    },
    {
      key: 'newsletter' as const,
      title: 'Newsletter',
      description: 'Weekly updates and fashion tips',
      enabled: settings.notifications.email.newsletter,
    },
  ];

  const pushNotifications = [
    {
      key: 'orderUpdates' as const,
      title: 'Order Updates',
      description: 'Get notified about order status changes',
      enabled: settings.notifications.push.orderUpdates,
    },
    {
      key: 'promotions' as const,
      title: 'Promotions & Offers',
      description: 'Receive exclusive deals and discounts',
      enabled: settings.notifications.push.promotions,
    },
    {
      key: 'newArrivals' as const,
      title: 'New Arrivals',
      description: 'Be the first to know about new products',
      enabled: settings.notifications.push.newArrivals,
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
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="px-4 py-6 space-y-6">
        {/* Email Notifications */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Email Notifications</h2>
          <p className="text-sm text-gray-500 mb-4">
            Choose what updates you want to receive via email
          </p>
          <div className="space-y-3">
            {emailNotifications.map((notification) => (
              <div
                key={notification.key}
                className="bg-white rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {notification.description}
                  </p>
                </div>
                <button
                  onClick={() => handleEmailToggle(notification.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notification.enabled ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notification.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Push Notifications</h2>
          <p className="text-sm text-gray-500 mb-4">
            Get instant updates on your mobile device
          </p>
          <div className="space-y-3">
            {pushNotifications.map((notification) => (
              <div
                key={notification.key}
                className="bg-white rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {notification.description}
                  </p>
                </div>
                <button
                  onClick={() => handlePushToggle(notification.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notification.enabled ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notification.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
