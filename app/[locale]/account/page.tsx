'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
    User,
    Package,
    MapPin,
    CreditCard,
    Bell,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountPage() {
    const t = useTranslations('Account');
    const tAuth = useTranslations('Auth');
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success(t('signedOutSuccess'));
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
            toast.error(t('signOutFailed'));
        }
    };

    const menuItems = [
        {
            icon: Package,
            label: t('myOrders'),
            description: t('viewOrderHistory'),
            path: '/account/orders',
            badge: null
        },
        {
            icon: MapPin,
            label: t('shippingAddresses'),
            description: t('manageAddresses'),
            path: '/account/addresses',
            badge: null
        },
        {
            icon: CreditCard,
            label: t('paymentMethods'),
            description: t('managePaymentCards'),
            path: '/account/payment-methods',
            badge: null
        },
        {
            icon: Bell,
            label: t('notifications'),
            description: t('manageNotifications'),
            path: '/account/notifications',
            badge: null
        },
        {
            icon: Settings,
            label: t('settings'),
            description: t('appPreferences'),
            path: '/account/settings',
            badge: null
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white px-4 py-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('title')}</h1>

                {/* User Profile */}
                <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {user?.photoURL ? (
                            <Image
                                src={user.photoURL}
                                alt={user.displayName || 'User'}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-100">
                                <User size={40} className="text-blue-600" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900">
                            {user?.displayName || t('guestUser')}
                        </h2>
                        <p className="text-sm text-gray-500">{user?.email || t('notSignedIn')}</p>
                        {!user && (
                            <button
                                onClick={() => router.push('/login')}
                                className="mt-2 text-sm text-blue-600 font-medium hover:underline"
                            >
                                {t('signInToAccount')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="px-4 py-6 space-y-3">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Icon size={24} className="text-gray-700" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-semibold text-gray-900">{item.label}</h3>
                                <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </button>
                    );
                })}
            </div>

            {/* Sign Out Button */}
            {user && (
                <div className="px-4 py-4">
                    <button
                        onClick={handleSignOut}
                        className="w-full bg-red-50 text-red-600 rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-red-100 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-semibold">{tAuth('signOut')}</span>
                    </button>
                </div>
            )}

            {/* App Version */}
            <div className="px-4 py-4 text-center">
                <p className="text-xs text-gray-400">{t('version')}</p>
            </div>
        </div>
    );
}
