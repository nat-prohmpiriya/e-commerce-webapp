// Core Types for E-commerce Web App

import { Timestamp } from 'firebase/firestore';

// ==================== User Types ====================

export interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  cardBrand: string; // 'visa', 'mastercard', etc.
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  stripePaymentMethodId?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  role: 'customer' | 'admin';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}

// ==================== Product Types ====================

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  salePrice?: number;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  rating: number;
  reviewCount: number;
  stock: number;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ==================== Cart Types ====================

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  salePrice?: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: Timestamp;
}

// ==================== Wishlist Types ====================

export interface WishlistItem {
  productId: string;
  addedAt: Timestamp;
}

export interface Wishlist {
  userId: string;
  items: WishlistItem[];
  updatedAt: Timestamp;
}

// ==================== Order Types ====================

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  salePrice?: number;
  subtotal: number;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderPaymentMethod {
  type: 'card';
  cardBrand: string;
  last4: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string;
  discountCode?: string;
  estimatedDeliveryDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ==================== Discount Code Types ====================

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (0-100) or fixed amount
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  validFrom: Timestamp;
  validUntil: Timestamp;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ==================== Review Types (Future) ====================

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  rating: number; // 1-5
  comment: string;
  images?: string[];
  helpfulCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ==================== Category Types ====================

export type ProductCategory = 'All Items' | 'Dress' | 'T-Shirt' | 'Pants' | 'Accessories';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount: number;
  isActive: boolean;
}
