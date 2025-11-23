'use client';

import { useState, useMemo } from 'react';
import { useCategory } from '@/context/CategoryContext';
import { LayoutGrid, Shirt, Package, Wind, Zap } from 'lucide-react';

interface CategoryTabsProps {
  onCategoryChange?: (categorySlug: string) => void;
}

export default function CategoryTabs({ onCategoryChange }: CategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const { activeCategories, loading } = useCategory();

  const handleCategoryClick = (categorySlug: string) => {
    setActiveCategory(categorySlug);
    onCategoryChange?.(categorySlug);
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('t-shirt') || name.includes('tops')) return <Shirt size={18} />;
    if (name.includes('hoodie') || name.includes('sweater')) return <Wind size={18} />;
    if (name.includes('jacket') || name.includes('outerwear')) return <Package size={18} />;
    if (name.includes('accessories')) return <Zap size={18} />;
    return <Package size={18} />;
  };

  // Prepare categories with "All" as first item
  const displayCategories = useMemo(() => {
    return [
      { id: 'all', name: 'All', slug: 'all' },
      ...activeCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      }))
    ];
  }, [activeCategories]);

  if (loading) {
    return (
      <div className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {displayCategories.map((category) => {
          const isActive = activeCategory === category.slug;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all
                ${isActive
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {category.slug === 'all' ? (
                <LayoutGrid size={18} />
              ) : (
                getCategoryIcon(category.name)
              )}
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
