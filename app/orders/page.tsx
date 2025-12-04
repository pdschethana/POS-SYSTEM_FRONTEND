'use client';

import { useEffect, useState } from 'react';
import { Eye, Filter } from 'lucide-react';
import { orderApi } from '@/lib/api';
import { Order, OrderStatus } from '@/lib/types';
import Link from 'next/link';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      const filters = statusFilter ? { status: statusFilter } : undefined;
      const response = await orderApi.getAll(filters);
      setOrders(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      alert('Error updating status');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>

        {/* Status Filter */}
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">
            ${orders.reduce((sum, o) => sum + o.final_amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${orders.length > 0 ? (orders.reduce((sum, o) => sum + o.final_amount, 0) / orders.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{order.order_number}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{order.customer?.name}</p>
                    <p className="text-sm text-gray-500">{order.customer?.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4">{order.order_items.length} items</td>
                <td className="px-6 py-4 font-bold">${order.final_amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;