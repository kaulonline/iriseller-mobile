/**
 * API Configuration
 * Central configuration for all API endpoints
 */

const isDevelopment = __DEV__;

// Base API URL - change this for production
export const API_CONFIG = {
  // Use your local IP for development, production URL for production
  BASE_URL: isDevelopment 
    ? 'http://localhost:3001/api' // Change to your local IP like 'http://192.168.1.100:3001/api'
    : 'https://beta.iriseller.com/api',
  
  // API timeout in milliseconds
  TIMEOUT: 30000,
  
  // Retry configuration
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
  
  // Cache configuration
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  
  // Rate limiting
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    SESSION: '/auth/session',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Dashboard
  DASHBOARD: {
    OVERVIEW: '/dashboard/overview',
    PERFORMANCE: '/dashboard/performance',
    TASKS: '/dashboard/tasks',
  },
  
  // AI Agents
  AI_AGENTS: {
    LIST: '/ai/agents',
    STATUS: '/agent-metrics/agents/status',
    PERFORMANCE: '/agent-metrics/performance',
    EXECUTE: '/ai/agents/:agentName/execute',
    QUALIFY_LEAD: '/ai/qualify-lead',
    RESEARCH_COMPANY: '/ai/research-company',
    GENERATE: '/ai/generate',
    EXECUTIONS: '/ai/executions',
  },
  
  // Leads
  LEADS: {
    LIST: '/leads',
    DETAILS: '/leads/:id',
    QUALIFY: '/ai/qualify-lead',
    GENERATE: '/ai/leads/generate',
  },
  
  // CRM
  CRM: {
    CONTACTS: '/crm-connect/contacts',
    OPPORTUNITIES: '/crm-connect/opportunities',
    ACCOUNTS: '/crm-connect/accounts',
    SYNC: '/crm-connect/sync',
    CONNECTIONS: '/crm-connect/connections',
    HEALTH: '/crm-connect/health',
  },
  
  // Users
  USERS: {
    PROFILE: '/users/:userId',
    PREFERENCES: '/users/:userId/preferences',
    UPDATE: '/users/:userId',
  },
  
  // Analytics
  ANALYTICS: {
    REVENUE: '/revenue/metrics',
    PIPELINE: '/revenue/pipeline',
    FORECAST: '/revenue/forecast',
  },
  
  // Health
  HEALTH: {
    CHECK: '/health',
    STATUS: '/status',
  },
};

// Headers configuration
export const getHeaders = (token?: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};
