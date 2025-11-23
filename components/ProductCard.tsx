'use client';

import { Product } from '@/types';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  const displayPrice = product.salePrice || product.price;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] bg-gray-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorite
              ? 'bg-black text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Heart
            size={16}
            className={isFavorite ? 'fill-white' : ''}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{product.category}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900">${displayPrice}</span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400"></span>
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
