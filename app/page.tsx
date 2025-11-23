'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import ProductCard from '@/components/ProductCard';
import { useProduct } from '@/context/ProductContext';
import { useCategory } from '@/context/CategoryContext';
import { Package } from 'lucide-react';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { products, loading: productsLoading } = useProduct();
  const { categories } = useCategory();

  // Filter only published products
  const publishedProducts = useMemo(() => {
    return products.filter(product => product.isPublished);
  }, [products]);

  // Filter by selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return publishedProducts;
    }

    // Find category by slug
    const category = categories.find(cat => cat.slug === selectedCategory);
    if (!category) return [];

    // Filter products by category name (since product.category stores the name, not slug)
    return publishedProducts.filter(
      product => product.category.toLowerCase() === category.name.toLowerCase()
    );
  }, [publishedProducts, selectedCategory, categories]);

  const loading = productsLoading;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <Header />

      {/* Category Tabs */}
      <CategoryTabs onCategoryChange={setSelectedCategory} />

      {/* Product Grid */}
      <div className="px-4 pb-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
            <p className="text-gray-500">กำลังโหลดสินค้า...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Package size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">ไม่พบสินค้าในหมวดหมู่นี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
