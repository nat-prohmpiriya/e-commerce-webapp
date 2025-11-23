import { Product, Category } from '@/types';

export type Locale = 'th' | 'en';

/**
 * Get localized product name based on current locale
 */
export function getProductName(product: Product, locale: Locale): string {
  // Try to get the localized name
  const localizedName = product[`name_${locale}`];
  if (localizedName) return localizedName;

  // Fallback to deprecated field
  if (product.name) return product.name;

  // Fallback to other language if current locale is not available
  const fallbackLocale = locale === 'th' ? 'en' : 'th';
  return product[`name_${fallbackLocale}`] || 'Untitled Product';
}

/**
 * Get localized product description based on current locale
 */
export function getProductDescription(product: Product, locale: Locale): string {
  // Try to get the localized description
  const localizedDescription = product[`description_${locale}`];
  if (localizedDescription) return localizedDescription;

  // Fallback to deprecated field
  if (product.description) return product.description;

  // Fallback to other language if current locale is not available
  const fallbackLocale = locale === 'th' ? 'en' : 'th';
  return product[`description_${fallbackLocale}`] || '';
}

/**
 * Get localized product category based on current locale
 */
export function getProductCategory(product: Product, locale: Locale): string {
  // Try to get the localized category
  const localizedCategory = product[`category_${locale}`];
  if (localizedCategory) return localizedCategory;

  // Fallback to deprecated field
  if (product.category) return product.category;

  // Fallback to other language if current locale is not available
  const fallbackLocale = locale === 'th' ? 'en' : 'th';
  return product[`category_${fallbackLocale}`] || 'Uncategorized';
}

/**
 * Get localized category name based on current locale
 */
export function getCategoryName(category: Category, locale: Locale): string {
  // Try to get the localized name
  const localizedName = category[`name_${locale}`];
  if (localizedName) return localizedName;

  // Fallback to deprecated field
  if (category.name) return category.name;

  // Fallback to other language if current locale is not available
  const fallbackLocale = locale === 'th' ? 'en' : 'th';
  return category[`name_${fallbackLocale}`] || 'Untitled Category';
}

/**
 * Get localized category description based on current locale
 */
export function getCategoryDescription(category: Category, locale: Locale): string | undefined {
  // Try to get the localized description
  const localizedDescription = category[`description_${locale}`];
  if (localizedDescription) return localizedDescription;

  // Fallback to deprecated field
  if (category.description) return category.description;

  // Fallback to other language if current locale is not available
  const fallbackLocale = locale === 'th' ? 'en' : 'th';
  return category[`description_${fallbackLocale}`];
}

/**
 * Get all localized product fields for easier access
 */
export function getLocalizedProduct(product: Product, locale: Locale) {
  return {
    ...product,
    name: getProductName(product, locale),
    description: getProductDescription(product, locale),
    category: getProductCategory(product, locale),
  };
}

/**
 * Get all localized category fields for easier access
 */
export function getLocalizedCategory(category: Category, locale: Locale) {
  return {
    ...category,
    name: getCategoryName(category, locale),
    description: getCategoryDescription(category, locale),
  };
}
