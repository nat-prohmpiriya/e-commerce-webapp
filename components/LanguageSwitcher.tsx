'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'th', flag: '🇹🇭', name: 'ไทย', displayName: 'Thai' },
  { code: 'en', flag: '🇺🇸', name: 'English', displayName: 'English' },
  { code: 'zh', flag: '🇨🇳', name: '中文', displayName: 'Chinese' },
  { code: 'ja', flag: '🇯🇵', name: '日本語', displayName: 'Japanese' },
];

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

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <div className="flex items-center gap-3 p-4 border-t border-gray-200">
      <Globe size={20} className="text-gray-500 flex-shrink-0" />
      <div className="flex-1">
        <select
          value={locale}
          onChange={(e) => switchLanguage(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
