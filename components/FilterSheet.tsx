'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCategory } from '@/context/CategoryContext';
import { useTranslations, useLocale } from 'next-intl';
import { getCategoryName, type Locale } from '@/utils/localization';

export interface FilterOptions {
  priceRange: [number, number];
  selectedCategories: string[];
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';
  inStock: boolean;
}

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
}

export default function FilterSheet({ isOpen, onClose, onApply, initialFilters }: FilterSheetProps) {
  const { activeCategories } = useCategory();
  const locale = useLocale() as Locale;
  const t = useTranslations('Filter');
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when sheet is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      priceRange: [0, 10000],
      selectedCategories: [],
      sortBy: 'newest',
      inStock: false,
    };
    setFilters(resetFilters);
  };

  const toggleCategory = (categoryName: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryName)
        ? prev.selectedCategories.filter(c => c !== categoryName)
        : [...prev.selectedCategories, categoryName]
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Mobile: Bottom Sheet | Desktop: Centered Modal */}
      <div className="fixed inset-x-0 bottom-0 md:inset-0 z-50 md:flex md:items-center md:justify-center">
        <div className="bg-white md:rounded-2xl rounded-t-3xl shadow-2xl animate-slide-up md:animate-fade-in max-h-[85vh] md:max-h-[90vh] md:max-w-2xl md:w-full md:mx-4 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">{t('title')}</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sort By */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('sortBy')}</h3>
            <div className="space-y-2">
              {[
                { value: 'newest', label: t('newest') },
                { value: 'price-asc', label: t('priceAsc') },
                { value: 'price-desc', label: t('priceDesc') },
                { value: 'name-asc', label: t('nameAsc') },
                { value: 'name-desc', label: t('nameDesc') },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilters({ ...filters, sortBy: option.value as any })}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${filters.sortBy === option.value
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('priceRange')}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]
                  })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Min"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: [filters.priceRange[0], parseInt(e.target.value) || 10000]
                  })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Max"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('categories')}</h3>
            <div className="flex flex-wrap gap-2">
              {activeCategories.map((category) => {
                const categoryName = getCategoryName(category, locale);
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.selectedCategories.includes(category.slug)
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {categoryName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">{t('inStockOnly')}</span>
                <p className="text-xs text-gray-500">{t('showOnlyAvailable')}</p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-white pb-22">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('reset')}
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              {t('applyFilters')}
            </button>
          </div>
        </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
