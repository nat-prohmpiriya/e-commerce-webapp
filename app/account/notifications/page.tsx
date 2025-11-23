'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();

  const [emailNotifications, setEmailNotifications] = useState<NotificationSetting[]>([
    {
      id: 'order_updates',
      title: 'Order Updates',
      description: 'Get notified about order status changes',
      enabled: true,
    },
    {
      id: 'promotions',
      title: 'Promotions & Offers',
      description: 'Receive exclusive deals and discounts',
      enabled: true,
    },
    {
      id: 'new_arrivals',
      title: 'New Arrivals',
      description: 'Be the first to know about new products',
      enabled: false,
    },
    {
      id: 'newsletters',
      title: 'Newsletters',
      description: 'Weekly updates and fashion tips',
      enabled: false,
    },
  ]);

  const [pushNotifications, setPushNotifications] = useState<NotificationSetting[]>([
    {
      id: 'order_shipped',
      title: 'Order Shipped',
      description: 'When your order is on the way',
      enabled: true,
    },
    {
      id: 'order_delivered',
      title: 'Order Delivered',
      description: 'When your order arrives',
      enabled: true,
    },
    {
      id: 'price_drops',
      title: 'Price Drops',
      description: 'When items in your wishlist go on sale',
      enabled: false,
    },
    {
      id: 'back_in_stock',
      title: 'Back in Stock',
      description: 'When out-of-stock items become available',
      enabled: false,
    },
  ]);

  const handleEmailToggle = (id: string) => {
    setEmailNotifications(prev =>
      prev.map(item =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
    toast.success('Email notification preference updated');
  };

  const handlePushToggle = (id: string) => {
    setPushNotifications(prev =>
      prev.map(item =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
    toast.success('Push notification preference updated');
  };

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
                key={notification.id}
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
                  onClick={() => handleEmailToggle(notification.id)}
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
                key={notification.id}
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
                  onClick={() => handlePushToggle(notification.id)}
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
