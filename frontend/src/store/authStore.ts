// ============================================================================
// AgroKart - Authentication Store (Zustand)
// ============================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AuthUser, User, LoginForm, RegisterForm, ApiResponse } from '../types';
import api, { API_ENDPOINTS } from '../services/apiClient';

// ============================================================================
// Types
// ============================================================================

interface AuthState {
  // State
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (credentials: LoginForm) => Promise<boolean>;
  register: (userData: RegisterForm) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// ============================================================================
// Auth Store
// ============================================================================

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,

        // Actions
        login: async (credentials: LoginForm): Promise<boolean> => {
          try {
            set({ isLoading: true, error: null });

            const response = await api.post<{
              user: AuthUser;
              token: string;
              refreshToken: string;
            }>(API_ENDPOINTS.AUTH.LOGIN, credentials);

            if (response.success && response.data) {
              const { user, token, refreshToken } = response.data;
              
              // Store tokens
              api.setTokens(token, refreshToken);

              // Update state
              set({
                user: { ...user, token, refreshToken },
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });

              return true;
            } else {
              set({
                error: response.message || 'Login failed',
                isLoading: false,
              });
              return false;
            }
          } catch (error) {
            set({
              error: 'Network error - please check your connection',
              isLoading: false,
            });
            return false;
          }
        },

        register: async (userData: RegisterForm): Promise<boolean> => {
          try {
            set({ isLoading: true, error: null });

            const response = await api.post<{
              user: User;
              message: string;
            }>(API_ENDPOINTS.AUTH.REGISTER, userData);

            if (response.success) {
              set({
                isLoading: false,
                error: null,
              });
              return true;
            } else {
              set({
                error: response.message || 'Registration failed',
                isLoading: false,
              });
              return false;
            }
          } catch (error) {
            set({
              error: 'Network error - please check your connection',
              isLoading: false,
            });
            return false;
          }
        },

        logout: () => {
          // Clear tokens
          api.clearTokens();
          
          // Reset state
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });

          // Optional: Call logout API endpoint
          api.post(API_ENDPOINTS.AUTH.LOGOUT).catch(() => {
            // Ignore errors for logout
          });
        },

        refreshToken: async (): Promise<boolean> => {
          try {
            const response = await api.post<{
              token: string;
              refreshToken: string;
            }>(API_ENDPOINTS.AUTH.REFRESH);

            if (response.success && response.data) {
              const { token, refreshToken } = response.data;
              
              // Update tokens
              api.setTokens(token, refreshToken);

              // Update user in state
              const currentUser = get().user;
              if (currentUser) {
                set({
                  user: { ...currentUser, token, refreshToken },
                });
              }

              return true;
            } else {
              // Refresh failed, logout user
              get().logout();
              return false;
            }
          } catch (error) {
            // Refresh failed, logout user
            get().logout();
            return false;
          }
        },

        updateProfile: async (updates: Partial<User>): Promise<boolean> => {
          try {
            set({ isLoading: true, error: null });

            const response = await api.put<User>(
              API_ENDPOINTS.USERS.UPDATE_PROFILE,
              updates
            );

            if (response.success && response.data) {
              const currentUser = get().user;
              if (currentUser) {
                set({
                  user: {
                    ...currentUser,
                    ...response.data,
                  },
                  isLoading: false,
                  error: null,
                });
              }
              return true;
            } else {
              set({
                error: response.message || 'Profile update failed',
                isLoading: false,
              });
              return false;
            }
          } catch (error) {
            set({
              error: 'Network error - please check your connection',
              isLoading: false,
            });
            return false;
          }
        },

        clearError: () => {
          set({ error: null });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },
      }),
      {
        name: 'agrokart-auth', // localStorage key
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'AuthStore',
    }
  )
);

// ============================================================================
// Selectors (for performance optimization)
// ============================================================================

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error } = useAuthStore();
  return { user, isAuthenticated, isLoading, error };
};

export const useAuthActions = () => {
  const { login, register, logout, refreshToken, updateProfile, clearError, setLoading } = useAuthStore();
  return { login, register, logout, refreshToken, updateProfile, clearError, setLoading };
};

// Helper to get user role
export const useUserRole = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role || null;
};

// Helper to check specific permissions
export const usePermissions = () => {
  const user = useAuthStore((state) => state.user);
  
  return {
    canManageProducts: user?.role === 'farmer' || user?.role === 'middleman' || user?.role === 'admin',
    canViewAdminPanel: user?.role === 'admin',
    canPlaceOrders: user?.role === 'customer' || user?.role === 'admin',
    canManageOrders: user?.role === 'farmer' || user?.role === 'middleman' || user?.role === 'admin',
    isVerified: user?.isVerified || false,
  };
};

// ============================================================================
// Auth utilities
// ============================================================================

/**
 * Initialize auth state on app startup
 */
export const initializeAuth = async () => {
  const token = api.getToken();
  
  if (token) {
    // Try to refresh token to validate it
    const authStore = useAuthStore.getState();
    const success = await authStore.refreshToken();
    
    if (!success) {
      // Token is invalid, clear auth state
      authStore.logout();
    }
  }
};

/**
 * Check if user has required role
 */
export const hasRole = (requiredRole: string | string[]): boolean => {
  const user = useAuthStore.getState().user;
  
  if (!user) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }
  
  return user.role === requiredRole;
};

/**
 * Require authentication - use in route guards
 */
export const requireAuth = (): boolean => {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  
  if (!isAuthenticated) {
    // Redirect to login
    window.location.href = '/login';
    return false;
  }
  
  return true;
};

/**
 * Require specific role - use in route guards
 */
export const requireRole = (requiredRole: string | string[]): boolean => {
  if (!requireAuth()) return false;
  
  if (!hasRole(requiredRole)) {
    // Redirect to unauthorized page
    window.location.href = '/unauthorized';
    return false;
  }
  
  return true;
};
