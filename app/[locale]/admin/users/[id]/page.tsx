'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from '@/i18n/routing';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { ArrowLeft, Mail, Phone, Calendar, Shield, User as UserIcon, Package, ShoppingCart } from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

interface UserDetail {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  role: 'user' | 'admin';
  createdAt: any;
  isActive: boolean;
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations('Admin');
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'orders'>('info');

  useEffect(() => {
    if (isAdmin && params.id) {
      fetchUserData();
      fetchUserOrders();
    }
  }, [isAdmin, params.id]);

  const fetchUserData = async () => {
    try {
      const userRef = doc(db, 'users', params.id as string);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser({
          id: userSnap.id,
          ...userSnap.data(),
        } as UserDetail);
      } else {
        toast.error(t('userNotFound'));
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error(t('fetchUserFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('userId', '==', params.id),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const ordersData: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({
          id: doc.id,
          ...doc.data(),
        } as Order);
      });

      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

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
          <div className="text-gray-500">Loading user data...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">User not found</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Back to Users
          </button>
        </div>
      </AdminLayout>
    );
  }

  // Calculate stats
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(o => o.status === 'delivered').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Users
          </button>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <UserIcon size={48} className="text-gray-400" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{user.displayName}</h2>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {user.role === 'admin' ? 'Admin' : 'Customer'}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <span className="text-sm">{user.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm">
                    Joined {user.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Package size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b">
            <div className="flex gap-4 px-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'info'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                User Information
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'orders'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Order History ({totalOrders})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'info' ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">User ID</p>
                      <p className="text-sm font-medium text-gray-900">{user.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Role</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{user.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Order #{order.orderNumber}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              ${order.total.toFixed(2)}
                            </p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'processing'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
