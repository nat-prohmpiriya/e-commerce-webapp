'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from '@/i18n/routing';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useProduct } from '@/context/ProductContext';
import { useCategory } from '@/context/CategoryContext';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { ProductColor } from '@/types';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations('Admin');
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const { getProductById, updateProduct } = useProduct();
  const { activeCategories, loading: categoriesLoading } = useCategory();

  const product = getProductById(params.id as string);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    salePrice: '',
    stock: '',
    isPublished: false,
  });

  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>(['']);
  const [colors, setColors] = useState<ProductColor[]>([{ name: '', hex: '#000000' }]);
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load product data
  useEffect(() => {
    if (product && !loaded) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price.toString(),
        salePrice: product.salePrice?.toString() || '',
        stock: product.stock.toString(),
        isPublished: product.isPublished,
      });
      setImages(product.images.length > 0 ? product.images : []);
      setSizes(product.sizes.length > 0 ? product.sizes : ['']);
      setColors(product.colors.length > 0 ? product.colors : [{ name: '', hex: '#000000' }]);
      setLoaded(true);
    }
  }, [product, loaded]);

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">{t('productNotFound')}</p>
          <button
            onClick={() => router.push('/admin/products')}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            {t('backToProducts')}
          </button>
        </div>
      </AdminLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.description || !formData.category || !formData.price || !formData.stock) {
      toast.error(t('fillRequiredFields'));
      return;
    }

    // Filter out empty values
    const validSizes = sizes.filter(size => size.trim() !== '');
    const validColors = colors.filter(color => color.name.trim() !== '');

    if (images.length === 0) {
      toast.error(t('addProductImage'));
      return;
    }

    setSubmitting(true);

    try {
      await updateProduct(product.id, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        images: images,
        sizes: validSizes.length > 0 ? validSizes : ['One Size'],
        colors: validColors.length > 0 ? validColors : [{ name: 'Default', hex: '#000000' }],
        stock: parseInt(formData.stock),
        isPublished: formData.isPublished,
      });

      toast.success(t('productUpdatedSuccess'));
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(t('productUpdateFailed'));
    } finally {
      setSubmitting(false);
    }
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
            {t('backToProducts')}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{t('editProduct')}</h1>
          <p className="text-gray-600 mt-2">{t('updateProductInfo')}</p>
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
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? 'Loading categories...' : 'Select category'}
                </option>
                {activeCategories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              {activeCategories.length === 0 && !categoriesLoading && (
                <p className="text-xs text-red-500 mt-1">
                  No categories available. Please create one first.
                </p>
              )}
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Product Images</h2>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={5}
            />
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
              {submitting ? t('updating') : t('updateProduct')}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
