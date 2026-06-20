/**
 * Application Constants
 * Centralized constants for better maintainability
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
}

// Carbon Emission Factors (kg CO2 per unit)
export const EMISSION_FACTORS = {
  TRANSPORTATION: {
    CAR_PER_KM: 0.12,
    BUS_PER_KM: 0.05,
    TRAIN_PER_KM: 0.03,
    FLIGHT_SHORT: 90, // < 1500km
    FLIGHT_LONG: 150, // > 1500km
    BIKE_PER_KM: 0,
    WALK_PER_KM: 0,
  },
  ENERGY: {
    ELECTRICITY_PER_KWH: 0.5,
    NATURAL_GAS_PER_KWH: 0.2,
    HEATING_OIL_PER_LITER: 2.7,
    COAL_PER_KG: 2.4,
  },
  FOOD: {
    BEEF_PER_KG: 27,
    PORK_PER_KG: 12,
    CHICKEN_PER_KG: 6.9,
    FISH_PER_KG: 5.4,
    DAIRY_PER_LITER: 1.9,
    VEGETABLES_PER_KG: 2.0,
    LOCAL_DISCOUNT: 0.8, // 20% reduction for local food
  },
  WASTE: {
    GENERAL_PER_KG: 0.5,
    RECYCLING_OFFSET: 0.3,
  },
}

// Validation Limits
export const VALIDATION_LIMITS = {
  CARBON: {
    MIN: 0,
    MAX: 100000,
  },
  TRANSPORTATION_KM: {
    MIN: 0,
    MAX: 10000,
  },
  ENERGY_KWH: {
    MIN: 0,
    MAX: 10000,
  },
  FOOD_SERVINGS: {
    MIN: 0,
    MAX: 100,
  },
  WASTE_KG: {
    MIN: 0,
    MAX: 1000,
  },
}

// Carbon Footprint Benchmarks (kg CO2 per month)
export const CARBON_BENCHMARKS = {
  GLOBAL_AVERAGE: 350,
  NATIONAL_AVERAGE: 310,
  SUSTAINABLE_TARGET: 200,
  TOP_10_PERCENT: 150,
  NET_ZERO: 0,
}

// Trees Required to Offset Carbon
export const TREES_PER_TON = 48 // trees needed to absorb 1 ton CO2 per year
export const KG_PER_TREE_YEAR = 21 // kg CO2 absorbed by one tree per year

// User Levels and XP
export const USER_LEVELS = {
  1: { xp: 0, title: 'Eco Beginner', badge: '🌱' },
  2: { xp: 100, title: 'Carbon Aware', badge: '🌿' },
  3: { xp: 300, title: 'Green Warrior', badge: '🌳' },
  4: { xp: 600, title: 'Eco Champion', badge: '🏆' },
  5: { xp: 1000, title: 'Climate Hero', badge: '🦸' },
  6: { xp: 1500, title: 'Planet Guardian', badge: '🌍' },
  7: { xp: 2500, title: 'Sustainability Master', badge: '👑' },
}

// Achievement Badges
export const ACHIEVEMENTS = {
  FIRST_CALCULATION: { id: 'first_calc', name: 'First Steps', icon: '👣', points: 50 },
  WEEK_STREAK: { id: 'week_streak', name: 'Week Warrior', icon: '🔥', points: 100 },
  MONTH_STREAK: { id: 'month_streak', name: 'Monthly Master', icon: '📅', points: 300 },
  REDUCED_50: { id: 'reduced_50', name: '50% Reduction', icon: '📉', points: 500 },
  ZERO_WASTE: { id: 'zero_waste', name: 'Zero Waste', icon: '♻️', points: 200 },
  TREE_PLANTER: { id: 'tree_planter', name: 'Tree Planter', icon: '🌲', points: 150 },
  PUBLIC_TRANSPORT: { id: 'public_transport', name: 'Public Hero', icon: '🚌', points: 100 },
  RENEWABLE_ENERGY: { id: 'renewable', name: 'Renewable Power', icon: '⚡', points: 250 },
}

// Challenge Types
export const CHALLENGE_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
}

// Challenge Difficulties
export const CHALLENGE_DIFFICULTY = {
  EASY: { multiplier: 1, color: '#10B981', icon: '⭐' },
  MEDIUM: { multiplier: 1.5, color: '#F59E0B', icon: '⭐⭐' },
  HARD: { multiplier: 2, color: '#EF4444', icon: '⭐⭐⭐' },
  EXPERT: { multiplier: 3, color: '#8B5CF6', icon: '👑' },
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
}

// localStorage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'gpa_auth_token',
  USER_DATA: 'gpa_user_data',
  THEME: 'gpa_theme',
  LANGUAGE: 'gpa_language',
  ONBOARDING_COMPLETE: 'gpa_onboarding',
  LAST_CALCULATION: 'gpa_last_calc',
}

// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  CARBON: {
    CALCULATE: '/api/calculate-impact',
    HISTORY: '/api/carbon-history',
    PREDICT: '/api/predict-impact',
    BENCHMARK: '/api/benchmark',
  },
  USER: {
    PROFILE: '/api/user/profile',
    STATS: '/api/user/stats',
    ACHIEVEMENTS: '/api/user/achievements',
  },
  CHALLENGES: {
    LIST: '/api/challenges',
    JOIN: '/api/challenges/join',
    COMPLETE: '/api/challenges/complete',
  },
  AI: {
    ADVISOR: '/api/ai-advisor',
    ADVANCED: '/api/ai-advisor-advanced',
  },
  ANALYTICS: '/api/analytics',
  DASHBOARD: '/api/dashboard',
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  CALCULATION_SAVED: 'Carbon footprint calculated successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  CHALLENGE_JOINED: 'Challenge joined successfully!',
  CHALLENGE_COMPLETED: 'Challenge completed! Points earned.',
  ACHIEVEMENT_UNLOCKED: 'Achievement unlocked!',
}

// Animation Durations (ms)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
}

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#F97316',    // Energetic Orange
  SECONDARY: '#EF4444',  // Vibrant Red
  ACCENT: '#F59E0B',     // Warm Amber
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#FDBA74',
  GRAY: '#6B7280',
}

// Breakpoints (px)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
}

// Feature Flags
export const FEATURES = {
  ENABLE_AI_ADVISOR: true,
  ENABLE_CHALLENGES: true,
  ENABLE_SOCIAL_SHARING: true,
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_EXPORT: true,
}

// Contact Information
export const CONTACT = {
  EMAIL: 'support@ecopulse.ai',
  TWITTER: '@ecopulse',
  GITHUB: '',
}

// App Metadata
export const APP_INFO = {
  NAME: 'EcoPulse',
  VERSION: '1.0.0',
  DESCRIPTION: 'EcoPulse - Carbon Intelligence Platform',
  COPYRIGHT: '© 2026 EcoPulse',
}

export default {
  API_CONFIG,
  EMISSION_FACTORS,
  VALIDATION_LIMITS,
  CARBON_BENCHMARKS,
  TREES_PER_TON,
  KG_PER_TREE_YEAR,
  USER_LEVELS,
  ACHIEVEMENTS,
  CHALLENGE_TYPES,
  CHALLENGE_DIFFICULTY,
  DATE_FORMATS,
  PAGINATION,
  STORAGE_KEYS,
  API_ENDPOINTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ANIMATION_DURATION,
  CHART_COLORS,
  BREAKPOINTS,
  FEATURES,
  CONTACT,
  APP_INFO,
}
