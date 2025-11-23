'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartItemCard from '@/components/CartItemCard';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Create unique key for cart item
  const getItemKey = (item: typeof cart[0]) => {
    return `${item.productId}-${item.size}-${item.color}`;
  };

  // Select all items by default when cart loads
  useEffect(() => {
    if (cart.length > 0 && selectedItems.size === 0) {
      const allKeys = new Set(cart.map(item => getItemKey(item)));
      setSelectedItems(allKeys);
    }
  }, [cart]);

  const handleToggleSelect = (itemKey: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      const allKeys = new Set(cart.map(item => getItemKey(item)));
      setSelectedItems(allKeys);
    }
  };

  const handleUpdateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    updateQuantity(productId, size, color, quantity);
  };

  const handleRemove = (productId: string, size: string, color: string) => {
    const itemKey = `${productId}-${size}-${color}`;
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemKey);
      return newSet;
    });
    removeFromCart(productId, size, color);
  };

  // Calculate totals for selected items only
  const selectedCartItems = cart.filter(item => selectedItems.has(getItemKey(item)));

  const subtotal = selectedCartItems.reduce((total, item) => {
    const price = item.salePrice || item.price;
    return total + (price * item.quantity);
  }, 0);

  const selectedCount = selectedItems.size;

  const handleCheckout = () => {
    if (selectedCount === 0) {
      alert('Please select at least one item to checkout');
      return;
    }
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Select All */}
        {cart.length > 0 && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedItems.size === cart.length && cart.length > 0}
              onChange={handleSelectAll}
              className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">
              Select All ({cart.length} items)
            </span>
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="px-4 py-4">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push('/')}
              className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => {
              const itemKey = getItemKey(item);
              return (
                <CartItemCard
                  key={itemKey}
                  item={item}
                  isSelected={selectedItems.has(itemKey)}
                  onToggleSelect={() => handleToggleSelect(itemKey)}
                  onUpdateQuantity={(quantity) =>
                    handleUpdateQuantity(item.productId, item.size, item.color, quantity)
                  }
                  onRemove={() => handleRemove(item.productId, item.size, item.color)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 w-[432px] mx-auto bg-white border-t border-gray-200 px-4 py-4 shadow-lg z-20">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Selected ({selectedCount} {selectedCount === 1 ? 'item' : 'items'})
              </span>
              <span className="text-sm text-gray-600">Subtotal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {selectedCartItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
              <span className="text-2xl font-bold text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={selectedCount === 0}
            className="w-full bg-black text-white py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
