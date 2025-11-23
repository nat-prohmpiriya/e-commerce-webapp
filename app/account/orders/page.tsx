'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';

// Mock data - ในอนาคตจะดึงจาก Firestore
const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 299.99,
    items: [
      {
        id: '1',
        name: 'Classic White Sneakers',
        image: '/placeholder-product.svg',
        size: 'US 9',
        color: 'White',
        quantity: 1,
        price: 149.99,
      },
      {
        id: '2',
        name: 'Denim Jacket',
        image: '/placeholder-product.svg',
        size: 'M',
        color: 'Blue',
        quantity: 1,
        price: 150.00,
      },
    ],
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-10',
    status: 'processing',
    total: 189.99,
    items: [
      {
        id: '3',
        name: 'Cotton T-Shirt',
        image: '/placeholder-product.svg',
        size: 'L',
        color: 'Black',
        quantity: 2,
        price: 89.99,
      },
    ],
  },
];

const statusConfig = {
  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  processing: {
    label: 'Processing',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
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
        {mockOrders.length === 0 ? (
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
          mockOrders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;

            return (
              <div key={order.id} className="bg-white rounded-2xl p-4">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString('en-US', {
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
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {/* Item Image */}
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {item.size} • {item.color} • Qty: {item.quantity}
                        </p>
                      </div>

                      {/* Item Price */}
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">
                          ${item.price.toFixed(2)}
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
                  <button className="flex-1 bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
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
