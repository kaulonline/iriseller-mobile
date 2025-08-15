/**
 * Dashboard Service
 * Handles dashboard data, metrics, and performance indicators
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

// Dashboard overview interface (matching backend API response)
export interface DashboardOverview {
  totalOpportunities: number;
  totalLeads: number;
  totalTasks: number;
  pipelineValue: number;
  averageDealSize: number;
  conversionRate: number;
  qualifiedLeads: number;
  prospects: number;
  messages: number;
  responses: number;
  meetings: number;
  responseRate: number;
  revenueData: {
    target: number;
    actual: number;
    forecast: number;
    previousPeriod: number;
    growth: number;
  };
  growthRates: {
    prospects: number;
    messages: number;
    responses: number;
    responseRate: number;
  };
  period: string;
  lastUpdated: string;
  source: string;
  responseTime: number;
}

// Performance metrics interface
export interface PerformanceMetrics {
  conversionRate: number;
  averageDealSize: number;
  salesCycle: number;
  winRate: number;
  leadVelocity: number;
  pipelineValue: number;
  forecastAccuracy: number;
  activityLevel: number;
}

// Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  assignedTo: string;
  type: 'lead_followup' | 'meeting' | 'proposal' | 'call' | 'email' | 'other';
}

// Activity item interface
export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
  metadata?: any;
}

// Top performer interface
export interface PerformerItem {
  id: string;
  name: string;
  metric: string;
  value: number;
  change: number;
  rank: number;
}

// Storage keys
const STORAGE_KEYS = {
  DASHBOARD_CACHE: '@IRISeller:dashboardCache',
  METRICS_CACHE: '@IRISeller:metricsCache',
  TASKS_CACHE: '@IRISeller:tasksCache',
};

class DashboardService {
  // Cache duration (5 minutes)
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  // Get dashboard overview
  public async getOverview(forceRefresh = false): Promise<DashboardOverview> {
    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = await this.getCachedData<DashboardOverview>(STORAGE_KEYS.DASHBOARD_CACHE);
        if (cached) {
          console.log('[Dashboard] Using cached overview data');
          return cached;
        }
      }

      // Fetch from API
      const response = await apiService.get<DashboardOverview>(
        API_ENDPOINTS.DASHBOARD.OVERVIEW
      );

      // Cache the response
      await this.cacheData(STORAGE_KEYS.DASHBOARD_CACHE, response);

      return response;
    } catch (error) {
      console.error('[Dashboard] Error fetching overview:', error);
      
      // Try to return cached data on error
      const cached = await this.getCachedData<DashboardOverview>(STORAGE_KEYS.DASHBOARD_CACHE);
      if (cached) {
        console.log('[Dashboard] Returning cached data due to error');
        return cached;
      }
      
      // Return default data if no cache
      return this.getDefaultOverview();
    }
  }

  // Get performance metrics
  public async getPerformanceMetrics(forceRefresh = false): Promise<PerformanceMetrics> {
    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = await this.getCachedData<PerformanceMetrics>(STORAGE_KEYS.METRICS_CACHE);
        if (cached) {
          console.log('[Dashboard] Using cached metrics data');
          return cached;
        }
      }

      // Fetch from API
      const response = await apiService.get<PerformanceMetrics>(
        API_ENDPOINTS.DASHBOARD.PERFORMANCE
      );

      // Cache the response
      await this.cacheData(STORAGE_KEYS.METRICS_CACHE, response);

      return response;
    } catch (error) {
      console.error('[Dashboard] Error fetching metrics:', error);
      
      // Try to return cached data on error
      const cached = await this.getCachedData<PerformanceMetrics>(STORAGE_KEYS.METRICS_CACHE);
      if (cached) {
        console.log('[Dashboard] Returning cached data due to error');
        return cached;
      }
      
      // Return default data if no cache
      return this.getDefaultMetrics();
    }
  }

  // Get tasks
  public async getTasks(forceRefresh = false): Promise<Task[]> {
    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = await this.getCachedData<Task[]>(STORAGE_KEYS.TASKS_CACHE);
        if (cached) {
          console.log('[Dashboard] Using cached tasks data');
          return cached;
        }
      }

      // Fetch from API
      const response = await apiService.get<Task[]>(
        API_ENDPOINTS.DASHBOARD.TASKS
      );

      // Cache the response
      await this.cacheData(STORAGE_KEYS.TASKS_CACHE, response);

      return response;
    } catch (error) {
      console.error('[Dashboard] Error fetching tasks:', error);
      
      // Try to return cached data on error
      const cached = await this.getCachedData<Task[]>(STORAGE_KEYS.TASKS_CACHE);
      if (cached) {
        console.log('[Dashboard] Returning cached data due to error');
        return cached;
      }
      
      return [];
    }
  }

  // Update task status
  public async updateTaskStatus(taskId: string, status: Task['status']): Promise<Task> {
    try {
      const response = await apiService.put<Task>(
        `/tasks/${taskId}`,
        { status }
      );

      // Update cache
      const tasks = await this.getCachedData<Task[]>(STORAGE_KEYS.TASKS_CACHE);
      if (tasks) {
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
          tasks[index] = response;
          await this.cacheData(STORAGE_KEYS.TASKS_CACHE, tasks);
        }
      }

      return response;
    } catch (error) {
      console.error('[Dashboard] Error updating task:', error);
      throw error;
    }
  }

  // Get cached data
  private async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() - timestamp > this.CACHE_DURATION) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('[Dashboard] Error reading cache:', error);
      return null;
    }
  }

  // Cache data
  private async cacheData(key: string, data: any): Promise<void> {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.error('[Dashboard] Error caching data:', error);
    }
  }

  // Get default overview (fallback data)
  private getDefaultOverview(): DashboardOverview {
    return {
      totalOpportunities: 0,
      totalLeads: 0,
      totalTasks: 0,
      pipelineValue: 0,
      averageDealSize: 0,
      conversionRate: 0,
      qualifiedLeads: 0,
      prospects: 0,
      messages: 0,
      responses: 0,
      meetings: 0,
      responseRate: 0,
      revenueData: {
        target: 0,
        actual: 0,
        forecast: 0,
        previousPeriod: 0,
        growth: 0,
      },
      growthRates: {
        prospects: 0,
        messages: 0,
        responses: 0,
        responseRate: 0,
      },
      period: 'all',
      lastUpdated: new Date().toISOString(),
      source: 'default',
      responseTime: 0,
    };
  }

  // Get default metrics (fallback data)
  private getDefaultMetrics(): PerformanceMetrics {
    return {
      conversionRate: 0,
      averageDealSize: 0,
      salesCycle: 0,
      winRate: 0,
      leadVelocity: 0,
      pipelineValue: 0,
      forecastAccuracy: 0,
      activityLevel: 0,
    };
  }

  // Clear all cached data
  public async clearCache(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.DASHBOARD_CACHE),
        AsyncStorage.removeItem(STORAGE_KEYS.METRICS_CACHE),
        AsyncStorage.removeItem(STORAGE_KEYS.TASKS_CACHE),
      ]);
      console.log('[Dashboard] Cache cleared');
    } catch (error) {
      console.error('[Dashboard] Error clearing cache:', error);
    }
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
