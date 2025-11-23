'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import ProductCard from '@/components/ProductCard';
import products from '@/data/products';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category.toLowerCase().replace('-', ' ') === selectedCategory.toLowerCase().replace('-', ' '));

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <Header />

      {/* Category Tabs */}
      <CategoryTabs onCategoryChange={setSelectedCategory} />

      {/* Product Grid */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
