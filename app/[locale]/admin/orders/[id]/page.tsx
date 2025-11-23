'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useOrder } from '@/context/OrderContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { ArrowLeft, Package, MapPin, CreditCard, User, Calendar } from 'lucide-react';
import { OrderStatus } from '@/types';
import Image from 'next/image';
import toast from 'react-hot-toast';

const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
  { value: 'processing', label: 'Processing', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-blue-100 text-blue-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const { getAllOrders, updateOrderStatus } = useOrder();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Load order
  useEffect(() => {
    const loadOrder = async () => {
      if (isAdmin) {
        setLoading(true);
        const allOrders = await getAllOrders();
        const foundOrder = allOrders.find(o => o.id === params.id);
        setOrder(foundOrder || null);
        setLoading(false);
      }
    };

    loadOrder();
  }, [isAdmin, params.id, getAllOrders]);

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="text-gray-500">Loading order...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Order not found</p>
          <button
            onClick={() => router.push('/admin/orders')}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Back to Orders
          </button>
        </div>
      </AdminLayout>
    );
  }

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (newStatus === order.status) return;

    setUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      setOrder({ ...order, status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const currentStatus = statusOptions.find(s => s.value === order.status);

  return (
    <AdminLayout>
      <div className="max-w-5xl space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
              <p className="text-gray-600 mt-2">Order ID: {order.id}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg ${currentStatus?.color}`}>
              <span className="text-sm font-semibold">{currentStatus?.label}</span>
            </div>
          </div>
        </div>

        {/* Update Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Update Order Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusUpdate(status.value)}
                disabled={updating || status.value === order.status}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  status.value === order.status
                    ? `${status.color} ring-2 ring-black`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Timeline</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gray-400" />
              <div className="text-sm">
                <span className="font-medium text-gray-900">Created: </span>
                <span className="text-gray-600">
                  {order.createdAt instanceof Date
                    ? order.createdAt.toLocaleString()
                    : (order.createdAt as any).toDate
                    ? (order.createdAt as any).toDate().toLocaleString()
                    : new Date(order.createdAt as any).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gray-400" />
              <div className="text-sm">
                <span className="font-medium text-gray-900">Last Updated: </span>
                <span className="text-gray-600">
                  {order.updatedAt instanceof Date
                    ? order.updatedAt.toLocaleString()
                    : new Date(order.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
            {order.estimatedDeliveryDate && (
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-400" />
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Estimated Delivery: </span>
                  <span className="text-gray-600">
                    {order.estimatedDeliveryDate instanceof Date
                      ? order.estimatedDeliveryDate.toLocaleDateString()
                      : new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User size={20} />
            Customer Information
          </h2>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium text-gray-900">Name: </span>
              <span className="text-gray-600">{order.shippingAddress.fullName}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium text-gray-900">Phone: </span>
              <span className="text-gray-600">{order.shippingAddress.phoneNumber}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium text-gray-900">User ID: </span>
              <span className="text-gray-600">{order.userId}</span>
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package size={20} />
            Order Items ({order.items.length})
          </h2>
          <div className="space-y-4">
            {order.items.map((item: any, index: number) => (
              <div key={`${item.productId}-${index}`} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.size} • {item.color}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${(item.salePrice || item.price).toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900">${item.subtotal.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={20} />
            Shipping Address
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </p>
            <p className="text-sm text-gray-500 mt-2">{order.shippingAddress.phoneNumber}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard size={20} />
            Payment Information
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                {order.paymentMethod.cardBrand.toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-900">
                **** **** **** {order.paymentMethod.last4}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Payment Status: <span className="font-semibold">{order.paymentStatus}</span>
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
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
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="font-bold text-2xl text-gray-900">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
