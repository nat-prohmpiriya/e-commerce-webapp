'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowLeft, CreditCard, Plus, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data - ในอนาคตจะเก็บใน Firestore
const mockPaymentMethods = [
  {
    id: '1',
    type: 'visa',
    last4: '2143',
    expiryMonth: '12',
    expiryYear: '2025',
    holderName: 'John Doe',
    isDefault: true,
  },
  {
    id: '2',
    type: 'mastercard',
    last4: '8765',
    expiryMonth: '06',
    expiryYear: '2026',
    holderName: 'John Doe',
    isDefault: false,
  },
];

const cardBrandConfig = {
  visa: {
    name: 'VISA',
    bgColor: 'bg-blue-600',
  },
  mastercard: {
    name: 'MC',
    bgColor: 'bg-red-600',
  },
  amex: {
    name: 'AMEX',
    bgColor: 'bg-green-600',
  },
};

export default function PaymentMethodsPage() {
  const t = useTranslations('Account');
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    toast.success(t('defaultPaymentUpdated'));
  };

  const handleDelete = (id: string) => {
    if (confirm(t('removePaymentConfirm'))) {
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
      toast.success(t('paymentRemovedSuccess'));
    }
  };

  const handleAddNew = () => {
    toast(t('paymentIntegrationInfo'), {
      icon: 'ℹ️',
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex-1">{t('paymentMethods')}</h1>
        </div>

        {/* Add New Payment Method Button */}
        <button
          onClick={handleAddNew}
          className="w-full bg-black text-white py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          <span className="font-semibold">{t('addPaymentMethod')}</span>
        </button>
      </div>

      {/* Payment Methods List */}
      <div className="px-4 py-6 space-y-4">
        {paymentMethods.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t('noPaymentMethods')}
            </h2>
            <p className="text-gray-500 mb-6">
              {t('addPaymentCheckout')}
            </p>
          </div>
        ) : (
          paymentMethods.map((method) => {
            const brand = cardBrandConfig[method.type as keyof typeof cardBrandConfig];

            return (
              <div
                key={method.id}
                className={`bg-white rounded-2xl p-4 relative ${
                  method.isDefault ? 'ring-2 ring-black' : ''
                }`}
              >
                {/* Default Badge */}
                {method.isDefault && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-black text-white text-xs px-3 py-1 rounded-full font-medium">
                      {t('default')}
                    </span>
                  </div>
                )}

                {/* Card Info */}
                <div className="flex items-start gap-4 mb-4 pr-20">
                  {/* Card Brand */}
                  <div className={`w-14 h-10 ${brand.bgColor} rounded flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                    {brand.name}
                  </div>

                  {/* Card Details */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      •••• •••• •••• {method.last4}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      {method.holderName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('expires')} {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check size={16} />
                      {t('setAsDefault')}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    {t('remove')}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Security Note */}
      <div className="px-4 py-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">{t('securePayment')}</span>
            <br />
            {t('securePaymentDesc')}
          </p>
        </div>
      </div>
    </div>
  );
}
