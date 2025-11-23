# i18n Quick Reference - สรุปสั้นๆ

## ✅ ทำเสร็จแล้ว (Step 1-4)

1. ติดตั้ง `next-intl` ✅
2. สร้าง config files:
   - `i18n.ts` ✅
   - `middleware.ts` ✅
   - `messages/th.json` ✅
   - `messages/en.json` ✅
3. อัพเดท types (`types/index.ts`):
   - Product: เพิ่ม `name_th`, `name_en`, `description_th`, `description_en`, `category_th`, `category_en` ✅
   - Category: เพิ่ม `name_th`, `name_en`, `description_th`, `description_en` ✅

---

## 🔄 ต้องทำต่อ (Step 5-24)

### 📂 Step 5-9: Restructure (เปลี่ยนโครงสร้าง folder)

```bash
# 1. สร้าง folder
mkdir -p app/[locale]

# 2. ย้ายไฟล์
mv app/page.tsx app/[locale]/page.tsx
mv app/products app/[locale]/products
# (ย้าย cart, checkout, account, favorites ถ้ามี)

# 3. สร้าง layout.tsx ใหม่
# ดูตัวอย่างใน i18n-implementation-guide.md

# 4. อัพเดท next.config.ts
# เพิ่ม next-intl plugin
```

### 🛠️ Step 10: สร้าง Helper Functions

สร้างไฟล์ `utils/localization.ts` พร้อม functions:
- `getProductName(product, locale)`
- `getProductDescription(product, locale)`
- `getProductCategory(product, locale)`
- `getCategoryName(category, locale)`

### 🎨 Step 11-19: อัพเดท Components

ไฟล์ที่ต้องแก้:
1. `components/Header.tsx` - ใช้ `useTranslations('Header')`
2. `components/FilterSheet.tsx` - ใช้ `useTranslations('Filter')`
3. `components/layout/SideNav.tsx` - ใช้ `useTranslations('Navigation')` + fix paths
4. `components/layout/BottomNav.tsx` - ใช้ `useTranslations('Navigation')` + fix paths
5. `components/ProductCard.tsx` - ใช้ `useLocale()` + helper functions
6. `components/CategoryTabs.tsx` - ใช้ `useLocale()` + helper functions
7. `app/[locale]/products/[productId]/page.tsx` - ใช้ `useLocale()` + helper functions

**สูตรการแก้:**

```tsx
// ก่อน:
<h1>Discover Products</h1>

// หลัง:
import { useTranslations } from 'next-intl';
const t = useTranslations('Header');
<h1>{t('title')}</h1>
```

```tsx
// ก่อน (Product display):
<h3>{product.name}</h3>

// หลัง:
import { useLocale } from 'next-intl';
import { getProductName } from '@/utils/localization';

const locale = useLocale() as 'th' | 'en';
const productName = getProductName(product, locale);
<h3>{productName}</h3>
```

### 🌐 Step 20-21: Language Switcher

1. สร้าง `components/LanguageSwitcher.tsx`
2. เพิ่มใน `SideNav.tsx`

### 🧪 Step 23: Testing

ทดสอบ:
- `/th` → ภาษาไทย
- `/en` → ภาษาอังกฤษ
- Language switcher ทำงาน
- `/admin` ไม่มี locale

### 📊 Step 24: Firestore Migration

รัน script เพื่อเพิ่ม `name_th`, `name_en` ฯลฯ ให้กับข้อมูลเก่า
(ดู migration script ใน i18n-implementation-guide.md)

---

## 🎯 Key Files Reference

```
project/
├── i18n.ts                          # i18n config
├── middleware.ts                    # locale routing
├── messages/
│   ├── th.json                      # Thai translations
│   └── en.json                      # English translations
├── utils/
│   └── localization.ts              # Helper functions
├── types/
│   └── index.ts                     # Updated types
├── app/
│   ├── [locale]/                    # Customer pages (with i18n)
│   │   ├── layout.tsx              # Locale layout
│   │   ├── page.tsx                # Homepage
│   │   ├── products/               # Products
│   │   ├── cart/                   # Cart
│   │   └── ...
│   └── admin/                       # Admin (no i18n)
└── components/
    ├── LanguageSwitcher.tsx         # Language switcher
    └── ...
```

---

## 💡 Quick Tips

1. **Navigation paths:** ต้องเปลี่ยนจาก `'/'` → `'/${locale}'`
2. **useTranslations():** สำหรับ static text
3. **useLocale():** สำหรับ dynamic content (products, categories)
4. **Helper functions:** ใช้เพื่อ get localized fields จาก Product/Category
5. **Admin panel:** ไม่ต้องแก้อะไร (exclude จาก middleware แล้ว)

---

## 🚀 เริ่มทำต่อจากไหน?

**เริ่มที่ Step 5:** สร้าง folder `app/[locale]` และย้ายไฟล์

ดูรายละเอียดเต็มใน: `.docs/i18n-implementation-guide.md`
