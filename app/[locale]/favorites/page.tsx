'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import products from '@/data/products';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

export default function FavoritesPage() {
  const t = useTranslations('Favorites');
  const tCart = useTranslations('Cart');
  const tProduct = useTranslations('Product');
  const router = useRouter();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Get full product details for wishlisted items
  const wishlistProducts = wishlist
    .map(productId => products.find(p => p.id === productId))
    .filter(Boolean);

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast.success(t('removedFromFavorites'));
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      productId: product.id,
      productName: product.name || product.name_en || product.name_th || 'Product',
      productImage: product.images[0],
      quantity: 1,
      size: product.sizes[0], // Default to first size
      color: product.colors[0].name, // Default to first color
      price: product.price,
      salePrice: product.salePrice
    });
    toast.success(t('addedToCart'));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        {wishlistProducts.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? tCart('item') : tCart('items')}
          </p>
        )}
      </div>

      {/* Favorites Grid */}
      <div className="px-4 py-6">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t('empty')}
            </h2>
            <p className="text-gray-500 mb-6">
              {t('emptyDescription')}
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              {t('startShopping')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {wishlistProducts.map((product) => {
              if (!product) return null;
              const displayPrice = product.salePrice || product.price;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden relative group"
                >
                  {/* Product Image */}
                  <div
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="relative aspect-[3/4] bg-gray-100 cursor-pointer"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name || product.name_en || product.name_th || 'Product'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(product.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <Heart size={16} className="fill-white" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3
                      onClick={() => router.push(`/products/${product.id}`)}
                      className="font-semibold text-gray-900 mb-1 line-clamp-1 cursor-pointer"
                    >
                      {product.name || product.name_en || product.name_th || 'Product'}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {product.category || product.category_en || product.category_th || ''}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-900">${displayPrice.toFixed(2)}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-black text-white py-2 rounded-full flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      <ShoppingCart size={16} />
                      {tProduct('addToCart')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
