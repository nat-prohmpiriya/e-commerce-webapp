'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { Database, CheckCircle, XCircle, Loader, AlertCircle, Package, FolderTree } from 'lucide-react';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import streetwearCategories from '@/data/streetwear/categories';
import streetwearProducts from '@/data/streetwear/products';
import toast from 'react-hot-toast';

interface SeedProgress {
  total: number;
  current: number;
  status: 'idle' | 'running' | 'success' | 'error';
  message: string;
}

export default function SeedPage() {
  const { loading, isAdmin } = useAdminAuth();
  const [categoriesProgress, setCategoriesProgress] = useState<SeedProgress>({
    total: 0,
    current: 0,
    status: 'idle',
    message: ''
  });
  const [productsProgress, setProductsProgress] = useState<SeedProgress>({
    total: 0,
    current: 0,
    status: 'idle',
    message: ''
  });
  const [clearProgress, setClearProgress] = useState<SeedProgress>({
    total: 0,
    current: 0,
    status: 'idle',
    message: ''
  });

  // Seed Categories
  const seedCategories = async () => {
    setCategoriesProgress({
      total: streetwearCategories.length,
      current: 0,
      status: 'running',
      message: 'กำลังเพิ่มหมวดหมู่...'
    });

    try {
      for (let i = 0; i < streetwearCategories.length; i++) {
        const category = streetwearCategories[i];
        await setDoc(doc(db, 'categories', category.id), category);

        setCategoriesProgress({
          total: streetwearCategories.length,
          current: i + 1,
          status: 'running',
          message: `เพิ่มหมวดหมู่: ${category.name}`
        });
      }

      setCategoriesProgress({
        total: streetwearCategories.length,
        current: streetwearCategories.length,
        status: 'success',
        message: `เพิ่มหมวดหมู่สำเร็จ ${streetwearCategories.length} รายการ`
      });
      toast.success(`เพิ่มหมวดหมู่สำเร็จ ${streetwearCategories.length} รายการ`);
    } catch (error: any) {
      console.error('Error seeding categories:', error);
      setCategoriesProgress({
        total: streetwearCategories.length,
        current: 0,
        status: 'error',
        message: `เกิดข้อผิดพลาด: ${error.message}`
      });
      toast.error('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่');
    }
  };

  // Seed Products
  const seedProducts = async () => {
    setProductsProgress({
      total: streetwearProducts.length,
      current: 0,
      status: 'running',
      message: 'กำลังเพิ่มสินค้า...'
    });

    try {
      for (let i = 0; i < streetwearProducts.length; i++) {
        const product = streetwearProducts[i];

        // Remove undefined fields (Firestore doesn't support undefined)
        const cleanProduct = Object.fromEntries(
          Object.entries(product).filter(([_, value]) => value !== undefined)
        );

        await setDoc(doc(db, 'products', product.id), cleanProduct);

        setProductsProgress({
          total: streetwearProducts.length,
          current: i + 1,
          status: 'running',
          message: `เพิ่มสินค้า: ${product.name}`
        });
      }

      setProductsProgress({
        total: streetwearProducts.length,
        current: streetwearProducts.length,
        status: 'success',
        message: `เพิ่มสินค้าสำเร็จ ${streetwearProducts.length} รายการ`
      });
      toast.success(`เพิ่มสินค้าสำเร็จ ${streetwearProducts.length} รายการ`);
    } catch (error: any) {
      console.error('Error seeding products:', error);
      setProductsProgress({
        total: streetwearProducts.length,
        current: 0,
        status: 'error',
        message: `เกิดข้อผิดพลาด: ${error.message}`
      });
      toast.error('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
    }
  };

  // Seed All
  const seedAll = async () => {
    await seedCategories();
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    await seedProducts();
  };

  // Clear All Data
  const clearAllData = async () => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้!')) {
      return;
    }

    setClearProgress({
      total: 0,
      current: 0,
      status: 'running',
      message: 'กำลังลบข้อมูล...'
    });

    try {
      // Delete all categories
      const categoriesRef = collection(db, 'categories');
      const categoriesSnapshot = await getDocs(categoriesRef);

      setClearProgress({
        total: categoriesSnapshot.size,
        current: 0,
        status: 'running',
        message: 'กำลังลบหมวดหมู่...'
      });

      for (const docSnapshot of categoriesSnapshot.docs) {
        await deleteDoc(doc(db, 'categories', docSnapshot.id));
      }

      // Delete all products
      const productsRef = collection(db, 'products');
      const productsSnapshot = await getDocs(productsRef);

      setClearProgress({
        total: categoriesSnapshot.size + productsSnapshot.size,
        current: categoriesSnapshot.size,
        status: 'running',
        message: 'กำลังลบสินค้า...'
      });

      for (const docSnapshot of productsSnapshot.docs) {
        await deleteDoc(doc(db, 'products', docSnapshot.id));
      }

      setClearProgress({
        total: categoriesSnapshot.size + productsSnapshot.size,
        current: categoriesSnapshot.size + productsSnapshot.size,
        status: 'success',
        message: `ลบข้อมูลสำเร็จ ${categoriesSnapshot.size + productsSnapshot.size} รายการ`
      });
      toast.success('ลบข้อมูลทั้งหมดสำเร็จ');

      // Reset other progress
      setCategoriesProgress({ total: 0, current: 0, status: 'idle', message: '' });
      setProductsProgress({ total: 0, current: 0, status: 'idle', message: '' });
    } catch (error: any) {
      console.error('Error clearing data:', error);
      setClearProgress({
        total: 0,
        current: 0,
        status: 'error',
        message: `เกิดข้อผิดพลาด: ${error.message}`
      });
      toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const isAnyRunning =
    categoriesProgress.status === 'running' ||
    productsProgress.status === 'running' ||
    clearProgress.status === 'running';

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seed Database</h1>
          <p className="text-gray-600 mt-2">เพิ่มข้อมูลตัวอย่างจากร้าน Streetwear ลงในฐานข้อมูล</p>
        </div>

        {/* Warning Alert */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-yellow-400 mr-3 flex-shrink-0" size={24} />
            <div>
              <h3 className="text-yellow-800 font-semibold">คำเตือน</h3>
              <p className="text-yellow-700 text-sm mt-1">
                การเพิ่มข้อมูลจะเขียนทับข้อมูลเดิมที่มี ID ซ้ำกัน กรุณาตรวจสอบก่อนดำเนินการ
              </p>
            </div>
          </div>
        </div>

        {/* Data Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <FolderTree className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                <p className="text-sm text-gray-500">หมวดหมู่สินค้า Streetwear</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">จำนวน:</span>
                <span className="font-semibold text-gray-900">{streetwearCategories.length} หมวดหมู่</span>
              </div>
              <div className="text-xs text-gray-500">
                {streetwearCategories.map(c => c.name).join(', ')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Products</h3>
                <p className="text-sm text-gray-500">สินค้า Streetwear</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">จำนวน:</span>
                <span className="font-semibold text-gray-900">{streetwearProducts.length} สินค้า</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ราคา:</span>
                <span className="font-semibold text-gray-900">฿390 - ฿3,490</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">สินค้าลดราคา:</span>
                <span className="font-semibold text-gray-900">9 รายการ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">การดำเนินการ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={seedCategories}
              disabled={isAnyRunning}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <FolderTree size={20} />
              <span>เพิ่มหมวดหมู่</span>
            </button>

            <button
              onClick={seedProducts}
              disabled={isAnyRunning}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Package size={20} />
              <span>เพิ่มสินค้า</span>
            </button>

            <button
              onClick={seedAll}
              disabled={isAnyRunning}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Database size={20} />
              <span>เพิ่มทั้งหมด</span>
            </button>

            <button
              onClick={clearAllData}
              disabled={isAnyRunning}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <XCircle size={20} />
              <span>ลบทั้งหมด</span>
            </button>
          </div>
        </div>

        {/* Progress Cards */}
        <div className="space-y-4">
          {/* Categories Progress */}
          {categoriesProgress.status !== 'idle' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Categories Progress</h3>
                {categoriesProgress.status === 'running' && <Loader className="animate-spin text-purple-600" size={20} />}
                {categoriesProgress.status === 'success' && <CheckCircle className="text-green-600" size={20} />}
                {categoriesProgress.status === 'error' && <XCircle className="text-red-600" size={20} />}
              </div>

              {categoriesProgress.total > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{categoriesProgress.current} / {categoriesProgress.total}</span>
                    <span>{Math.round((categoriesProgress.current / categoriesProgress.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        categoriesProgress.status === 'success' ? 'bg-green-600' :
                        categoriesProgress.status === 'error' ? 'bg-red-600' :
                        'bg-purple-600'
                      }`}
                      style={{ width: `${(categoriesProgress.current / categoriesProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600">{categoriesProgress.message}</p>
            </div>
          )}

          {/* Products Progress */}
          {productsProgress.status !== 'idle' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Products Progress</h3>
                {productsProgress.status === 'running' && <Loader className="animate-spin text-blue-600" size={20} />}
                {productsProgress.status === 'success' && <CheckCircle className="text-green-600" size={20} />}
                {productsProgress.status === 'error' && <XCircle className="text-red-600" size={20} />}
              </div>

              {productsProgress.total > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{productsProgress.current} / {productsProgress.total}</span>
                    <span>{Math.round((productsProgress.current / productsProgress.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        productsProgress.status === 'success' ? 'bg-green-600' :
                        productsProgress.status === 'error' ? 'bg-red-600' :
                        'bg-blue-600'
                      }`}
                      style={{ width: `${(productsProgress.current / productsProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600">{productsProgress.message}</p>
            </div>
          )}

          {/* Clear Progress */}
          {clearProgress.status !== 'idle' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Clear Progress</h3>
                {clearProgress.status === 'running' && <Loader className="animate-spin text-red-600" size={20} />}
                {clearProgress.status === 'success' && <CheckCircle className="text-green-600" size={20} />}
                {clearProgress.status === 'error' && <XCircle className="text-red-600" size={20} />}
              </div>

              {clearProgress.total > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{clearProgress.current} / {clearProgress.total}</span>
                    <span>{Math.round((clearProgress.current / clearProgress.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        clearProgress.status === 'success' ? 'bg-green-600' :
                        clearProgress.status === 'error' ? 'bg-red-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${(clearProgress.current / clearProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600">{clearProgress.message}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
