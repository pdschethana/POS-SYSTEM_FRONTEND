// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
  }
  
  // Customer Types
  export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface CreateCustomerDTO {
    name: string;
    email: string;
    phone: string;
    address: string;
  }
  
  export interface UpdateCustomerDTO {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }
  
  // Product Types
  export interface Product {
    id: number;
    name: string;
    description: string;
    sku: string;
    price: number;
    stock: number;
    category: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface CreateProductDTO {
    name: string;
    description: string;
    sku: string;
    price: number;
    stock: number;
    category: string;
  }
  
  export interface UpdateProductDTO {
    name?: string;
    description?: string;
    sku?: string;
    price?: number;
    stock?: number;
    category?: string;
  }
  
  export interface UpdateStockDTO {
    quantity: number;
    type: 'add' | 'subtract' | 'set';
  }
  
  // Order Types
  export type OrderStatus = 'pending' | 'completed' | 'cancelled';
  
  export interface OrderItem {
    id: number;
    product_id: number;
    product?: Product;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }
  
  export interface Order {
    id: number;
    order_number: string;
    customer_id: number;
    customer?: Customer;
    status: OrderStatus;
    total_amount: number;
    tax_amount: number;
    discount_amount: number;
    final_amount: number;
    notes: string;
    order_items: OrderItem[];
    transactions: Transaction[];
    created_at: string;
    updated_at: string;
  }
  
  export interface CreateOrderDTO {
    customer_id: number;
    items: {
      product_id: number;
      quantity: number;
    }[];
    tax_amount: number;
    discount_amount: number;
    notes: string;
  }
  
  // Transaction Types
  export type PaymentMethod = 'cash' | 'card' | 'upi' | 'net_banking';
  export type TransactionStatus = 'success' | 'pending' | 'failed';
  
  export interface Transaction {
    id: number;
    order_id: number;
    amount: number;
    payment_method: PaymentMethod;
    status: TransactionStatus;
    transaction_number: string;
    reference: string;
    notes: string;
    created_at: string;
  }
  
  export interface CreateTransactionDTO {
    order_id: number;
    amount: number;
    payment_method: PaymentMethod;
    reference?: string;
    notes?: string;
  }
  
  // Order History Types
  export interface OrderHistory {
    customer_id: number;
    orders: Order[];
    total_orders: number;
    total_spent: number;
  }
  
  // Dashboard Stats
  export interface DashboardStats {
    totalCustomers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    lowStockProducts: number;
  }