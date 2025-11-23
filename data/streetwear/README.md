# Streetwear Store - Seed Data

This folder contains seed data for a Streetwear/Urban Fashion e-commerce store.

## 📁 Files

### `categories.ts`
Contains 6 product categories:
- **All Items** - Browse all streetwear products
- **T-Shirts & Tops** - Essential tees and tops
- **Hoodies & Sweatshirts** - Cozy hoodies and sweatshirts
- **Pants & Bottoms** - Pants, joggers, and shorts
- **Outerwear** - Jackets, windbreakers, and bombers
- **Accessories** - Hats, bags, belts, and more

### `products.ts`
Contains 28 carefully curated streetwear products:

#### T-Shirts & Tops (4 products)
- Oversized Black Tee - ฿890
- Vintage Graphic Tee - ฿1,290 ~~฿990~~
- Minimalist Long Sleeve Tee - ฿1,190
- Striped Polo Shirt - ฿1,590

#### Hoodies & Sweatshirts (4 products)
- Classic Pullover Hoodie - ฿2,290 ~~฿1,890~~
- Vintage Washed Hoodie - ฿2,590
- Zip-Up Tech Hoodie - ฿2,890
- Crewneck Sweatshirt - ฿1,990 ~~฿1,590~~

#### Pants & Bottoms (5 products)
- Cargo Utility Pants - ฿2,190
- Straight Fit Jeans - ฿2,490 ~~฿1,990~~
- Tapered Joggers - ฿1,890
- Wide Leg Pants - ฿2,290
- Utility Shorts - ฿1,590 ~~฿1,290~~

#### Outerwear (5 products)
- Oversized Bomber Jacket - ฿3,490 ~~฿2,990~~
- Windbreaker Jacket - ฿2,790
- Denim Trucker Jacket - ฿2,990
- Puffer Vest - ฿2,390 ~~฿1,990~~
- Coach Jacket - ฿2,190

#### Accessories (10 products)
- Classic Snapback Cap - ฿790 ~~฿590~~
- Beanie Hat - ฿590
- Crossbody Bag - ฿1,290
- Canvas Backpack - ฿1,790 ~~฿1,490~~
- Leather Belt - ฿890
- Crew Socks Pack - ฿490 ~~฿390~~
- Bucket Hat - ฿690
- Canvas Tote Bag - ฿590
- Chain Necklace - ฿890 ~~฿690~~
- Waist Bag - ฿990

## 📊 Data Statistics

- **Total Products**: 28
- **Products on Sale**: 9 (32%)
- **Price Range**: ฿390 - ฿3,490
- **Average Price**: ~฿1,500
- **Total Stock**: 4,708 items
- **Average Rating**: 4.7 stars
- **Total Reviews**: 9,876

## 🎨 Product Features

All products include:
- ✅ Multiple sizes (S, M, L, XL, XXL or numeric for pants)
- ✅ Multiple color options with HEX codes
- ✅ High-quality Unsplash images (1-2 per product)
- ✅ Detailed descriptions
- ✅ Ratings and review counts
- ✅ Stock quantities
- ✅ Sale prices where applicable
- ✅ Published status
- ✅ Timestamps

## 🎯 Target Audience

This seed data is designed for:
- Urban fashion enthusiasts
- Streetwear community (ages 16-35)
- Mobile-first shoppers
- Style-conscious consumers

## 🖼️ Image Sources

All product images are from [Unsplash](https://unsplash.com) - free high-quality stock photos.
Images are referenced via URLs and load directly from Unsplash's CDN.

## 💡 Usage

### Import Categories
```typescript
import streetwearCategories from '@/data/streetwear/categories';
```

### Import Products
```typescript
import streetwearProducts from '@/data/streetwear/products';
```

### Seed to Firebase
You can create a seed script to populate Firestore:

```typescript
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import streetwearCategories from '@/data/streetwear/categories';
import streetwearProducts from '@/data/streetwear/products';

// Seed categories
async function seedCategories() {
  for (const category of streetwearCategories) {
    await setDoc(doc(db, 'categories', category.id), category);
  }
}

// Seed products
async function seedProducts() {
  for (const product of streetwearProducts) {
    await setDoc(doc(db, 'products', product.id), product);
  }
}

// Run seeds
await seedCategories();
await seedProducts();
```

## 📝 Customization

Feel free to modify:
- Product names and descriptions
- Prices and sale prices
- Colors and sizes
- Stock quantities
- Image URLs
- Ratings and reviews

## 🔄 Updates

To update product counts for each category, you can run a script that counts products per category and updates the `productCount` field.

---

**Created for**: E-commerce WebApp - Streetwear Store
**Last Updated**: 2025-11-23
**Version**: 1.0
