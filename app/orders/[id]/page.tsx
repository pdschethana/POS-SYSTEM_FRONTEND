'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, CreditCard, User, Calendar } from 'lucide-react';
import { orderApi } from '@/lib/api';
import { Order } from '@/lib/types';

const OrderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadOrder(parseInt(params.id as string));
    }
  }, [params.id]);

  const loadOrder = async (id: number) => {
    try {
      const response = await orderApi.getById(id);
      setOrder(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading order:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!order) {
    return <div className="p-8">Order not found</div>;
  }

  const getStatusColor = (status: string) => {
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

  return (
    <div className="p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Orders
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">Order #{order.order_number}</h1>
                <p className="text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
            </div>

            {order.notes && (
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-gray-600"><strong>Notes:</strong> {order.notes}</p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </h2>

            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-gray-500">SKU: {item.product?.sku}</p>
                      <p className="text-sm text-gray-500">
                        ${item.unit_price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold">${item.subtotal.toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax:</span>
                <span>${order.tax_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Discount:</span>
                <span>-${order.discount_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-blue-600">${order.final_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Transactions */}
          {order.transactions && order.transactions.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment History
              </h2>

              <div className="space-y-3">
                {order.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium">{transaction.payment_method.toUpperCase()}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleString()}
                      </p>
                      {transaction.reference && (
                        <p className="text-xs text-gray-400">Ref: {transaction.reference}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${transaction.amount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center font-bold pt-3 border-t">
                  <span>Total Paid:</span>
                  <span className="text-green-600">
                    ${order.transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Customer Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h2>

            {order.customer && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{order.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{order.customer.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => window.print()}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Print Invoice
              </button>
              <button
                onClick={() => router.push('/orders')}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;