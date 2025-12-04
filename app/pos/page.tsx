'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { customerApi, productApi, orderApi, transactionApi } from '@/lib/api';
import { Customer, Product, CreateOrderDTO, PaymentMethod } from '@/lib/types';

interface CartItem {
  product: Product;
  quantity: number;
}

const POSPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [taxRate, setTaxRate] = useState(0.10); // 10% tax
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    loadCustomers();
    loadProducts();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await customerApi.getAll();
      setCustomers(response.data.data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productApi.getAll();
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }
    try {
      const response = await productApi.search(searchQuery);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * taxRate;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - discount;
  };

  const handleCreateOrder = async () => {
    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }

    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      const orderData: CreateOrderDTO = {
        customer_id: selectedCustomer.id,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        tax_amount: calculateTax(),
        discount_amount: discount,
        notes: notes,
      };

      const response = await orderApi.create(orderData);
      setOrderId(response.data.data.id);
      setShowPayment(true);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error creating order');
    }
  };

  const handlePayment = async () => {
    if (!orderId) return;

    try {
      await transactionApi.create({
        order_id: orderId,
        amount: calculateTotal(),
        payment_method: paymentMethod,
        reference: `PAY-${Date.now()}`,
        notes: `Payment via ${paymentMethod}`,
      });

      alert('Order completed successfully!');
      // Reset
      setCart([]);
      setSelectedCustomer(null);
      setDiscount(0);
      setNotes('');
      setShowPayment(false);
      setOrderId(null);
      loadProducts(); // Refresh products to show updated stock
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error processing payment');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Point of Sale</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="col-span-2 space-y-6">
          {/* Search */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition"
              >
                <div className="text-center">
                  <div className="bg-gray-100 rounded-lg p-4 mb-3">
                    <ShoppingCart className="w-12 h-12 mx-auto text-gray-400" />
                  </div>
                  <h3 className="font-medium mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
                  <p className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="space-y-6">
          {/* Customer Selection */}
          <div className="bg-white p-4 rounded-lg shadow">
            <label className="block text-sm font-medium mb-2">Select Customer</label>
            <select
              value={selectedCustomer?.id || ''}
              onChange={(e) => {
                const customer = customers.find(c => c.id === parseInt(e.target.value));
                setSelectedCustomer(customer || null);
              }}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Choose a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Cart Items */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Cart ({cart.length} items)
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 pb-3 border-b">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (10%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-20 text-right border rounded px-2 py-1"
                  step="0.01"
                />
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span className="text-blue-600">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-4">
              <textarea
                placeholder="Order notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                rows={2}
              />
            </div>

            {/* Place Order Button */}
            <button
              onClick={handleCreateOrder}
              disabled={cart.length === 0 || !selectedCustomer}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed mt-4"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              Process Payment
            </h2>

            <div className="mb-6">
              <p className="text-3xl font-bold text-center text-blue-600">
                ${calculateTotal().toFixed(2)}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="net_banking">Net Banking</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePayment}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
              >
                Confirm Payment
              </button>
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSPage; 

