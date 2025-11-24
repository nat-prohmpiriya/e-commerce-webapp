'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronDown, Menu, MapPin, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAddress } from '@/context/AddressContext';
import { useOrder } from '@/context/OrderContext';
import { OrderItem } from '@/types';
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
  const { addresses, getSelectedAddress, selectAddress } = useAddress();
  const { createOrder } = useOrder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const selectedAddress = getSelectedAddress();
  const subtotal = getCartTotal();
  const shippingFee = 0.00;
  const discount = 0.00;
  const total = subtotal + shippingFee - discount;
  const totalItems = getCartItemCount();

  const handlePaymentClick = () => {
    if (!selectedAddress) {
      toast.error(t('selectAddress'));
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async () => {
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
        discount,
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
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t('discount')}</span>
            <span className="font-semibold text-gray-900">${discount.toFixed(2)}</span>
          </div>
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
