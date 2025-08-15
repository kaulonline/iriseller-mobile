/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: '@IRISeller:authToken',
  USER_DATA: '@IRISeller:userData',
  REMEMBER_ME: '@IRISeller:rememberMe',
};

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  jobTitle?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth response interface
export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Login request interface
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Register request interface
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  companyName?: string;
  jobTitle?: string;
}

class AuthService {
  private currentUser: User | null = null;
  private authToken: string | null = null;

  constructor() {
    this.loadStoredAuth();
  }

  // Load stored authentication data
  private async loadStoredAuth() {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
      ]);

      if (token && userData) {
        this.authToken = token;
        this.currentUser = JSON.parse(userData);
        await apiService.saveAuthToken(token);
        console.log('[Auth] Loaded stored authentication');
      }
    } catch (error) {
      console.error('[Auth] Error loading stored auth:', error);
    }
  }

  // Login
  public async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          email: request.email,
          password: request.password,
        }
      );

      // Store auth data
      await this.storeAuthData(response, request.rememberMe);

      return response;
    } catch (error) {
      console.error('[Auth] Login error:', error);
      throw error;
    }
  }

  // Register
  public async register(request: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        request
      );

      // Store auth data
      await this.storeAuthData(response, true);

      return response;
    } catch (error) {
      console.error('[Auth] Registration error:', error);
      throw error;
    }
  }

  // Logout
  public async logout(): Promise<void> {
    try {
      // Call logout endpoint
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('[Auth] Logout API error:', error);
    } finally {
      // Clear local auth data regardless of API response
      await this.clearAuthData();
    }
  }

  // Refresh token
  public async refreshToken(): Promise<string> {
    try {
      const response = await apiService.post<{ token: string }>(
        API_ENDPOINTS.AUTH.REFRESH
      );

      // Update stored token
      this.authToken = response.token;
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      await apiService.saveAuthToken(response.token);

      return response.token;
    } catch (error) {
      console.error('[Auth] Token refresh error:', error);
      throw error;
    }
  }

  // Get current session
  public async getSession(): Promise<User | null> {
    try {
      if (!this.authToken) {
        return null;
      }

      const response = await apiService.get<{ user: User }>(
        API_ENDPOINTS.AUTH.SESSION
      );

      this.currentUser = response.user;
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

      return response.user;
    } catch (error) {
      console.error('[Auth] Session error:', error);
      return null;
    }
  }

  // Forgot password
  public async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      return await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    } catch (error) {
      console.error('[Auth] Forgot password error:', error);
      throw error;
    }
  }

  // Reset password
  public async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      return await apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password: newPassword,
      });
    } catch (error) {
      console.error('[Auth] Reset password error:', error);
      throw error;
    }
  }

  // Store authentication data
  private async storeAuthData(response: AuthResponse, rememberMe?: boolean) {
    this.currentUser = response.user;
    this.authToken = response.token;

    const promises = [
      AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token),
      AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user)),
      apiService.saveAuthToken(response.token),
    ];

    if (rememberMe !== undefined) {
      promises.push(
        AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, JSON.stringify(rememberMe))
      );
    }

    await Promise.all(promises);
    console.log('[Auth] Authentication data stored');
  }

  // Clear authentication data
  private async clearAuthData() {
    this.currentUser = null;
    this.authToken = null;

    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      apiService.clearAuthToken(),
    ]);

    console.log('[Auth] Authentication data cleared');
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.authToken;
  }

  // Get current user
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Update user profile
  public async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const endpoint = API_ENDPOINTS.USERS.PROFILE.replace(':userId', userId);
      const response = await apiService.put<User>(endpoint, updates);

      // Update stored user data
      this.currentUser = response;
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response));

      return response;
    } catch (error) {
      console.error('[Auth] Update profile error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
