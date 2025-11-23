'use client';

import { useRouter } from 'next/navigation';
import { useAddress } from '@/context/AddressContext';
import { ArrowLeft, Plus, MapPin, Check, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddressesPage() {
  const router = useRouter();
  const { addresses, loading, deleteAddress, setDefaultAddress, selectedAddressId } = useAddress();

  const handleDelete = async (addressId: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId);
        toast.success('Address deleted successfully');
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);
      toast.success('Default address updated');
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to update default address');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading addresses...</div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900 flex-1">Shipping Addresses</h1>
        </div>

        {/* Add New Address Button */}
        <button
          onClick={() => router.push('/account/addresses/new')}
          className="w-full bg-black text-white py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          <span className="font-semibold">Add New Address</span>
        </button>
      </div>

      {/* Address List */}
      <div className="px-4 py-6 space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <MapPin size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No addresses yet
            </h2>
            <p className="text-gray-500 mb-6">
              Add a shipping address to continue with checkout
            </p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-2xl p-4 relative ${
                address.id === selectedAddressId ? 'ring-2 ring-black' : ''
              }`}
            >
              {/* Default Badge */}
              {address.isDefault && (
                <div className="absolute top-4 right-4">
                  <span className="bg-black text-white text-xs px-3 py-1 rounded-full font-medium">
                    Default
                  </span>
                </div>
              )}

              {/* Address Info */}
              <div className="mb-4 pr-20">
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  {address.fullName}
                </h3>
                <p className="text-gray-600 text-sm mb-1">{address.phoneNumber}</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {address.addressLine1}
                  {address.addressLine2 && `, ${address.addressLine2}`}
                  <br />
                  {address.city}, {address.state} {address.postalCode}
                  <br />
                  {address.country}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => router.push(`/account/addresses/${address.id}/edit`)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex-1 bg-red-50 text-red-600 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
