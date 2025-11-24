'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import ProductCard from '@/components/ProductCard';
import FilterSheet, { FilterOptions } from '@/components/FilterSheet';
import { useProduct } from '@/context/ProductContext';
import { useCategory } from '@/context/CategoryContext';
import { useLocale } from 'next-intl';
import { getProductName, getProductCategory, getCategoryName, type Locale } from '@/utils/localization';
import { Package } from 'lucide-react';

export default function HomePage() {
  const locale = useLocale() as Locale;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { products, loading: productsLoading } = useProduct();
  const { categories } = useCategory();

  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    selectedCategories: [],
    sortBy: 'newest',
    inStock: false,
  });

  // Filter only published products
  const publishedProducts = useMemo(() => {
    return products.filter(product => product.isPublished);
  }, [products]);

  // Filter by selected category (from tabs)
  const categoryFilteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return publishedProducts;
    }

    // Find category by slug
    const category = categories.find(cat => cat.slug === selectedCategory);
    if (!category) return [];

    // Filter products by category - match using localized category name
    const categoryNameInLocale = getCategoryName(category, locale);
    return publishedProducts.filter(
      product => getProductCategory(product, locale).toLowerCase() === categoryNameInLocale.toLowerCase()
    );
  }, [publishedProducts, selectedCategory, categories, locale]);

  // Apply all filters from FilterSheet
  const filteredProducts = useMemo(() => {
    let result = [...categoryFilteredProducts];

    // Filter by price range
    result = result.filter(
      product => {
        const price = product.salePrice || product.price;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      }
    );

    // Filter by categories (from FilterSheet using slugs)
    if (filters.selectedCategories.length > 0) {
      result = result.filter(product => {
        // Find the category that matches the product's category name
        const productCategoryName = getProductCategory(product, locale);
        const matchingCategory = categories.find(
          cat => getCategoryName(cat, locale).toLowerCase() === productCategoryName.toLowerCase()
        );
        return matchingCategory && filters.selectedCategories.includes(matchingCategory.slug);
      });
    }

    // Filter by stock
    if (filters.inStock) {
      result = result.filter(product => product.stock > 0);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name-asc':
        result.sort((a, b) => getProductName(a, locale).localeCompare(getProductName(b, locale)));
        break;
      case 'name-desc':
        result.sort((a, b) => getProductName(b, locale).localeCompare(getProductName(a, locale)));
        break;
      case 'newest':
        result.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
    }

    return result;
  }, [categoryFilteredProducts, filters, locale, categories]);

  const loading = productsLoading;

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <Header onFilterClick={() => setIsFilterOpen(true)} />

      {/* Category Tabs */}
      <CategoryTabs onCategoryChange={setSelectedCategory} />

      {/* Product Grid */}
      <div className="px-4 md:px-6 pb-6">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Filter Sheet */}
      <FilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />
    </div>
  );
}
