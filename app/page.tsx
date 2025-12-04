'use client';

import { useEffect, useState } from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { customerApi, productApi, orderApi } from '@/lib/api';
import { Customer, Product, Order } from '@/lib/types';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [customersRes, productsRes, ordersRes] = await Promise.all([
        customerApi.getAll(),
        productApi.getAll(),
        orderApi.getAll(),
      ]);

      const customers = customersRes.data.data;
      const products = productsRes.data.data;
      const orders = ordersRes.data.data;

      const pendingOrders = orders.filter((o: Order) => o.status === 'pending').length;
      const completedOrders = orders.filter((o: Order) => o.status === 'completed').length;
      const totalRevenue = orders
        .filter((o: Order) => o.status === 'completed')
        .reduce((sum: number, o: Order) => sum + o.final_amount, 0);
      const lowStockProducts = products.filter((p: Product) => p.stock < 10).length;

      setStats({
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        completedOrders,
        lowStockProducts,
      });

      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    trend 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    color: string;
    trend?: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {trend && (
            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {trend}
            </p>
          )}
        </div>
        <div className={`${color} p-3 rounded-full`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="bg-yellow-500"
          trend="+12% from last month"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-orange-500">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Completed Orders</h3>
          <p className="text-3xl font-bold text-green-500">{stats.completedOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2 flex items-center gap-2">
            Low Stock Products
            {stats.lowStockProducts > 0 && <AlertCircle className="w-4 h-4 text-red-500" />}
          </h3>
          <p className="text-3xl font-bold text-red-500">{stats.lowStockProducts}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{order.order_number}</td>
                  <td className="px-6 py-4">{order.customer?.name || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">${order.final_amount.toFixed(2)}</td>
                  <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;