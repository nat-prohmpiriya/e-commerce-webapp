'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, ShoppingBag, Heart, User, Package, Settings, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useTranslations, useLocale } from 'next-intl';
import toast from 'react-hot-toast';
import Image from 'next/image';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SideNav() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations('Navigation');
    const tAuth = useTranslations('Auth');
    const { user, signOut } = useAuth();
    const { getCartItemCount } = useCart();
    const { getWishlistCount } = useWishlist();

    // Don't show SideNav on admin pages
    if (pathname.includes('/admin')) {
        return null;
    }

    const cartCount = getCartItemCount();
    const wishlistCount = getWishlistCount();

    const navItems = [
        {
            icon: Home,
            label: t('home'),
            path: `/${locale}`,
            badge: 0,
            requireAuth: false
        },
        {
            icon: ShoppingBag,
            label: t('cart'),
            path: `/${locale}/cart`,
            badge: cartCount,
            requireAuth: false
        },
        {
            icon: Heart,
            label: t('favorites'),
            path: `/${locale}/favorites`,
            badge: wishlistCount,
            requireAuth: true
        },
        {
            icon: Package,
            label: t('orders'),
            path: `/${locale}/account/orders`,
            badge: 0,
            requireAuth: true
        },
        {
            icon: User,
            label: t('account'),
            path: `/${locale}/account`,
            badge: 0,
            requireAuth: true
        },
    ];

    const handleNavClick = (item: typeof navItems[0]) => {
        if (item.requireAuth && !user) {
            toast.error(tAuth('pleaseSignIn'));
            router.push(`/${locale}/login`);
            return;
        }
        router.push(item.path);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success(tAuth('signedOutSuccess'));
            router.push(`/${locale}`);
        } catch (error) {
            toast.error(tAuth('signOutFailed'));
        }
    };

    return (
        <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex-col z-40">
            {/* Logo/Brand */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">StyleShop</h1>
            </div>



            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <li key={item.path}>
                                <button
                                    onClick={() => handleNavClick(item)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? 'bg-black text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="relative">
                                        <Icon size={20} />
                                        {item.badge > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                {item.badge > 9 ? '9+' : item.badge}
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Language Switcher */}
            <LanguageSwitcher />
            {/* User Profile Section */}
            {user && (
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                            {user.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt={user.displayName || 'User'}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-100">
                                    <span className="text-blue-600 font-semibold text-lg">
                                        {user.displayName?.charAt(0) || 'U'}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {user.displayName || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            )}
            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-200">
                {user ? (
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">{t('signOut')}</span>
                    </button>
                ) : (
                    <button
                        onClick={() => router.push(`/${locale}/login`)}
                        className="w-full bg-black text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                        {t('signIn')}
                    </button>
                )}
            </div>
        </aside>
    );
}
