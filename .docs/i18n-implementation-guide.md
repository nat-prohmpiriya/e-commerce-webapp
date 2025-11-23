# i18n Implementation Guide - Next.js + next-intl

## 📋 Progress Overview

### ✅ Completed (Step 1-4)
- [x] ติดตั้ง next-intl package
- [x] สร้าง i18n configuration (`i18n.ts`)
- [x] สร้าง middleware สำหรับ locale routing
- [x] สร้าง translation files (`messages/th.json`, `messages/en.json`)
- [x] อัพเดท Product และ Category types รองรับ multi-language

### 🔄 ต้องทำต่อ (Step 5-24)

---

## 📂 Step 5: สร้างโครงสร้าง [locale] ใน app directory

### สร้าง folder structure:
```bash
mkdir -p app/[locale]
```

---

## 📂 Step 6-8: ย้ายไฟล์ไปยัง [locale] routing

### ย้ายไฟล์ดังนี้:

```bash
# Homepage
mv app/page.tsx app/[locale]/page.tsx

# Products
mv app/products app/[locale]/products

# Cart (ถ้ามี)
mv app/cart app/[locale]/cart

# Checkout (ถ้ามี)
mv app/checkout app/[locale]/checkout

# Account pages (ถ้ามี)
mv app/account app/[locale]/account

# Favorites (ถ้ามี)
mv app/favorites app/[locale]/favorites
```

**หมายเหตุ:** ไม่ต้องย้าย `app/admin/*` เพราะ admin panel ไม่ต้อง i18n

---

## 📄 Step 8: สร้าง app/[locale]/layout.tsx

สร้างไฟล์ `app/[locale]/layout.tsx`:

```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import LayoutApp from '@/components/layout/LayoutApp';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { OrderProvider } from '@/context/OrderContext';
import { Toaster } from 'react-hot-toast';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get translations
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ProductProvider>
              <CategoryProvider>
                <CartProvider>
                  <WishlistProvider>
                    <OrderProvider>
                      <LayoutApp>
                        {children}
                      </LayoutApp>
                      <Toaster position="top-center" />
                    </OrderProvider>
                  </WishlistProvider>
                </CartProvider>
              </CategoryProvider>
            </ProductProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

## ⚙️ Step 9: อัพเดท next.config.ts

เพิ่ม next-intl plugin ใน `next.config.ts`:

```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
```

---

## 🛠️ Step 10: สร้าง Helper Function

สร้างไฟล์ `utils/localization.ts`:

```typescript
import { Product, Category } from '@/types';

export type Locale = 'th' | 'en';

/**
 * Get localized product name
 */
export function getProductName(product: Product, locale: Locale): string {
  return locale === 'th' ? product.name_th : product.name_en;
}

/**
 * Get localized product description
 */
export function getProductDescription(product: Product, locale: Locale): string {
  return locale === 'th' ? product.description_th : product.description_en;
}

/**
 * Get localized product category
 */
export function getProductCategory(product: Product, locale: Locale): string {
  return locale === 'th' ? product.category_th : product.category_en;
}

/**
 * Get localized category name
 */
export function getCategoryName(category: Category, locale: Locale): string {
  return locale === 'th' ? category.name_th : category.name_en;
}

/**
 * Get localized category description
 */
export function getCategoryDescription(category: Category, locale: Locale): string | undefined {
  return locale === 'th' ? category.description_th : category.description_en;
}
```

---

## 🔄 Step 11-12: อัพเดท Context Providers

### อัพเดท ProductContext.tsx

ไม่ต้องแก้อะไรมาก เพียงแค่ให้ components ที่ใช้ product data เรียกใช้ helper functions แทน

### อัพเดท CategoryContext.tsx

เช่นเดียวกัน ให้ components เรียกใช้ helper functions

---

## 🎨 Step 13-19: อัพเดท Components

### 1. Header.tsx

```tsx
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
        {/* Avatar code ... */}
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
```

### 2. FilterSheet.tsx

แทนที่ hardcoded text ด้วย `useTranslations('Filter')`:

```tsx
const t = useTranslations('Filter');

// ตัวอย่าง:
<h2>{t('title')}</h2>
<h3>{t('sortBy')}</h3>

// Sort options:
{ value: 'newest', label: t('newest') },
{ value: 'price-asc', label: t('priceAsc') },
```

### 3. SideNav.tsx & BottomNav.tsx

```tsx
const t = useTranslations('Navigation');

const navItems = [
  { icon: Home, label: t('home'), path: '/', ... },
  { icon: ShoppingBag, label: t('cart'), path: '/cart', ... },
  { icon: Heart, label: t('favorites'), path: '/favorites', ... },
  // ...
];
```

**⚠️ สำคัญ:** ต้องเปลี่ยน path จาก `'/'` เป็น dynamic locale path:

```tsx
import { useParams } from 'next/navigation';

const params = useParams();
const locale = params.locale as string;

const navItems = [
  { icon: Home, label: t('home'), path: `/${locale}`, ... },
  { icon: ShoppingBag, label: t('cart'), path: `/${locale}/cart`, ... },
];
```

### 4. ProductCard.tsx

```tsx
'use client';

import { useLocale } from 'next-intl';
import { getProductName } from '@/utils/localization';
import type { Locale } from '@/utils/localization';

export default function ProductCard({ product }: { product: Product }) {
  const locale = useLocale() as Locale;

  const productName = getProductName(product, locale);
  const productCategory = getProductCategory(product, locale);

  return (
    <div>
      <h3>{productName}</h3>
      <p>{productCategory}</p>
      {/* ... */}
    </div>
  );
}
```

### 5. CategoryTabs.tsx

```tsx
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { getCategoryName } from '@/utils/localization';
import type { Locale } from '@/utils/localization';

export default function CategoryTabs({ onCategoryChange }: CategoryTabsProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('Category');
  const { activeCategories } = useCategory();

  const displayCategories = useMemo(() => {
    return [
      { id: 'all', name: t('all'), slug: 'all' },
      ...activeCategories.map(cat => ({
        id: cat.id,
        name: getCategoryName(cat, locale),
        slug: cat.slug
      }))
    ];
  }, [activeCategories, locale, t]);

  return (
    // render categories...
  );
}
```

### 6. Product Detail Page (app/[locale]/products/[productId]/page.tsx)

```tsx
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { getProductName, getProductDescription, getProductCategory } from '@/utils/localization';
import type { Locale } from '@/utils/localization';

export default function ProductDetailPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations('Product');
  const { getProductById } = useProduct();
  const product = getProductById(productId);

  if (!product) return <div>{t('notFound')}</div>;

  const productName = getProductName(product, locale);
  const productDescription = getProductDescription(product, locale);
  const productCategory = getProductCategory(product, locale);

  const handleAddToCart = () => {
    // ...
    toast.success(
      quantity > 1
        ? t('addedToCart', { quantity })
        : t('addedToCartSingle', { quantity })
    );
  };

  return (
    <div>
      <h1>{productName}</h1>
      <p>{productCategory}</p>
      <p>{productDescription}</p>
      {/* ... */}
    </div>
  );
}
```

---

## 🌐 Step 20-21: สร้าง Language Switcher

### สร้าง components/LanguageSwitcher.tsx

```tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;

    // Replace current locale in pathname with new locale
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Languages size={20} />
        <span className="text-sm font-medium">
          {currentLanguage?.flag} {currentLanguage?.name}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  locale === lang.code ? 'bg-gray-50 font-semibold' : ''
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
                {locale === lang.code && (
                  <span className="ml-auto text-green-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

### เพิ่ม LanguageSwitcher ใน SideNav.tsx

```tsx
import LanguageSwitcher from '../LanguageSwitcher';

// เพิ่มใน Bottom Actions section (ก่อน Sign In/Sign Out button):
<div className="p-4 border-t border-gray-200">
  <LanguageSwitcher />

  {/* Existing Sign In/Out button */}
</div>
```

---

## 🧪 Step 23: Testing

### ทดสอบ Locale Routes:

1. เปิด `http://localhost:3000` → ควร redirect ไป `/th`
2. ทดสอบ `/th/products` → ควรแสดงภาษาไทย
3. ทดสอบ `/en/products` → ควรแสดงภาษาอังกฤษ
4. คลิก Language Switcher → ควรเปลี่ยนภาษาได้
5. ทดสอบ `/admin` → ไม่มี locale, ทำงานปกติ

---

## 📊 Step 24: Firestore Migration Guide

### สำหรับ Products และ Categories ที่มีอยู่แล้ว

เนื่องจากเรามี deprecated fields (`name`, `description`, `category`) ไว้แล้ว ข้อมูลเก่าจะยังใช้งานได้

**วิธีที่ 1: Migration Script (แนะนำ)**

สร้างไฟล์ `scripts/migrate-to-i18n.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// Firebase config...

async function migrateProducts() {
  const db = getFirestore();
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);

  for (const docSnap of snapshot.docs) {
    const product = docSnap.data();

    // ถ้ายังไม่มี multi-language fields
    if (!product.name_th || !product.name_en) {
      await updateDoc(doc(db, 'products', docSnap.id), {
        name_th: product.name || '',
        name_en: product.name || '', // ต้องแปลเองภายหลัง
        description_th: product.description || '',
        description_en: product.description || '', // ต้องแปลเองภายหลัง
        category_th: product.category || '',
        category_en: product.category || '', // ต้องแปลเองภายหลัง
      });

      console.log(`Migrated product: ${docSnap.id}`);
    }
  }
}

async function migrateCategories() {
  const db = getFirestore();
  const categoriesRef = collection(db, 'categories');
  const snapshot = await getDocs(categoriesRef);

  for (const docSnap of snapshot.docs) {
    const category = docSnap.data();

    if (!category.name_th || !category.name_en) {
      await updateDoc(doc(db, 'categories', docSnap.id), {
        name_th: category.name || '',
        name_en: category.name || '', // ต้องแปลเองภายหลัง
        description_th: category.description || '',
        description_en: category.description || '',
      });

      console.log(`Migrated category: ${docSnap.id}`);
    }
  }
}

// Run migrations
migrateProducts().then(() => migrateCategories());
```

**วิธีที่ 2: ทำใน Admin Panel**

เพิ่ม fields ใหม่ใน Admin Product/Category forms:
- name_th, name_en
- description_th, description_en
- category_th, category_en

---

## ✅ Checklist สุดท้าย

- [ ] ทุก page ใน `app/[locale]/*` ทำงานได้
- [ ] Language Switcher ทำงานได้
- [ ] เปลี่ยนภาษาแล้ว URL เปลี่ยนตาม
- [ ] Translation keys ทั้งหมดถูกต้อง
- [ ] Admin panel ยังทำงานปกติ (ไม่มี locale)
- [ ] Middleware ไม่ intercept admin routes
- [ ] Product และ Category แสดงภาษาถูกต้องตาม locale
- [ ] Toast messages แสดงภาษาถูกต้อง

---

## 🎯 คำสั่งที่ใช้บ่อย

```bash
# ตรวจสอบ structure
ls -R app/

# ทดสอบ build
npm run build

# ทดสอบ dev
npm run dev
```

---

## 📝 หมายเหตุสำคัญ

1. **Admin Panel:** ไม่ต้อง i18n, เก็บไว้ที่ `app/admin/*`
2. **API Routes:** ถ้ามี API routes อย่าลืม exclude จาก middleware
3. **Metadata:** อัพเดท SEO metadata ให้รองรับ multi-language
4. **Images:** Alt text ควรเป็น localized เช่นกัน

---

**สร้างโดย:** Claude Code
**วันที่:** 2025-11-24
**Status:** ✅ Step 1-4 เสร็จแล้ว | 🔄 Step 5-24 รอดำเนินการ
