'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useDiscount } from '@/context/DiscountContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Tag, Edit2, Trash2, ToggleLeft, ToggleRight, Calendar, TrendingUp, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDiscountsPage() {
  const router = useRouter();
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const { discounts, loading: discountsLoading, deleteDiscount, updateDiscount } = useDiscount();
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete discount code "${code}"?`)) {
      return;
    }

    try {
      await deleteDiscount(id);
      toast.success('Discount code deleted successfully');
    } catch (error) {
      console.error('Error deleting discount:', error);
      toast.error('Failed to delete discount code');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateDiscount(id, { isActive: !currentStatus });
      toast.success(`Discount ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating discount:', error);
      toast.error('Failed to update discount status');
    }
  };

  // Filter discounts
  const now = new Date();
  const filteredDiscounts = discounts.filter((discount) => {
    const validUntil = discount.validUntil.toDate();
    const isExpired = now > validUntil;

    if (filter === 'active') {
      return discount.isActive && !isExpired;
    } else if (filter === 'expired') {
      return isExpired;
    }
    return true;
  });

  // Stats
  const totalDiscounts = discounts.length;
  const activeDiscounts = discounts.filter((d) => {
    const validUntil = d.validUntil.toDate();
    return d.isActive && now <= validUntil;
  }).length;
  const totalUsage = discounts.reduce((sum, d) => sum + d.usageCount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discount Codes</h1>
            <p className="text-gray-600 mt-2">Manage promotional discount codes</p>
          </div>
          <button
            onClick={() => router.push('/admin/discounts/new')}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={20} />
            Add Discount Code
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Tag size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Codes</p>
                <p className="text-2xl font-bold text-gray-900">{totalDiscounts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeDiscounts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('expired')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'expired'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Expired
            </button>
          </div>
        </div>

        {/* Discounts Table */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            {discountsLoading ? (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading discounts...</div>
              </div>
            ) : filteredDiscounts.length === 0 ? (
              <div className="text-center py-12">
                <Tag size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No discount codes yet</p>
                <button
                  onClick={() => router.push('/admin/discounts/new')}
                  className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Create Your First Discount Code
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valid Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDiscounts.map((discount) => {
                    const isExpired = now > discount.validUntil.toDate();
                    const isLimitReached = discount.usageLimit && discount.usageCount >= discount.usageLimit;

                    return (
                      <tr key={discount.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Tag size={16} className="text-gray-400" />
                            <span className="text-sm font-bold text-gray-900">{discount.code}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {discount.type === 'percentage'
                                ? `${discount.value}%`
                                : `$${discount.value.toFixed(2)}`}
                            </p>
                            {discount.minPurchaseAmount && (
                              <p className="text-xs text-gray-500">
                                Min: ${discount.minPurchaseAmount.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            <p>{discount.validFrom.toDate().toLocaleDateString()}</p>
                            <p>to {discount.validUntil.toDate().toLocaleDateString()}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {discount.usageCount}
                            {discount.usageLimit ? ` / ${discount.usageLimit}` : ' / ∞'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              isExpired
                                ? 'bg-gray-100 text-gray-800'
                                : isLimitReached
                                ? 'bg-orange-100 text-orange-800'
                                : discount.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {isExpired
                              ? 'Expired'
                              : isLimitReached
                              ? 'Limit Reached'
                              : discount.isActive
                              ? 'Active'
                              : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleActive(discount.id, discount.isActive)}
                              className={`p-2 rounded-lg transition-colors ${
                                discount.isActive
                                  ? 'text-green-600 hover:bg-green-50'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                              title={discount.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {discount.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                            </button>
                            <button
                              onClick={() => router.push(`/admin/discounts/${discount.id}/edit`)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(discount.id, discount.code)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
