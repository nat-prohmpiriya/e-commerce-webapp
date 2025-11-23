'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useProduct } from '@/context/ProductContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { ProductColor } from '@/types';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const { createProduct } = useProduct();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    salePrice: '',
    stock: '',
    isPublished: false,
  });

  const [images, setImages] = useState<string[]>(['']);
  const [sizes, setSizes] = useState<string[]>(['']);
  const [colors, setColors] = useState<ProductColor[]>([{ name: '', hex: '#000000' }]);
  const [submitting, setSubmitting] = useState(false);

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.description || !formData.category || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Filter out empty values
    const validImages = images.filter(img => img.trim() !== '');
    const validSizes = sizes.filter(size => size.trim() !== '');
    const validColors = colors.filter(color => color.name.trim() !== '');

    if (validImages.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    setSubmitting(true);

    try {
      await createProduct({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        images: validImages,
        sizes: validSizes.length > 0 ? validSizes : ['One Size'],
        colors: validColors.length > 0 ? validColors : [{ name: 'Default', hex: '#000000' }],
        rating: 0,
        reviewCount: 0,
        stock: parseInt(formData.stock),
        isPublished: formData.isPublished,
      });

      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const addImageField = () => setImages([...images, '']);
  const removeImageField = (index: number) => setImages(images.filter((_, i) => i !== index));
  const updateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addSizeField = () => setSizes([...sizes, '']);
  const removeSizeField = (index: number) => setSizes(sizes.filter((_, i) => i !== index));
  const updateSize = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);
  };

  const addColorField = () => setColors([...colors, { name: '', hex: '#000000' }]);
  const removeColorField = (index: number) => setColors(colors.filter((_, i) => i !== index));
  const updateColor = (index: number, field: 'name' | 'hex', value: string) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Create a new product for your store</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter product description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Select category</option>
                <option value="Dress">Dress</option>
                <option value="T-Shirt">T-Shirt</option>
                <option value="Pants">Pants</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing & Stock</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Price (Optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Product Images</h2>
              <button
                type="button"
                onClick={addImageField}
                className="flex items-center gap-2 text-sm text-black hover:text-gray-700"
              >
                <Plus size={16} />
                Add Image
              </button>
            </div>

            <div className="space-y-3">
              {images.map((image, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => updateImage(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter image URL"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Sizes</h2>
              <button
                type="button"
                onClick={addSizeField}
                className="flex items-center gap-2 text-sm text-black hover:text-gray-700"
              >
                <Plus size={16} />
                Add Size
              </button>
            </div>

            <div className="space-y-3">
              {sizes.map((size, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => updateSize(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g., S, M, L, XL"
                  />
                  {sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSizeField(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Colors</h2>
              <button
                type="button"
                onClick={addColorField}
                className="flex items-center gap-2 text-sm text-black hover:text-gray-700"
              >
                <Plus size={16} />
                Add Color
              </button>
            </div>

            <div className="space-y-3">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => updateColor(index, 'name', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Color name (e.g., Black)"
                  />
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(index, 'hex', e.target.value)}
                    className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  {colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColorField(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Publish Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Publish product</span>
                <p className="text-xs text-gray-500">Make this product visible to customers</p>
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
              {submitting ? 'Creating...' : 'Create Product'}
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
