// ============================================================================
// AgroKart - TypeScript Type Definitions
// ============================================================================

// User-related types
export type UserRole = 'customer' | 'farmer' | 'middleman' | 'admin';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  token: string;
  refreshToken: string;
}

// Farmer-specific types
export interface FarmerProfile {
  id: number;
  userId: number;
  farmName: string;
  farmAddress: string;
  farmSizeAcres?: number;
  organicCertified: boolean;
  organicCertNumber?: string;
  organicCertExpiry?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
  verificationDocuments: string[];
  latitude?: number;
  longitude?: number;
  establishedYear?: number;
  farmingMethods?: string;
  specialties: string[];
  bio?: string;
  profileImageUrl?: string;
  socialMedia?: Record<string, string>;
  deliveryRadius: number;
  minOrderAmount: number;
}

// Middleman-specific types
export interface MiddlemanProfile {
  id: number;
  userId: number;
  companyName: string;
  licenseNumber?: string;
  warehouseCapacity?: number;
  serviceAreas: string[];
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
}

// Product-related types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  imageUrl?: string;
  iconName?: string;
  isActive: boolean;
}

export interface Product {
  id: number;
  sellerId: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  unit: string; // 'kg', 'piece', 'bunch', etc.
  stockQuantity: number;
  harvestDate?: string;
  expiryDate?: string;
  isOrganic: boolean;
  isActive: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
  
  // Related data (populated when needed)
  seller?: User & (FarmerProfile | MiddlemanProfile);
  category?: Category;
  averageRating?: number;
  reviewCount?: number;
}

// Order-related types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  
  // Related data
  product?: Product;
}

export interface Order {
  id: number;
  customerId: number;
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  deliveryDate?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  
  // Related data
  items?: OrderItem[];
  customer?: User;
}

// Review-related types
export interface Review {
  id: number;
  reviewerId: number;
  productId?: number;
  sellerId?: number;
  rating: number; // 1-5
  comment?: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  
  // Related data
  reviewer?: User;
  product?: Product;
  seller?: User;
}

// Cart-related types
export interface CartItem {
  id: string; // Temporary ID for frontend
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  
  // Role-specific fields (conditionally required)
  farmName?: string;
  farmAddress?: string;
  companyName?: string;
}

export interface ProductForm {
  name: string;
  description?: string;
  categoryId: number;
  price: number;
  unit: string;
  stockQuantity: number;
  harvestDate?: string;
  expiryDate?: string;
  isOrganic: boolean;
  images: File[];
}

// Search and Filter types
export interface ProductFilters {
  categoryId?: number;
  priceMin?: number;
  priceMax?: number;
  isOrganic?: boolean;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in km
  };
  sellerId?: number;
  harvestDateAfter?: string;
  inStock?: boolean;
}

export interface ProductSort {
  field: 'price' | 'createdAt' | 'name' | 'rating';
  direction: 'asc' | 'desc';
}

export interface SearchParams {
  query?: string;
  filters?: ProductFilters;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // in milliseconds
}

// Geolocation types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  id?: number;
  label?: string; // 'Home', 'Work', etc.
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: Coordinates;
  isDefault?: boolean;
}

// Analytics types (for dashboards)
export interface SalesAnalytics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    product: Product;
    totalSold: number;
    revenue: number;
  }>;
  salesByMonth: Array<{
    month: string;
    sales: number;
    orders: number;
  }>;
}

// Component Props types (common ones)
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Utility types
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Export all types as a namespace as well
export namespace AgroKart {
  export type TUser = User;
  export type TAuthUser = AuthUser;
  export type TUserRole = UserRole;
  export type TFarmerProfile = FarmerProfile;
  export type TMiddlemanProfile = MiddlemanProfile;
  export type TProduct = Product;
  export type TCategory = Category;
  export type TOrder = Order;
  export type TOrderItem = OrderItem;
  export type TOrderStatus = OrderStatus;
  export type TPaymentStatus = PaymentStatus;
  export type TReview = Review;
  export type TCartItem = CartItem;
  export type TCart = Cart;
  export type TApiResponse<T = any> = ApiResponse<T>;
  export type TPaginatedResponse<T = any> = PaginatedResponse<T>;
  export type TProductFilters = ProductFilters;
  export type TSearchParams = SearchParams;
  export type TLoadingState = LoadingState;
  export type TNotificationState = NotificationState;
  export type TSalesAnalytics = SalesAnalytics;
}
