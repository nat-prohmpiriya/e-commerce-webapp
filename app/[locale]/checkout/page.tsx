'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronDown, Menu, MapPin, Plus, Tag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAddress } from '@/context/AddressContext';
import { useOrder } from '@/context/OrderContext';
import { useDiscount } from '@/context/DiscountContext';
import { OrderItem, DiscountCode } from '@/types';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import dynamic from 'next/dynamic';

const StripePaymentForm = dynamic(() => import('@/components/checkout/StripePaymentForm'), {
  ssr: false,
});

export default function CheckoutPage() {
  const t = useTranslations('Checkout');
  const tCart = useTranslations('Cart');
  const router = useRouter();
  const { cart, getCartTotal, getCartItemCount, clearCart } = useCart();
  const { addresses, getSelectedAddress } = useAddress();
  const { createOrder } = useOrder();
  const { validateDiscount } = useDiscount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const selectedAddress = getSelectedAddress();
  const subtotal = getCartTotal();
  const shippingFee = 0.00;

  // Calculate discount amount
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === 'percentage') {
      discountAmount = (subtotal * appliedDiscount.value) / 100;
      if (appliedDiscount.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, appliedDiscount.maxDiscountAmount);
      }
    } else {
      discountAmount = appliedDiscount.value;
    }
  }

  const total = subtotal + shippingFee - discountAmount;
  const totalItems = getCartItemCount();

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Please enter a discount code');
      return;
    }

    setIsApplyingDiscount(true);
    try {
      const result = await validateDiscount(discountCode.trim(), subtotal);

      if (result.valid && result.discount) {
        setAppliedDiscount(result.discount);
        toast.success(`Discount code "${discountCode}" applied successfully!`);
        setDiscountCode('');
      } else {
        toast.error(result.error || 'Invalid discount code');
      }
    } catch (error) {
      toast.error('Failed to apply discount code');
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    toast.success('Discount code removed');
  };

  const handlePaymentClick = () => {
    if (!selectedAddress) {
      toast.error(t('selectAddress'));
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedAddress) {
      toast.error(t('selectAddress'));
      return;
    }

    setIsProcessing(true);

    try {
      // Convert cart items to order items
      const orderItems: OrderItem[] = cart.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
        salePrice: item.salePrice,
        subtotal: (item.salePrice || item.price) * item.quantity,
      }));

      // Create order
      const order = await createOrder({
        items: orderItems,
        subtotal,
        shipping: shippingFee,
        discount: discountAmount,
        total,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          phoneNumber: selectedAddress.phoneNumber,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
        },
        paymentMethod: {
          type: 'card',
          cardBrand: 'stripe',
          last4: '****',
        },
        discountCode: appliedDiscount?.code,
      });

      // Clear cart
      clearCart();

      // Show success message
      toast.success(t('orderPlaced', { orderNumber: order.orderNumber }));

      // Redirect to order confirmation or orders page
      router.push('/account/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(t('orderFailed'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  const handleAddressClick = () => {
    if (addresses.length === 0) {
      router.push('/account/addresses/new');
    } else {
      router.push('/account/addresses');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500 mb-4">{t('noItems')}</p>
        <button
          onClick={() => router.push('/cart')}
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
        >
          {t('goToCart')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t('title')}</h1>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Order Summary */}
        <div className="space-y-3">
          {cart.map((item) => {
            const displayPrice = item.salePrice || item.price;
            return (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-start gap-3 bg-white p-4 rounded-2xl">
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
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {item.productName}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {item.size} • {item.color}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">
                      ${displayPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {t('quantity')}: {item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3">{t('shippingAddress')}</h2>
          {selectedAddress ? (
            <button
              onClick={handleAddressClick}
              className="w-full flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm mb-1">
                  {selectedAddress.fullName}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {selectedAddress.addressLine1}
                  {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                  <br />
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                  <br />
                  {selectedAddress.country}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedAddress.phoneNumber}
                </p>
              </div>
              <ChevronDown size={20} className="text-gray-400 flex-shrink-0 mt-1" />
            </button>
          ) : (
            <button
              onClick={handleAddressClick}
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <Plus size={20} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-600">{t('addShippingAddress')}</span>
            </button>
          )}
        </div>

        {/* Discount Code */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Discount Code</h2>
          {appliedDiscount ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">{appliedDiscount.code}</p>
                  <p className="text-xs text-green-700">
                    {appliedDiscount.type === 'percentage'
                      ? `${appliedDiscount.value}% off`
                      : `$${appliedDiscount.value.toFixed(2)} off`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveDiscount}
                className="p-1 hover:bg-green-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-green-700" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
              />
              <button
                onClick={handleApplyDiscount}
                disabled={isApplyingDiscount || !discountCode.trim()}
                className="px-6 py-2 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isApplyingDiscount ? 'Applying...' : 'Apply'}
              </button>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{tCart('total')} ({totalItems} {totalItems === 1 ? tCart('item') : tCart('items')})</span>
            <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t('shippingFee')}</span>
            <span className="font-semibold text-gray-900">${shippingFee.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600">Discount ({appliedDiscount?.code})</span>
              <span className="font-semibold text-green-600">-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">{t('subTotal')}</span>
              <span className="font-bold text-xl text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      {showPaymentForm ? (
        <div className="px-4 pb-32">
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">Payment</h2>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Back
              </button>
            </div>
            <StripePaymentForm
              amount={total}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 w-[432px] mx-auto bg-white border-t border-gray-200 px-4 py-4 shadow-lg z-20">
          <button
            onClick={handlePaymentClick}
            disabled={isProcessing}
            className="w-full bg-black text-white py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t('pay')} ${total.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}
