'use client';

import { useRouter, useParams } from 'next/navigation';
import { useOrder } from '@/context/OrderContext';
import { ArrowLeft, Package, MapPin, CreditCard, Truck, Clock, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  processing: {
    label: 'Processing',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  shipped: {
    label: 'Shipped',
    icon: Truck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getOrderById, loading } = useOrder();

  const order = getOrderById(params.id as string);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <Package size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h2>
        <p className="text-gray-500 mb-6 text-center">
          We couldn&apos;t find the order you&apos;re looking for
        </p>
        <button
          onClick={() => router.push('/account/orders')}
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  // Order timeline
  const getOrderTimeline = () => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(order.status);

    if (order.status === 'cancelled') {
      return [
        { status: 'pending', label: 'Order Placed', active: true, completed: true },
        { status: 'cancelled', label: 'Cancelled', active: true, completed: true },
      ];
    }

    return statuses.map((s, index) => ({
      status: s,
      label: statusConfig[s as keyof typeof statusConfig].label,
      active: index <= currentIndex,
      completed: index < currentIndex,
    }));
  };

  const timeline = getOrderTimeline();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
            <p className="text-sm text-gray-500">{order.orderNumber}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Order Status */}
        <div className="bg-white rounded-2xl p-6">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${status.bgColor} border ${status.borderColor} mb-6`}>
            <StatusIcon size={24} className={status.color} />
            <div className="flex-1">
              <h3 className={`font-bold ${status.color}`}>{status.label}</h3>
              <p className="text-sm text-gray-600">
                {order.status === 'delivered' && 'Your order has been delivered'}
                {order.status === 'shipped' && 'Your order is on the way'}
                {order.status === 'processing' && 'We are preparing your order'}
                {order.status === 'pending' && 'Your order is being confirmed'}
                {order.status === 'cancelled' && 'Your order has been cancelled'}
              </p>
            </div>
          </div>

          {/* Timeline */}
          {order.status !== 'cancelled' && (
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={item.status} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.active
                          ? 'bg-black'
                          : 'bg-gray-200'
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle size={16} className="text-white" />
                      ) : (
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.active ? 'bg-white' : 'bg-gray-400'
                          }`}
                        />
                      )}
                    </div>
                    {index < timeline.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          item.completed ? 'bg-black' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <h4
                      className={`font-semibold ${
                        item.active ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {item.label}
                    </h4>
                    {item.status === 'pending' && item.active && (
                      <p className="text-sm text-gray-500 mt-1">
                        {order.createdAt instanceof Date
                          ? order.createdAt.toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })
                          : (order.createdAt as any).toDate
                          ? (order.createdAt as any).toDate().toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })
                          : new Date(order.createdAt as any).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                      </p>
                    )}
                    {item.status === 'delivered' && order.status === 'delivered' && (
                      <p className="text-sm text-gray-500 mt-1">
                        Estimated delivery
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Estimated Delivery */}
          {order.estimatedDeliveryDate && order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="font-semibold text-gray-900 mt-1">
                {order.estimatedDeliveryDate instanceof Date
                  ? order.estimatedDeliveryDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })
                  : (order.estimatedDeliveryDate as any).toDate
                  ? (order.estimatedDeliveryDate as any).toDate().toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })
                  : new Date(order.estimatedDeliveryDate as any).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
              </p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package size={20} />
            Order Items ({order.items.length})
          </h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex items-center gap-3">
                <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {item.productName}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    {item.size} • {item.color}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${(item.salePrice || item.price).toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900">
                    ${item.subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={20} />
            Shipping Address
          </h2>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold text-gray-900 mb-2">
              {order.shippingAddress.fullName}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {order.shippingAddress.phoneNumber}
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard size={20} />
            Payment Method
          </h2>
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
              {order.paymentMethod.cardBrand.toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {order.paymentMethod.cardBrand.charAt(0).toUpperCase() + order.paymentMethod.cardBrand.slice(1)} ending in {order.paymentMethod.last4}
              </p>
              <p className="text-sm text-gray-500">
                {order.paymentStatus === 'paid' ? 'Payment completed' : 'Payment ' + order.paymentStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold text-gray-900">
                {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-semibold text-green-600">-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {order.status === 'delivered' && (
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Buy Again
            </button>
            <button
              onClick={() => alert('Review functionality will be implemented')}
              className="w-full bg-gray-100 text-gray-700 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              Write a Review
            </button>
          </div>
        )}

        {order.status === 'shipped' && (
          <button
            onClick={() => alert('Track order functionality will be implemented')}
            className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Track Order
          </button>
        )}
      </div>
    </div>
  );
}
