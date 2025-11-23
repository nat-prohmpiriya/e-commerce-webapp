'use client';

import { useRouter } from 'next/navigation';
import { useOrder } from '@/context/OrderContext';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import Image from 'next/image';

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
  processing: {
    label: 'Processing',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  shipped: {
    label: 'Shipped',
    icon: Truck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const { orders, loading } = useOrder();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 py-6 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start shopping to see your orders here
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;

            return (
              <div key={order.id} className="bg-white rounded-2xl p-4">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">
                      {order.createdAt instanceof Date
                        ? order.createdAt.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : (order.createdAt as any).toDate
                        ? (order.createdAt as any).toDate().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : new Date(order.createdAt as any).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor}`}>
                    <StatusIcon size={16} className={status.color} />
                    <span className={`text-sm font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div key={`${item.productId}-${index}`} className="flex items-center gap-3">
                      {/* Item Image */}
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {item.size} • {item.color} • Qty: {item.quantity}
                        </p>
                      </div>

                      {/* Item Price */}
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => router.push(`/account/orders/${order.id}`)}
                    className="flex-1 bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    View Details
                  </button>
                  {order.status === 'delivered' && (
                    <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                      Buy Again
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
