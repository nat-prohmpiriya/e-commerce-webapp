'use client';

import { CartItem } from '@/types';
import Image from 'next/image';
import { Minus, Plus, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface CartItemCardProps {
  item: CartItem;
  isSelected: boolean;
  onToggleSelect: () => void;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartItemCard({
  item,
  isSelected,
  onToggleSelect,
  onUpdateQuantity,
  onRemove
}: CartItemCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const displayPrice = item.salePrice || item.price;

  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1) {
      onUpdateQuantity(newQuantity);
    }
  };

  return (
    <div className="flex items-start gap-3 bg-white p-4 rounded-2xl relative">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggleSelect}
        className="w-5 h-5 mt-2 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
      />

      {/* Product Image */}
      <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={item.productImage}
          alt={item.productName}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {item.productName}
            </h3>
            <p className="text-xs text-gray-500">
              {item.size} • {item.color}
            </p>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical size={18} className="text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg py-2 z-10 min-w-[120px] border border-gray-100">
                <button
                  onClick={() => {
                    onRemove();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-gray-900">
            ${displayPrice.toFixed(2)}
          </span>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={item.quantity <= 1}
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-semibold w-6 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
