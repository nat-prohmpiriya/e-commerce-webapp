# Firestore Migration Guide - เพิ่ม Multi-language Fields

คู่มือนี้จะแนะนำวิธีการอัพเดทข้อมูล Products และ Categories ใน Firestore ให้รองรับหลายภาษา

## สิ่งที่ต้องทำ

เพิ่ม fields ใหม่ให้กับทุก document:

### Products Collection
- `name_th` (string) - ชื่อสินค้าภาษาไทย
- `name_en` (string) - ชื่อสินค้าภาษาอังกฤษ
- `description_th` (string) - คำอธิบายภาษาไทย
- `description_en` (string) - คำอธิบายภาษาอังกฤษ
- `category_th` (string) - หมวดหมู่ภาษาไทย
- `category_en` (string) - หมวดหมู่ภาษาอังกฤษ

### Categories Collection
- `name_th` (string) - ชื่อหมวดหมู่ภาษาไทย
- `name_en` (string) - ชื่อหมวดหมู่ภาษาอังกฤษ
- `description_th` (string, optional) - คำอธิบายภาษาไทย
- `description_en` (string, optional) - คำอธิบายภาษาอังกฤษ

## วิธีที่ 1: ใช้ Firebase Console (Manual - สำหรับข้อมูลน้อย)

1. เปิด Firebase Console
2. ไปที่ Firestore Database
3. เลือก collection `products` หรือ `categories`
4. แก้ไขแต่ละ document:
   - เพิ่ม field `name_th` = ค่าจาก field `name` เดิม
   - เพิ่ม field `name_en` = แปลเป็นภาษาอังกฤษ
   - เพิ่ม field `description_th` = ค่าจาก field `description` เดิม
   - เพิ่ม field `description_en` = แปลเป็นภาษาอังกฤษ
   - เพิ่ม field `category_th` และ `category_en` (สำหรับ products)

## วิธีที่ 2: ใช้ Migration Script (Recommended - สำหรับข้อมูลเยอะ)

### สร้างไฟล์ `scripts/migrate-to-i18n.ts`

\`\`\`typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

// Firebase config (copy from your .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Category name translations
const categoryTranslations: Record<string, { th: string; en: string }> = {
  'All Items': { th: 'ทั้งหมด', en: 'All Items' },
  'Dress': { th: 'เดรส', en: 'Dress' },
  'T-Shirt': { th: 'เสื้อยืด', en: 'T-Shirt' },
  'Pants': { th: 'กางเกง', en: 'Pants' },
  'Accessories': { th: 'เครื่องประดับ', en: 'Accessories' },
};

async function migrateProducts() {
  console.log('🔄 Starting Products migration...');

  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);

  let count = 0;
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const productRef = doc(db, 'products', docSnap.id);

    // Check if already migrated
    if (data.name_th && data.name_en) {
      console.log(\`⏭️  Skipping \${docSnap.id} - already migrated\`);
      continue;
    }

    const categoryTrans = categoryTranslations[data.category] || {
      th: data.category,
      en: data.category
    };

    await updateDoc(productRef, {
      // Copy existing values to Thai fields
      name_th: data.name || 'ไม่มีชื่อ',
      description_th: data.description || '',
      category_th: categoryTrans.th,

      // Set English fields (you need to translate these manually later)
      name_en: data.name || 'Untitled', // TODO: Translate
      description_en: data.description || '', // TODO: Translate
      category_en: categoryTrans.en,
    });

    count++;
    console.log(\`✅ Migrated product: \${data.name} (\${docSnap.id})\`);
  }

  console.log(\`\n✨ Products migration complete! Migrated \${count} products.\n\`);
}

async function migrateCategories() {
  console.log('🔄 Starting Categories migration...');

  const categoriesRef = collection(db, 'categories');
  const snapshot = await getDocs(categoriesRef);

  let count = 0;
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const categoryRef = doc(db, 'categories', docSnap.id);

    // Check if already migrated
    if (data.name_th && data.name_en) {
      console.log(\`⏭️  Skipping \${docSnap.id} - already migrated\`);
      continue;
    }

    const trans = categoryTranslations[data.name] || {
      th: data.name,
      en: data.name
    };

    await updateDoc(categoryRef, {
      name_th: trans.th,
      name_en: trans.en,
      description_th: data.description || '',
      description_en: data.description || '', // TODO: Translate
    });

    count++;
    console.log(\`✅ Migrated category: \${data.name} (\${docSnap.id})\`);
  }

  console.log(\`\n✨ Categories migration complete! Migrated \${count} categories.\n\`);
}

async function main() {
  console.log('🚀 Starting Firestore i18n Migration...\n');

  try {
    await migrateProducts();
    await migrateCategories();

    console.log('🎉 All migrations completed successfully!');
    console.log('\n⚠️  Remember to manually translate English fields!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
\`\`\`

### วิธีรัน Script

1. **เพิ่ม dependencies**:
\`\`\`bash
npm install --save-dev tsx
\`\`\`

2. **เพิ่ม script ใน package.json**:
\`\`\`json
{
  "scripts": {
    "migrate:i18n": "tsx scripts/migrate-to-i18n.ts"
  }
}
\`\`\`

3. **รัน migration**:
\`\`\`bash
npm run migrate:i18n
\`\`\`

## วิธีที่ 3: ใช้ Admin Panel (Future Enhancement)

สร้างหน้า Admin สำหรับแก้ไขข้อมูลหลายภาษา:

1. สร้างหน้า `/admin/migrate-i18n`
2. แสดงรายการ products/categories ที่ยังไม่มี i18n fields
3. ให้ admin กรอกข้อมูลภาษาไทยและอังกฤษ
4. บันทึกลง Firestore

## ตัวอย่างข้อมูลหลังการ Migrate

### Product Document
\`\`\`json
{
  "id": "product-001",
  "name_th": "เสื้อยืดคอกลม",
  "name_en": "Round Neck T-Shirt",
  "description_th": "เสื้อยืดผ้าคอตตอน 100% สวมใส่สบาย",
  "description_en": "100% cotton t-shirt, comfortable to wear",
  "category_th": "เสื้อยืด",
  "category_en": "T-Shirt",
  "price": 299,
  "images": ["..."],
  "sizes": ["S", "M", "L"],

  // Deprecated - but kept for backward compatibility
  "name": "เสื้อยืดคอกลม",
  "description": "เสื้อยืดผ้าคอตตอน 100% สวมใส่สบาย",
  "category": "เสื้อยืด"
}
\`\`\`

### Category Document
\`\`\`json
{
  "id": "cat-001",
  "name_th": "เสื้อยืด",
  "name_en": "T-Shirt",
  "description_th": "เสื้อยืดหลากหลายสไตล์",
  "description_en": "Various styles of t-shirts",
  "slug": "t-shirt",
  "isActive": true,

  // Deprecated
  "name": "เสื้อยืด",
  "description": "เสื้อยืดหลากหลายสไตล์"
}
\`\`\`

## Checklist หลัง Migration

- [ ] ทุก product มี `name_th` และ `name_en`
- [ ] ทุก product มี `description_th` และ `description_en`
- [ ] ทุก product มี `category_th` และ `category_en`
- [ ] ทุก category มี `name_th` และ `name_en`
- [ ] ทุก category มี `description_th` และ `description_en`
- [ ] ทดสอบสลับภาษาบนเว็บไซต์
- [ ] ตรวจสอบว่าทุกหน้าแสดงภาษาถูกต้อง
- [ ] ตรวจสอบ error logs

## คำแนะนำเพิ่มเติม

1. **Backup ก่อน Migrate**: สำรอง Firestore database ก่อนทำการ migrate
2. **ทดสอบบน Development ก่อน**: ทดสอบ script บน dev database ก่อน production
3. **แปลอย่างถูกต้อง**: ใช้บริการแปลที่เชื่อถือได้หรือให้คนแปลเอง
4. **ตรวจสอบทีละน้อย**: หลัง migrate ตรวจสอบข้อมูลทีละหมวดหมู่

## หากเกิดปัญหา

- **Fields ไม่ปรากฏ**: ตรวจสอบว่ารัน migration script สำเร็จหรือไม่
- **แสดงผลผิดพลาด**: เช็ค helper functions ใน `utils/localization.ts`
- **ภาษาไม่สลับ**: ตรวจสอบ LanguageSwitcher และ middleware
- **ข้อมูลหาย**: ฟื้นข้อมูลจาก backup

---

**สร้างเมื่อ**: 2025-11-24
**Version**: 1.0
