'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Bell, ShoppingBag, Heart, User, Home } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useTranslations, useLocale } from 'next-intl';
import toast from 'react-hot-toast';

export default function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations('Navigation');
    const tAuth = useTranslations('Auth');
    const { user } = useAuth();
    const { getCartItemCount } = useCart();
    const { getWishlistCount } = useWishlist();

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

    // Show BottomNav on all pages except admin pages
    if (pathname.startsWith(`/${locale}/admin`)) {
        return null;
    }

    return (
        <div className="md:hidden fixed bottom-2 left-0 right-0 max-w-[432px] mx-auto z-50 px-2">
            <div className="bg-black rounded-4xl px-6 py-4 shadow-2xl">
                <div className="flex justify-between items-center">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <div className='' key={item.path}>
                                <button
                                    key={item.path}
                                    onClick={() => handleNavClick(item)}
                                    className={`flex flex-col items-center justify-center relative transition-colors ${isActive ? 'text-white' : 'text-gray-400'
                                        }`}
                                >
                                    <div className="relative">
                                        <Icon size={24} />
                                        {item.badge > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                {item.badge > 9 ? '9+' : item.badge}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* iPhone home indicator */}
                <div className="flex justify-center mt-2">
                    <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}