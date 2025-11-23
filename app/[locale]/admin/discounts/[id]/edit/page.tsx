'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useDiscount } from '@/context/DiscountContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { ArrowLeft } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function EditDiscountPage() {
  const router = useRouter();
  const params = useParams();
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const { getDiscountById, updateDiscount } = useDiscount();

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    validFrom: '',
    validUntil: '',
    usageLimit: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (params.id && isAdmin) {
      loadDiscountData();
    }
  }, [params.id, isAdmin]);

  const loadDiscountData = async () => {
    try {
      setLoading(true);
      const discount = getDiscountById(params.id as string);

      if (!discount) {
        setNotFound(true);
        toast.error('Discount code not found');
        return;
      }

      // Convert Timestamps to datetime-local format
      const validFromDate = discount.validFrom.toDate();
      const validUntilDate = discount.validUntil.toDate();

      // Format: YYYY-MM-DDTHH:mm
      const formatDateTimeLocal = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setFormData({
        code: discount.code,
        type: discount.type,
        value: discount.value.toString(),
        minPurchaseAmount: discount.minPurchaseAmount ? discount.minPurchaseAmount.toString() : '',
        maxDiscountAmount: discount.maxDiscountAmount ? discount.maxDiscountAmount.toString() : '',
        validFrom: formatDateTimeLocal(validFromDate),
        validUntil: formatDateTimeLocal(validUntilDate),
        usageLimit: discount.usageLimit ? discount.usageLimit.toString() : '',
        isActive: discount.isActive,
      });
    } catch (error) {
      console.error('Error loading discount:', error);
      toast.error('Failed to load discount data');
      setNotFound(true);
    } finally {
      setLoading(false);
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
          <div className="text-gray-500">Loading discount data...</div>
        </div>
      </AdminLayout>
    );
  }

  if (notFound) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Discount code not found</p>
          <button
            onClick={() => router.push('/admin/discounts')}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Back to Discounts
          </button>
        </div>
      </AdminLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.value || !formData.validFrom || !formData.validUntil) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      await updateDiscount(params.id as string, {
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: parseFloat(formData.value),
        minPurchaseAmount: formData.minPurchaseAmount ? parseFloat(formData.minPurchaseAmount) : undefined,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
        validFrom: Timestamp.fromDate(new Date(formData.validFrom)),
        validUntil: Timestamp.fromDate(new Date(formData.validUntil)),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        isActive: formData.isActive,
      });

      toast.success('Discount code updated successfully!');
      router.push('/admin/discounts');
    } catch (error) {
      console.error('Error updating discount:', error);
      toast.error('Failed to update discount code');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Discounts
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Discount Code</h1>
          <p className="text-gray-600 mt-2">Update promotional discount code</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Code & Type */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black uppercase"
                placeholder="SUMMER2024"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Letters and numbers only (no spaces)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                {formData.type === 'fixed' && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                )}
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    formData.type === 'fixed' ? 'pl-8' : ''
                  }`}
                  placeholder={formData.type === 'percentage' ? '10' : '15.00'}
                  required
                />
                {formData.type === 'percentage' && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.type === 'percentage' ? 'Enter percentage (0-100)' : 'Enter fixed dollar amount'}
              </p>
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Conditions</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Purchase Amount (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.minPurchaseAmount}
                  onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="50.00"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Leave empty for no minimum</p>
            </div>

            {formData.type === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Discount Amount (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="100.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Cap the maximum discount amount</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usage Limit (Optional)
              </label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="100"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited usage</p>
            </div>
          </div>

          {/* Valid Period */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Valid Period</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid From <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Active</span>
                <p className="text-xs text-gray-500">Make this discount code available for use</p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating...' : 'Update Discount Code'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
