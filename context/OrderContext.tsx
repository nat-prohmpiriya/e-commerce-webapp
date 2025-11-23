'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderItem, ShippingAddress, OrderPaymentMethod, OrderStatus } from '@/types';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  createOrder: (orderData: CreateOrderData) => Promise<Order>;
  getOrderById: (orderId: string) => Order | null;
  getAllOrders: () => Promise<Order[]>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

interface CreateOrderData {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: OrderPaymentMethod;
  discountCode?: string;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'ecommerce_orders';

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Load orders from localStorage for guest users
  const loadOrdersFromLocalStorage = (): Order[] => {
    try {
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        // Convert timestamp strings back to Date objects
        return parsedOrders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
          estimatedDeliveryDate: order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate) : undefined,
        }));
      }
    } catch (error) {
      console.error('Error loading orders from localStorage:', error);
    }
    return [];
  };

  // Save orders to localStorage for guest users
  const saveOrdersToLocalStorage = (orderList: Order[]) => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orderList));
    } catch (error) {
      console.error('Error saving orders to localStorage:', error);
    }
  };

  // Load orders from Firestore for logged-in users
  const loadOrdersFromFirestore = async (userId: string): Promise<Order[]> => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const firestoreOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        firestoreOrders.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          estimatedDeliveryDate: data.estimatedDeliveryDate?.toDate(),
        } as Order);
      });

      return firestoreOrders;
    } catch (error) {
      console.error('Error loading orders from Firestore:', error);
    }
    return [];
  };

  // Save order to Firestore
  const saveOrderToFirestore = async (order: Order) => {
    try {
      const orderRef = doc(db, 'orders', order.id);
      await setDoc(orderRef, {
        ...order,
        createdAt: Timestamp.fromDate(order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt)),
        updatedAt: Timestamp.fromDate(order.updatedAt instanceof Date ? order.updatedAt : new Date(order.updatedAt)),
        estimatedDeliveryDate: order.estimatedDeliveryDate
          ? Timestamp.fromDate(order.estimatedDeliveryDate instanceof Date ? order.estimatedDeliveryDate : new Date(order.estimatedDeliveryDate))
          : null,
      });
    } catch (error) {
      console.error('Error saving order to Firestore:', error);
      throw error;
    }
  };

  // Initialize orders
  useEffect(() => {
    const initOrders = async () => {
      setLoading(true);

      if (user) {
        // User is logged in, load from Firestore
        const firestoreOrders = await loadOrdersFromFirestore(user.id);
        setOrders(firestoreOrders);
      } else {
        // User is not logged in, load from localStorage
        const localOrders = loadOrdersFromLocalStorage();
        setOrders(localOrders);
      }

      setLoading(false);
    };

    initOrders();
  }, [user]);

  // Generate unique order number
  const generateOrderNumber = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${year}${month}${day}-${random}`;
  };

  // Create new order
  const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
    const now = new Date();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7); // 7 days from now

    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user?.id || 'guest',
      orderNumber: generateOrderNumber(),
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      discount: orderData.discount,
      total: orderData.total,
      status: 'processing',
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'pending',
      discountCode: orderData.discountCode,
      estimatedDeliveryDate: estimatedDelivery,
      createdAt: now,
      updatedAt: now,
    };

    // Add to state
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);

    // Save to appropriate storage
    if (user) {
      await saveOrderToFirestore(newOrder);
    } else {
      saveOrdersToLocalStorage(updatedOrders);
    }

    return newOrder;
  };

  // Get order by ID
  const getOrderById = (orderId: string): Order | null => {
    return orders.find(order => order.id === orderId) || null;
  };

  // Get all orders (for admin)
  const getAllOrders = async (): Promise<Order[]> => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const allOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allOrders.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          estimatedDeliveryDate: data.estimatedDeliveryDate?.toDate(),
        } as Order);
      });

      return allOrders;
    } catch (error) {
      console.error('Error loading all orders:', error);
      return [];
    }
  };

  // Update order status (for admin)
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: Timestamp.now(),
      });

      // Update local state
      setOrders(orders.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date() as any }
          : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  // Refresh orders from storage
  const refreshOrders = async () => {
    setLoading(true);
    if (user) {
      const firestoreOrders = await loadOrdersFromFirestore(user.id);
      setOrders(firestoreOrders);
    } else {
      const localOrders = loadOrdersFromLocalStorage();
      setOrders(localOrders);
    }
    setLoading(false);
  };

  const value: OrderContextType = {
    orders,
    loading,
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    refreshOrders,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
