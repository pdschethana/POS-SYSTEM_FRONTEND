'use client';

import { useAuth } from '@/lib/auth-context';
import { LogOut, User } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-64 bg-white border-b border-gray-200 z-10">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back, {user?.full_name}!
          </h2>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            user?.role === 'admin' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {user?.role?.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">{user?.username}</span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}