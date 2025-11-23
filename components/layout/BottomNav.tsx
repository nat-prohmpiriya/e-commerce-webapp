'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Bell, ShoppingBag, Heart, User, Home } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();
    const { getCartItemCount } = useCart();
    const { getWishlistCount } = useWishlist();

    const cartCount = getCartItemCount();
    const wishlistCount = getWishlistCount();

    const navItems = [
        {
            icon: Home,
            label: 'Home',
            path: '/',
            badge: 0,
            requireAuth: false
        },
        {
            icon: ShoppingBag,
            label: 'Cart',
            path: '/cart',
            badge: cartCount,
            requireAuth: false
        },
        {
            icon: Heart,
            label: 'Favorites',
            path: '/favorites',
            badge: wishlistCount,
            requireAuth: true
        },
        {
            icon: User,
            label: 'Account',
            path: '/account',
            badge: 0,
            requireAuth: true
        },
    ];

    const handleNavClick = (item: typeof navItems[0]) => {
        if (item.requireAuth && !user) {
            toast.error('Please sign in to access this feature');
            router.push('/login');
            return;
        }
        router.push(item.path);
    };

    if (pathname !== '/' && pathname !== '/account' && pathname !== '/favorites') {
        return null;
    }

    return (
        <div className="fixed bottom-2 left-0 right-0 w-[432px] mx-auto z-50">
            <div className="bg-black rounded-4xl px-6 py-4 shadow-2xl w-[96%] mx-auto">
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