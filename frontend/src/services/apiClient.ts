// ============================================================================
// AgroKart - API Client Service
// ============================================================================

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000; // 10 seconds

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// Request Interceptor
// ============================================================================

apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp for cache busting if needed
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ============================================================================
// Response Interceptor
// ============================================================================

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });
    }

    // Handle 401 Unauthorized - Token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const response = await apiClient.post('/auth/refresh', {
            refreshToken,
          });

          const { token } = response.data.data;
          setAuthToken(token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        clearAuthTokens();
        window.location.href = '/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      const networkError = new Error('Network error - please check your connection');
      return Promise.reject(networkError);
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// Token Management
// ============================================================================

const TOKEN_KEY = 'agrokart_token';
const REFRESH_TOKEN_KEY = 'agrokart_refresh_token';

function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function setRefreshToken(refreshToken: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function clearAuthTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ============================================================================
// API Client Class
// ============================================================================

class ApiClient {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<ApiResponse<T>>(config);
      return response.data;
    } catch (error: any) {
      // Transform axios error to our API response format
      if (error.response?.data) {
        return error.response.data;
      }
      
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
        errors: [error.message || 'Network error'],
      };
    }
  }

  // GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  // POST request
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  // PUT request
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  // PATCH request
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  // DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Upload file(s)
  async upload<T = any>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }

  // Token management methods
  setTokens(token: string, refreshToken: string): void {
    setAuthToken(token);
    setRefreshToken(refreshToken);
  }

  getToken(): string | null {
    return getAuthToken();
  }

  clearTokens(): void {
    clearAuthTokens();
  }

  isAuthenticated(): boolean {
    return !!getAuthToken();
  }
}

// ============================================================================
// Create and export API client instance
// ============================================================================

const api = new ApiClient(apiClient);

export default api;
export { ApiClient, apiClient as axiosInstance };

// Export token management functions for use in other parts of the app
export {
  getAuthToken,
  getRefreshToken,
  setAuthToken,
  setRefreshToken,
  clearAuthTokens,
};

// ============================================================================
// API Endpoints Configuration
// ============================================================================

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPLOAD_AVATAR: '/users/avatar',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    GET: (id: number) => `/products/${id}`,
    UPDATE: (id: number) => `/products/${id}`,
    DELETE: (id: number) => `/products/${id}`,
    UPLOAD_IMAGES: (id: number) => `/products/${id}/images`,
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    GET: (id: number) => `/categories/${id}`,
  },

  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    GET: (id: number) => `/orders/${id}`,
    UPDATE_STATUS: (id: number) => `/orders/${id}/status`,
  },

  // Reviews
  REVIEWS: {
    LIST: '/reviews',
    CREATE: '/reviews',
    UPDATE: (id: number) => `/reviews/${id}`,
    DELETE: (id: number) => `/reviews/${id}`,
    BY_PRODUCT: (productId: number) => `/reviews/product/${productId}`,
    BY_SELLER: (sellerId: number) => `/reviews/seller/${sellerId}`,
  },

  // Search
  SEARCH: {
    PRODUCTS: '/search/products',
    SELLERS: '/search/sellers',
  },

  // Admin
  ADMIN: {
    USERS: '/admin/users',
    VERIFY_SELLER: (id: number) => `/admin/users/${id}/verify`,
    ANALYTICS: '/admin/analytics',
  },
};

// ============================================================================
// Helper functions for common operations
// ============================================================================

/**
 * Build query parameters for API requests
 */
export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}

/**
 * Handle API errors in a consistent way
 */
export function handleApiError(error: ApiResponse | Error): string {
  if ('success' in error && !error.success) {
    return error.message || 'An error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Check if response is successful
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true } {
  return response.success === true;
}
