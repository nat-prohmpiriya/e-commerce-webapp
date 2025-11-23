'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueChange: number;
  ordersChange: number;
}

export default function AdminDashboard() {
  const { loading, isAdmin } = useAdminAuth();
  const { orders } = useOrder();
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenueChange: 0,
    ordersChange: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total orders and revenue
        const ordersRef = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersRef);

        let totalRevenue = 0;
        ordersSnapshot.forEach((doc) => {
          const order = doc.data();
          if (order.status !== 'cancelled') {
            totalRevenue += order.total || 0;
          }
        });

        // Get total products
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);

        // Get total users
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);

        // Calculate changes (mock for now)
        const revenueChange = 12.5; // Mock percentage
        const ordersChange = 8.3; // Mock percentage

        setStats({
          totalRevenue,
          totalOrders: ordersSnapshot.size,
          totalProducts: productsSnapshot.size,
          totalUsers: usersSnapshot.size,
          revenueChange,
          ordersChange,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      change: stats.revenueChange,
      icon: DollarSign,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders.toString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      name: 'Total Products',
      value: stats.totalProducts.toString(),
      change: null,
      icon: Package,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      name: 'Total Users',
      value: stats.totalUsers.toString(),
      change: null,
      icon: Users,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  // Get recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : (a.createdAt as any).toDate ? (a.createdAt as any).toDate() : new Date(a.createdAt as any);
      const dateB = b.createdAt instanceof Date ? b.createdAt : (b.createdAt as any).toDate ? (b.createdAt as any).toDate() : new Date(b.createdAt as any);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Grid */}
        {loadingStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-4" />
                <div className="h-8 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              const isPositive = stat.change !== null && stat.change > 0;
              const isNegative = stat.change !== null && stat.change < 0;

              return (
                <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                      <Icon className={stat.iconColor} size={24} />
                    </div>
                    {stat.change !== null && (
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {isPositive ? <TrendingUp size={16} /> : isNegative ? <TrendingDown size={16} /> : null}
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{order.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{order.shippingAddress.fullName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt instanceof Date
                          ? order.createdAt.toLocaleDateString()
                          : (order.createdAt as any).toDate
                          ? (order.createdAt as any).toDate().toLocaleDateString()
                          : new Date(order.createdAt as any).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
