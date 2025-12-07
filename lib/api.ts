/*import axios from 'axios';
import {
  ApiResponse,
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO,
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  UpdateStockDTO,
  Order,
  CreateOrderDTO,
  Transaction,
  CreateTransactionDTO,
  OrderHistory,
} from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API
export const customerApi = {
  getAll: () => api.get<ApiResponse<Customer[]>>('/customers'),
  getById: (id: number) => api.get<ApiResponse<Customer>>(`/customers/${id}`),
  create: (data: CreateCustomerDTO) => api.post<ApiResponse<Customer>>('/customers', data),
  update: (id: number, data: UpdateCustomerDTO) => api.put<ApiResponse<Customer>>(`/customers/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/customers/${id}`),
};

// Product API
export const productApi = {
  getAll: (category?: string) => {
    const url = category ? `/products?category=${category}` : '/products';
    return api.get<ApiResponse<Product[]>>(url);
  },
  getById: (id: number) => api.get<ApiResponse<Product>>(`/products/${id}`),
  search: (query: string) => api.get<ApiResponse<Product[]>>(`/products/search?q=${query}`),
  create: (data: CreateProductDTO) => api.post<ApiResponse<Product>>('/products', data),
  update: (id: number, data: UpdateProductDTO) => api.put<ApiResponse<Product>>(`/products/${id}`, data),
  updateStock: (id: number, data: UpdateStockDTO) => api.patch<ApiResponse<Product>>(`/products/${id}/stock`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/products/${id}`),
};

// Order API
export const orderApi = {
  getAll: (filters?: { customer_id?: number; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.customer_id) params.append('customer_id', filters.customer_id.toString());
    if (filters?.status) params.append('status', filters.status);
    const url = params.toString() ? `/orders?${params.toString()}` : '/orders';
    return api.get<ApiResponse<Order[]>>(url);
  },
  getById: (id: number) => api.get<ApiResponse<Order>>(`/orders/${id}`),
  create: (data: CreateOrderDTO) => api.post<ApiResponse<Order>>('/orders', data),
  updateStatus: (id: number, status: string) => api.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status }),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/orders/${id}`),
  getCustomerHistory: (customerId: number) => api.get<ApiResponse<OrderHistory>>(`/orders/customer/${customerId}/history`),
};

// Transaction API
export const transactionApi = {
  getAll: (orderId?: number) => {
    const url = orderId ? `/transactions?order_id=${orderId}` : '/transactions';
    return api.get<ApiResponse<Transaction[]>>(url);
  },
  getById: (id: number) => api.get<ApiResponse<Transaction>>(`/transactions/${id}`),
  create: (data: CreateTransactionDTO) => api.post<ApiResponse<Transaction>>('/transactions', data),
};

export default api; */ 

/*import axios from 'axios';
import {
  ApiResponse,
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO,
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  UpdateStockDTO,
  Order,
  CreateOrderDTO,
  Transaction,
  CreateTransactionDTO,
  OrderHistory,
  LoginDTO,
  AuthResponse,
  User,
} from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: LoginDTO) => api.post<ApiResponse<AuthResponse>>('/auth/login', data),
  getMe: () => api.get<ApiResponse<User>>('/auth/me'),
};

// Customer API
export const customerApi = {
  getAll: () => api.get<ApiResponse<Customer[]>>('/customers'),
  getById: (id: number) => api.get<ApiResponse<Customer>>(`/customers/${id}`),
  create: (data: CreateCustomerDTO) => api.post<ApiResponse<Customer>>('/customers', data),
  update: (id: number, data: UpdateCustomerDTO) => api.put<ApiResponse<Customer>>(`/customers/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/customers/${id}`),
};

// Product API
export const productApi = {
  getAll: (category?: string) => {
    const url = category ? `/products?category=${category}` : '/products';
    return api.get<ApiResponse<Product[]>>(url);
  },
  getById: (id: number) => api.get<ApiResponse<Product>>(`/products/${id}`),
  search: (query: string) => api.get<ApiResponse<Product[]>>(`/products/search?q=${query}`),
  create: (data: CreateProductDTO) => api.post<ApiResponse<Product>>('/products', data),
  update: (id: number, data: UpdateProductDTO) => api.put<ApiResponse<Product>>(`/products/${id}`, data),
  updateStock: (id: number, data: UpdateStockDTO) => api.patch<ApiResponse<Product>>(`/products/${id}/stock`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/products/${id}`),
};

// Order API
export const orderApi = {
  getAll: (filters?: { customer_id?: number; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.customer_id) params.append('customer_id', filters.customer_id.toString());
    if (filters?.status) params.append('status', filters.status);
    const url = params.toString() ? `/orders?${params.toString()}` : '/orders';
    return api.get<ApiResponse<Order[]>>(url);
  },
  getById: (id: number) => api.get<ApiResponse<Order>>(`/orders/${id}`),
  create: (data: CreateOrderDTO) => api.post<ApiResponse<Order>>('/orders', data),
  updateStatus: (id: number, status: string) => api.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status }),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/orders/${id}`),
  getCustomerHistory: (customerId: number) => api.get<ApiResponse<OrderHistory>>(`/orders/customer/${customerId}/history`),
};

// Transaction API
export const transactionApi = {
  getAll: (orderId?: number) => {
    const url = orderId ? `/transactions?order_id=${orderId}` : '/transactions';
    return api.get<ApiResponse<Transaction[]>>(url);
  },
  getById: (id: number) => api.get<ApiResponse<Transaction>>(`/transactions/${id}`),
  create: (data: CreateTransactionDTO) => api.post<ApiResponse<Transaction>>('/transactions', data),
};

export default api;*/ 

import axios from 'axios';
import {
  ApiResponse,
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO,
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  UpdateStockDTO,
  Order,
  CreateOrderDTO,
  Transaction,
  CreateTransactionDTO,
  OrderHistory,
  LoginDTO,
  AuthResponse,
  User,
} from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: LoginDTO) => api.post<ApiResponse<AuthResponse>>('/auth/login', data),
  getMe: () => api.get<ApiResponse<User>>('/auth/me'),
};

// Customer API
export const customerApi = {
  getAll: () => api.get<ApiResponse<Customer[]>>('/customers'),
  getById: (id: number) => api.get<ApiResponse<Customer>>(`/customers/${id}`),
  create: (data: CreateCustomerDTO) => api.post<ApiResponse<Customer>>('/customers', data),
  update: (id: number, data: UpdateCustomerDTO) => api.put<ApiResponse<Customer>>(`/customers/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/customers/${id}`),
};

// Product API
export const productApi = {
  getAll: (category?: string) => {
    const url = category ? `/products?category=${category}` : '/products';
    return api.get<ApiResponse<Product[]>>(url);
  },
  getById: (id: number) => api.get<ApiResponse<Product>>(`/products/${id}`),
  search: (query: string) => api.get<ApiResponse<Product[]>>(`/products/search?q=${query}`),
  create: (data: CreateProductDTO) => api.post<ApiResponse<Product>>('/products', data),
  update: (id: number, data: UpdateProductDTO) => api.put<ApiResponse<Product>>(`/products/${id}`, data),
  updateStock: (id: number, data: UpdateStockDTO) => api.patch<ApiResponse<Product>>(`/products/${id}/stock`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/products/${id}`),
};

// Order API
export const orderApi = {
  getAll: (filters?: { customer_id?: number; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.customer_id) params.append('customer_id', filters.customer_id.toString());
    if (filters?.status) params.append('status', filters.status);
    const url = params.toString() ? `/orders?${params.toString()}` : '/orders';
    return api.get<ApiResponse<Order[]>>(url);
  },
  getById: (id: number) => api.get<ApiResponse<Order>>(`/orders/${id}`),
  create: (data: CreateOrderDTO) => api.post<ApiResponse<Order>>('/orders', data),
  updateStatus: (id: number, status: string) => api.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status }),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/orders/${id}`),
  getCustomerHistory: (customerId: number) => api.get<ApiResponse<OrderHistory>>(`/orders/customer/${customerId}/history`),
};

// Transaction API
export const transactionApi = {
  getAll: (orderId?: number) => {
    const url = orderId ? `/transactions?order_id=${orderId}` : '/transactions';
    return api.get<ApiResponse<Transaction[]>>(url);
  },
  getById: (id: number) => api.get<ApiResponse<Transaction>>(`/transactions/${id}`),
  create: (data: CreateTransactionDTO) => api.post<ApiResponse<Transaction>>('/transactions', data),
};

export default api;

