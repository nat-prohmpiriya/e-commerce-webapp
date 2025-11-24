'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function useAdminAuth() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/');
      } else if (!isAdmin) {
        // Logged in but not admin, redirect to home
        router.push('/');
      }
    }
  }, [user, loading, isAdmin, router]);

  return { user, loading, isAdmin };
}
