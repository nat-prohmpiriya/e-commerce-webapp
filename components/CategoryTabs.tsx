'use client';

import { useState } from 'react';
import categories from '@/data/category';
import { LayoutGrid, Shirt } from 'lucide-react';

interface CategoryTabsProps {
  onCategoryChange?: (categoryId: string) => void;
}

export default function CategoryTabs({ onCategoryChange }: CategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'all':
        return <LayoutGrid size={18} />;
      case 't-shirt':
        return <Shirt size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="px-4 py-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all
                ${isActive
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {getCategoryIcon(category.id)}
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
