/*'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Receipt,
  Store
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'POS', href: '/pos', icon: Store },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Receipt className="w-8 h-8" />
          POS System
        </h1>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;*/  

/*'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Store
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, adminOnly: true },
    { name: 'Customers', href: '/customers', icon: Users, adminOnly: true },
    { name: 'Products', href: '/products', icon: Package, adminOnly: true },
    { name: 'POS', href: '/pos', icon: Store, adminOnly: false },
    { name: 'Orders', href: '/orders', icon: ShoppingCart, adminOnly: false },
  ];

  // Filter menu items based on role
  const visibleMenuItems = menuItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') {
      return false;
    }
    return true;
  });

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Store className="w-8 h-8" />
          POS System
        </h1>
        {user && (
          <p className="text-sm text-gray-400 mt-2">
            {user.role === 'admin' ? '👑 Admin Panel' : '🛒 Cashier Mode'}
          </p>
        )}
      </div>

      <nav className="mt-6">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;*/  

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Store
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, adminOnly: true },
    { name: 'Customers', href: '/customers', icon: Users, adminOnly: false }, // allow cashier too
    { name: 'Products', href: '/products', icon: Package, adminOnly: true },
    { name: 'POS', href: '/pos', icon: Store, adminOnly: false },
    { name: 'Orders', href: '/orders', icon: ShoppingCart, adminOnly: false },
  ];

  // Filter menu items based on role
  const visibleMenuItems = menuItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') {
      return false;
    }
    return true;
  });

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        POS System
      </div>

      {user && (
        <div className="p-4 border-b border-gray-700">
          {user.role === 'admin' ? '👑 Admin Panel' : '🛒 Cashier Mode'}
        </div>
      )}

      <nav className="p-4">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center p-2 my-2 rounded hover:bg-gray-700 ${
                isActive ? 'bg-gray-700' : ''
              }`}
            >
              <Icon className="mr-2" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;



