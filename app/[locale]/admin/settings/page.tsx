'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useStoreSettings, ShippingRate } from '@/context/StoreSettingsContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Store, Truck, DollarSign, Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function AdminSettingsPage() {
  const t = useTranslations('Admin');
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const { settings, loading, updateStoreInfo, updateShippingRates, updateTaxSettings } = useStoreSettings();
  const [activeTab, setActiveTab] = useState<'store' | 'shipping' | 'tax'>('store');

  // Store Info Form
  const [storeForm, setStoreForm] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    currency: '',
    timezone: '',
  });

  // Shipping Rates
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [editingShipping, setEditingShipping] = useState<ShippingRate | null>(null);
  const [shippingForm, setShippingForm] = useState({
    name: '',
    description: '',
    rate: '',
    rateType: 'flat' as 'flat' | 'percentage',
    minOrderAmount: '',
    estimatedDays: '',
    isActive: true,
  });

  // Tax Settings Form
  const [taxForm, setTaxForm] = useState({
    enabled: true,
    rate: '',
    includedInPrice: false,
    taxName: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (settings) {
      // Load store info
      setStoreForm({
        name: settings.storeInfo.name,
        description: settings.storeInfo.description,
        email: settings.storeInfo.email,
        phone: settings.storeInfo.phone,
        street: settings.storeInfo.address.street,
        city: settings.storeInfo.address.city,
        state: settings.storeInfo.address.state,
        zipCode: settings.storeInfo.address.zipCode,
        country: settings.storeInfo.address.country,
        currency: settings.storeInfo.currency,
        timezone: settings.storeInfo.timezone,
      });

      // Load shipping rates
      setShippingRates(settings.shippingRates);

      // Load tax settings
      setTaxForm({
        enabled: settings.tax.enabled,
        rate: settings.tax.rate.toString(),
        includedInPrice: settings.tax.includedInPrice,
        taxName: settings.tax.taxName,
      });
    }
  }, [settings]);

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="text-gray-500">{t('loadingSettings')}</div>
        </div>
      </AdminLayout>
    );
  }

  const handleSaveStoreInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await updateStoreInfo({
        name: storeForm.name,
        description: storeForm.description,
        email: storeForm.email,
        phone: storeForm.phone,
        address: {
          street: storeForm.street,
          city: storeForm.city,
          state: storeForm.state,
          zipCode: storeForm.zipCode,
          country: storeForm.country,
        },
        currency: storeForm.currency,
        timezone: storeForm.timezone,
      });

      toast.success(t('storeInfoUpdatedSuccess'));
    } catch (error) {
      console.error('Error updating store info:', error);
      toast.error(t('storeInfoUpdateFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveShipping = async () => {
    if (!shippingForm.name || !shippingForm.rate || !shippingForm.estimatedDays) {
      toast.error(t('fillRequiredFields'));
      return;
    }

    try {
      let updatedRates: ShippingRate[];

      if (editingShipping) {
        // Update existing
        updatedRates = shippingRates.map((rate) =>
          rate.id === editingShipping.id
            ? {
                ...rate,
                name: shippingForm.name,
                description: shippingForm.description,
                rate: parseFloat(shippingForm.rate),
                rateType: shippingForm.rateType,
                minOrderAmount: shippingForm.minOrderAmount ? parseFloat(shippingForm.minOrderAmount) : undefined,
                estimatedDays: shippingForm.estimatedDays,
                isActive: shippingForm.isActive,
              }
            : rate
        );
      } else {
        // Add new
        const newRate: ShippingRate = {
          id: Date.now().toString(),
          name: shippingForm.name,
          description: shippingForm.description,
          rate: parseFloat(shippingForm.rate),
          rateType: shippingForm.rateType,
          minOrderAmount: shippingForm.minOrderAmount ? parseFloat(shippingForm.minOrderAmount) : undefined,
          estimatedDays: shippingForm.estimatedDays,
          isActive: shippingForm.isActive,
        };
        updatedRates = [...shippingRates, newRate];
      }

      await updateShippingRates(updatedRates);
      setShippingRates(updatedRates);
      setShowShippingModal(false);
      setEditingShipping(null);
      resetShippingForm();
      toast.success(editingShipping ? t('shippingRateUpdated') : t('shippingRateAdded'));
    } catch (error) {
      console.error('Error saving shipping rate:', error);
      toast.error(t('shippingRateSaveFailed'));
    }
  };

  const handleDeleteShipping = async (id: string) => {
    if (!confirm(t('confirmDeleteShippingRate'))) return;

    try {
      const updatedRates = shippingRates.filter((rate) => rate.id !== id);
      await updateShippingRates(updatedRates);
      setShippingRates(updatedRates);
      toast.success(t('shippingRateDeleted'));
    } catch (error) {
      console.error('Error deleting shipping rate:', error);
      toast.error(t('shippingRateDeleteFailed'));
    }
  };

  const handleToggleShipping = async (id: string) => {
    try {
      const updatedRates = shippingRates.map((rate) =>
        rate.id === id ? { ...rate, isActive: !rate.isActive } : rate
      );
      await updateShippingRates(updatedRates);
      setShippingRates(updatedRates);
      toast.success(t('shippingRateUpdated'));
    } catch (error) {
      console.error('Error toggling shipping rate:', error);
      toast.error(t('shippingRateUpdateFailed'));
    }
  };

  const openShippingModal = (rate?: ShippingRate) => {
    if (rate) {
      setEditingShipping(rate);
      setShippingForm({
        name: rate.name,
        description: rate.description,
        rate: rate.rate.toString(),
        rateType: rate.rateType,
        minOrderAmount: rate.minOrderAmount ? rate.minOrderAmount.toString() : '',
        estimatedDays: rate.estimatedDays,
        isActive: rate.isActive,
      });
    } else {
      setEditingShipping(null);
      resetShippingForm();
    }
    setShowShippingModal(true);
  };

  const resetShippingForm = () => {
    setShippingForm({
      name: '',
      description: '',
      rate: '',
      rateType: 'flat',
      minOrderAmount: '',
      estimatedDays: '',
      isActive: true,
    });
  };

  const handleSaveTax = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await updateTaxSettings({
        enabled: taxForm.enabled,
        rate: parseFloat(taxForm.rate),
        includedInPrice: taxForm.includedInPrice,
        taxName: taxForm.taxName,
      });

      toast.success(t('taxSettingsUpdatedSuccess'));
    } catch (error) {
      console.error('Error updating tax settings:', error);
      toast.error(t('taxSettingsUpdateFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
          <p className="text-gray-600 mt-2">Manage your store configuration</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b">
            <div className="flex gap-4 px-6">
              <button
                onClick={() => setActiveTab('store')}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'store'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Store size={18} />
                Store Information
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Truck size={18} />
                Shipping Rates
              </button>
              <button
                onClick={() => setActiveTab('tax')}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'tax'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <DollarSign size={18} />
                Tax Settings
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Store Information Tab */}
            {activeTab === 'store' && (
              <form onSubmit={handleSaveStoreInfo} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={storeForm.name}
                      onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={storeForm.description}
                      onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={storeForm.email}
                        onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={storeForm.phone}
                        onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">Address</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={storeForm.street}
                      onChange={(e) => setStoreForm({ ...storeForm, street: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={storeForm.city}
                        onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={storeForm.state}
                        onChange={(e) => setStoreForm({ ...storeForm, state: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={storeForm.zipCode}
                        onChange={(e) => setStoreForm({ ...storeForm, zipCode: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={storeForm.country}
                      onChange={(e) => setStoreForm({ ...storeForm, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">Regional Settings</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={storeForm.currency}
                        onChange={(e) => setStoreForm({ ...storeForm, currency: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="THB">THB - Thai Baht</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={storeForm.timezone}
                        onChange={(e) => setStoreForm({ ...storeForm, timezone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="America/New_York">America/New York (EST)</option>
                        <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="Asia/Bangkok">Asia/Bangkok (ICT)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : 'Save Store Information'}
                  </button>
                </div>
              </form>
            )}

            {/* Shipping Rates Tab */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Shipping Rates</h2>
                  <button
                    onClick={() => openShippingModal()}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Plus size={18} />
                    Add Shipping Rate
                  </button>
                </div>

                {shippingRates.length === 0 ? (
                  <div className="text-center py-12">
                    <Truck size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No shipping rates configured</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {shippingRates.map((rate) => (
                      <div
                        key={rate.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{rate.name}</h3>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  rate.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {rate.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{rate.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-700">
                              <span className="font-semibold">
                                {rate.rateType === 'flat' ? '$' : ''}
                                {rate.rate.toFixed(2)}
                                {rate.rateType === 'percentage' ? '%' : ''}
                              </span>
                              <span>•</span>
                              <span>{rate.estimatedDays} days</span>
                              {rate.minOrderAmount && (
                                <>
                                  <span>•</span>
                                  <span>Min: ${rate.minOrderAmount.toFixed(2)}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleShipping(rate.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                rate.isActive
                                  ? 'text-green-600 hover:bg-green-50'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                              title={rate.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {rate.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                            </button>
                            <button
                              onClick={() => openShippingModal(rate)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteShipping(rate.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tax Settings Tab */}
            {activeTab === 'tax' && (
              <form onSubmit={handleSaveTax} className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Tax Configuration</h2>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={taxForm.enabled}
                      onChange={(e) => setTaxForm({ ...taxForm, enabled: e.target.checked })}
                      className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Enable Tax</span>
                      <p className="text-xs text-gray-500">Apply tax to all orders</p>
                    </div>
                  </label>
                </div>

                {taxForm.enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={taxForm.taxName}
                        onChange={(e) => setTaxForm({ ...taxForm, taxName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Sales Tax, VAT, GST, etc."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Rate (%) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={taxForm.rate}
                        onChange={(e) => setTaxForm({ ...taxForm, rate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="8.5"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={taxForm.includedInPrice}
                          onChange={(e) => setTaxForm({ ...taxForm, includedInPrice: e.target.checked })}
                          className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">Tax Included in Price</span>
                          <p className="text-xs text-gray-500">Product prices already include tax</p>
                        </div>
                      </label>
                    </div>
                  </>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : 'Save Tax Settings'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingShipping ? 'Edit Shipping Rate' : 'Add Shipping Rate'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shippingForm.name}
                  onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Standard Shipping"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={shippingForm.description}
                  onChange={(e) => setShippingForm({ ...shippingForm, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Delivery within 5-7 business days"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate Type
                </label>
                <select
                  value={shippingForm.rateType}
                  onChange={(e) => setShippingForm({ ...shippingForm, rateType: e.target.value as 'flat' | 'percentage' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="flat">Flat Rate</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {shippingForm.rateType === 'flat' && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  )}
                  <input
                    type="number"
                    step="0.01"
                    value={shippingForm.rate}
                    onChange={(e) => setShippingForm({ ...shippingForm, rate: e.target.value })}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      shippingForm.rateType === 'flat' ? 'pl-8' : ''
                    }`}
                    placeholder={shippingForm.rateType === 'flat' ? '5.99' : '10'}
                  />
                  {shippingForm.rateType === 'percentage' && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order Amount (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={shippingForm.minOrderAmount}
                    onChange={(e) => setShippingForm({ ...shippingForm, minOrderAmount: e.target.value })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="100.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Delivery Days <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shippingForm.estimatedDays}
                  onChange={(e) => setShippingForm({ ...shippingForm, estimatedDays: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="5-7"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shippingForm.isActive}
                    onChange={(e) => setShippingForm({ ...shippingForm, isActive: e.target.checked })}
                    className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="text-sm font-medium text-gray-900">Active</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t flex items-center gap-4">
              <button
                onClick={handleSaveShipping}
                className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                {editingShipping ? 'Update' : 'Add'} Shipping Rate
              </button>
              <button
                onClick={() => {
                  setShowShippingModal(false);
                  setEditingShipping(null);
                  resetShippingForm();
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
