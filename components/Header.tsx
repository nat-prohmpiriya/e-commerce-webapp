'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface HeaderProps {
  onFilterClick?: () => void;
}

export default function Header({ onFilterClick }: HeaderProps) {
  const { user } = useAuth();
  const t = useTranslations('Header');

  return (
    <div className="px-4 md:px-6 pt-4 pb-2">
      {/* User Greeting - Only on Mobile */}
      <div className="md:hidden flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 text-sm">{t('greeting')}</p>
          <h1 className="text-xl font-bold text-gray-900">
            {user?.displayName || t('guest')}
          </h1>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          {user?.photoURL ? (
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
                {user?.displayName?.charAt(0) || 'G'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Title */}
      <div className="hidden md:block mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('subtitle')}</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
        <button
          onClick={onFilterClick}
          className="bg-black text-white p-3 rounded-xl hover:bg-gray-800 transition-colors"
        >
          <SlidersHorizontal size={24} />
        </button>
      </div>
    </div>
  );
}
