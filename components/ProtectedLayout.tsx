'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from './Sidebar';
import Header from './Header';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && !isLoginPage) {
        router.push('/login');
      } else if (isAuthenticated && isLoginPage) {
        router.push('/');
      }
    }
  }, [isAuthenticated, loading, isLoginPage, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Header />
        <main className="bg-gray-50 min-h-screen pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}