import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  };

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  };

  const getUser = () => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('usuario');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  const logout = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    router.push('/login');
  };

  return {
    isAuthenticated,
    getToken,
    getUser,
    logout,
  };
}
