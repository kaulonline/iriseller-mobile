/**
 * API Service
 * Core service for making API calls with error handling and retry logic
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { API_CONFIG, getHeaders } from '../config/api.config';

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: '@IRISeller:authToken',
  USER_DATA: '@IRISeller:userData',
  OFFLINE_QUEUE: '@IRISeller:offlineQueue',
};

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Offline queue item
interface OfflineQueueItem {
  id: string;
  url: string;
  method: string;
  data?: any;
  headers?: Record<string, string>;
  timestamp: number;
}

class ApiService {
  private axiosInstance: AxiosInstance;
  private offlineQueue: OfflineQueueItem[] = [];
  private isOnline: boolean = true;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
    });

    this.setupInterceptors();
    this.monitorNetworkStatus();
    this.loadOfflineQueue();
  }

  // Setup axios interceptors
  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Add auth token
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (__DEV__) {
          console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Log response in development
        if (__DEV__) {
          console.log(`[API] Response:`, response.status);
        }
        return response;
      },
      async (error: AxiosError) => {
        // Handle token expiration
        if (error.response?.status === 401) {
          await this.handleTokenExpiration();
        }

        // Handle offline mode
        if (!this.isOnline && error.config) {
          await this.addToOfflineQueue(error.config);
          return Promise.resolve({ 
            data: { 
              offline: true, 
              message: 'Request queued for sync when online' 
            } 
          });
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  // Monitor network status
  private monitorNetworkStatus() {
    NetInfo.addEventListener((state) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      if (wasOffline && this.isOnline) {
        console.log('[API] Back online, processing offline queue...');
        this.processOfflineQueue();
      }
    });
  }

  // Get auth token from storage
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('[API] Error getting auth token:', error);
      return null;
    }
  }

  // Save auth token
  public async saveAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('[API] Error saving auth token:', error);
    }
  }

  // Clear auth token
  public async clearAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('[API] Error clearing auth token:', error);
    }
  }

  // Handle token expiration
  private async handleTokenExpiration() {
    await this.clearAuthToken();
    // TODO: Navigate to login screen
    // You can emit an event here that the app listens to
  }

  // Format error for consistent error handling
  private formatError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error
      const message = (error.response.data as any)?.message || error.message;
      return new ApiError(message, error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      return new ApiError('Network error - please check your connection');
    } else {
      // Something else happened
      return new ApiError(error.message || 'An unexpected error occurred');
    }
  }

  // Add request to offline queue
  private async addToOfflineQueue(config: AxiosRequestConfig) {
    const queueItem: OfflineQueueItem = {
      id: Date.now().toString(),
      url: config.url || '',
      method: config.method || 'GET',
      data: config.data,
      headers: config.headers as Record<string, string>,
      timestamp: Date.now(),
    };

    this.offlineQueue.push(queueItem);
    await this.saveOfflineQueue();

    console.log('[API] Request added to offline queue:', queueItem.url);
  }

  // Load offline queue from storage
  private async loadOfflineQueue() {
    try {
      const queueData = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      if (queueData) {
        this.offlineQueue = JSON.parse(queueData);
        console.log(`[API] Loaded ${this.offlineQueue.length} offline requests`);
      }
    } catch (error) {
      console.error('[API] Error loading offline queue:', error);
    }
  }

  // Save offline queue to storage
  private async saveOfflineQueue() {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.OFFLINE_QUEUE,
        JSON.stringify(this.offlineQueue)
      );
    } catch (error) {
      console.error('[API] Error saving offline queue:', error);
    }
  }

  // Process offline queue when back online
  private async processOfflineQueue() {
    if (this.offlineQueue.length === 0) return;

    console.log(`[API] Processing ${this.offlineQueue.length} offline requests...`);

    const processedIds: string[] = [];

    for (const item of this.offlineQueue) {
      try {
        await this.axiosInstance.request({
          url: item.url,
          method: item.method as any,
          data: item.data,
          headers: item.headers,
        });
        processedIds.push(item.id);
        console.log(`[API] Successfully synced offline request: ${item.url}`);
      } catch (error) {
        console.error(`[API] Failed to sync offline request: ${item.url}`, error);
      }
    }

    // Remove processed items from queue
    this.offlineQueue = this.offlineQueue.filter(
      (item) => !processedIds.includes(item.id)
    );
    await this.saveOfflineQueue();
  }

  // Generic request method with retry logic
  private async requestWithRetry<T>(
    config: AxiosRequestConfig,
    retries = API_CONFIG.RETRY_COUNT
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>(config);
      return response.data;
    } catch (error) {
      if (retries > 0 && (error as ApiError).statusCode !== 401) {
        console.log(`[API] Retrying request... (${retries} retries left)`);
        await new Promise((resolve) => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
        return this.requestWithRetry<T>(config, retries - 1);
      }
      throw error;
    }
  }

  // HTTP methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>({ ...config, method: 'GET', url });
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>({ ...config, method: 'POST', url, data });
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>({ ...config, method: 'PUT', url, data });
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>({ ...config, method: 'DELETE', url });
  }
}

// Export singleton instance
export const apiService = new ApiService();











