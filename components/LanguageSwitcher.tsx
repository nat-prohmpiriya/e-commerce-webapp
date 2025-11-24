'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    // Remove current locale from pathname and add new locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale || ''}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t border-gray-200">
      <Globe size={20} className="text-gray-500" />
      <div className="flex gap-2 flex-1">
        <button
          onClick={() => switchLanguage('th')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            locale === 'th'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ไทย
        </button>
        <button
          onClick={() => switchLanguage('en')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            locale === 'en'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          English
        </button>
      </div>
    </div>
  );
}
