/**
 * Application Constants Module
 * 
 * Centralized configuration for API endpoints, emission factors,
 * validation rules, and UI settings. All constants follow EPA 2024 
 * standards for carbon emission calculations.
 * 
 * @module constants
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * API configuration settings for backend communication
 * 
 * @constant
 * @type {Object}
 * @property {string} BASE_URL - API base endpoint URL (from environment or localhost)
 * @property {number} TIMEOUT - Request timeout in milliseconds (30s default)
 * @property {number} RETRY_ATTEMPTS - Number of retry attempts for failed requests
 * @property {number} RETRY_DELAY - Delay between retry attempts in milliseconds
 * 
 * @example
 * import { API_CONFIG } from './constants';
 * const response = await fetch(`${API_CONFIG.BASE_URL}/api/calculate`);
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
}

/**
 * Carbon emission factors following EPA 2024 standards
 * All values represent kg CO₂ equivalent per unit
 * 
 * @constant
 * @type {Object}
 * @property {Object} TRANSPORTATION - Transport emission factors (kg CO₂ per km or per trip)
 * @property {Object} ENERGY - Energy consumption emission factors (kg CO₂ per kWh or unit)
 * @property {Object} FOOD - Food production emission factors (kg CO₂ per kg or liter)
 * @property {Object} WASTE - Waste management emission factors (kg CO₂ per kg)
 * 
 * @example
 * const carEmissions = distance * EMISSION_FACTORS.TRANSPORTATION.CAR_PER_KM;
 */
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

/**
 * Validation limits for user input across all categories
 * Prevents invalid or unreasonable values in calculations
 * 
 * @constant
 * @type {Object}
 * @property {Object} CARBON - Total carbon footprint limits (kg CO₂)
 * @property {Object} TRANSPORTATION_KM - Distance traveled limits (kilometers)
 * @property {Object} ENERGY_KWH - Energy consumption limits (kilowatt-hours)
 * @property {Object} FOOD_SERVINGS - Food servings count limits
 * @property {Object} WASTE_KG - Waste amount limits (kilograms)
 * 
 * @example
 * if (value < VALIDATION_LIMITS.CARBON.MIN || value > VALIDATION_LIMITS.CARBON.MAX) {
 *   throw new Error('Invalid carbon value');
 * }
 */
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

/**
 * Carbon footprint benchmarks for comparison (kg CO₂ per month)
 * Based on EPA and global environmental research data
 * 
 * @constant
 * @type {Object}
 * @property {number} GLOBAL_AVERAGE - Average global carbon footprint per person per month
 * @property {number} NATIONAL_AVERAGE - US national average per person per month
 * @property {number} SUSTAINABLE_TARGET - Sustainable development goal target
 * @property {number} TOP_10_PERCENT - Top 10% eco-conscious individuals target
 * @property {number} NET_ZERO - Net-zero carbon target
 * 
 * @example
 * const rating = userEmissions < CARBON_BENCHMARKS.SUSTAINABLE_TARGET ? 'excellent' : 'needs improvement';
 */
export const CARBON_BENCHMARKS = {
  GLOBAL_AVERAGE: 350,
  NATIONAL_AVERAGE: 310,
  SUSTAINABLE_TARGET: 200,
  TOP_10_PERCENT: 150,
  NET_ZERO: 0,
}

/**
 * Number of trees required to offset one ton of CO₂ per year
 * Based on average tree absorption rates (EPA 2024)
 * 
 * @constant
 * @type {number}
 * @default 48
 * 
 * @example
 * const treesNeeded = (totalEmissionsKg / 1000) * TREES_PER_TON;
 */
export const TREES_PER_TON = 48 // trees needed to absorb 1 ton CO2 per year

/**
 * Amount of CO₂ (kg) absorbed by one tree per year
 * Used for calculating offset equivalencies
 * 
 * @constant
 * @type {number}
 * @default 21
 * 
 * @example
 * const carbonOffset = numberOfTrees * KG_PER_TREE_YEAR;
 */
export const KG_PER_TREE_YEAR = 21 // kg CO2 absorbed by one tree per year

/**
 * User progression levels with XP requirements and rewards
 * Gamification system to encourage sustainable behavior
 * 
 * @constant
 * @type {Object.<number, {xp: number, title: string, badge: string}>}
 * @property {Object} 1-7 - Level configurations with XP threshold, title, and badge emoji
 * 
 * @example
 * const currentLevel = Object.values(USER_LEVELS)
 *   .reverse()
 *   .find(level => userXP >= level.xp);
 * console.log(`You are a ${currentLevel.title} ${currentLevel.badge}`);
 */
export const USER_LEVELS = {
  1: { xp: 0, title: 'Eco Beginner', badge: '🌱' },
  2: { xp: 100, title: 'Carbon Aware', badge: '🌿' },
  3: { xp: 300, title: 'Green Warrior', badge: '🌳' },
  4: { xp: 600, title: 'Eco Champion', badge: '🏆' },
  5: { xp: 1000, title: 'Climate Hero', badge: '🦸' },
  6: { xp: 1500, title: 'Planet Guardian', badge: '🌍' },
  7: { xp: 2500, title: 'Sustainability Master', badge: '👑' },
}

/**
 * Achievement definitions for unlockable badges
 * Awarded for specific eco-friendly actions and milestones
 * 
 * @constant
 * @type {Object.<string, {id: string, name: string, icon: string, points: number}>}
 * @property {Object} FIRST_CALCULATION - First carbon footprint calculation
 * @property {Object} WEEK_STREAK - 7-day activity streak
 * @property {Object} MONTH_STREAK - 30-day activity streak
 * @property {Object} REDUCED_50 - 50% emissions reduction achievement
 * @property {Object} ZERO_WASTE - Zero waste week achievement
 * @property {Object} TREE_PLANTER - Tree planting contribution
 * @property {Object} PUBLIC_TRANSPORT - Public transport advocacy
 * @property {Object} RENEWABLE_ENERGY - Renewable energy adoption
 * 
 * @example
 * const badge = ACHIEVEMENTS.FIRST_CALCULATION;
 * console.log(`Unlocked: ${badge.name} ${badge.icon} (+${badge.points} points)`);
 */
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

/**
 * Challenge duration types for eco-action challenges
 * 
 * @constant
 * @type {Object.<string, string>}
 * @property {string} DAILY - 24-hour challenges
 * @property {string} WEEKLY - 7-day challenges
 * @property {string} MONTHLY - 30-day challenges
 * @property {string} CUSTOM - User-defined duration challenges
 * 
 * @example
 * const challenge = { type: CHALLENGE_TYPES.WEEKLY, goal: 'Reduce car usage by 50%' };
 */
export const CHALLENGE_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
}

/**
 * Challenge difficulty levels with point multipliers and visual styling
 * 
 * @constant
 * @type {Object.<string, {multiplier: number, color: string, icon: string}>}
 * @property {Object} EASY - 1x points, beginner-friendly
 * @property {Object} MEDIUM - 1.5x points, moderate commitment
 * @property {Object} HARD - 2x points, significant effort
 * @property {Object} EXPERT - 3x points, mastery-level challenges
 * 
 * @example
 * const points = basePoints * CHALLENGE_DIFFICULTY.HARD.multiplier;
 */
export const CHALLENGE_DIFFICULTY = {
  EASY: { multiplier: 1, color: '#10B981', icon: '⭐' },
  MEDIUM: { multiplier: 1.5, color: '#F59E0B', icon: '⭐⭐' },
  HARD: { multiplier: 2, color: '#EF4444', icon: '⭐⭐⭐' },
  EXPERT: { multiplier: 3, color: '#8B5CF6', icon: '👑' },
}

/**
 * Date formatting patterns for consistent date display
 * 
 * @constant
 * @type {Object.<string, string>}
 * @property {string} DISPLAY - Human-readable format (e.g., "Jan 15, 2024")
 * @property {string} API - ISO format for API communication (e.g., "2024-01-15")
 * @property {string} DATETIME - Full datetime format with seconds
 * @property {string} TIME - Time-only format (24-hour)
 * 
 * @example
 * import { format } from 'date-fns';
 * const displayDate = format(new Date(), DATE_FORMATS.DISPLAY);
 */
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm',
}

/**
 * Pagination configuration for list views
 * 
 * @constant
 * @type {Object}
 * @property {number} DEFAULT_PAGE_SIZE - Default number of items per page
 * @property {number} MAX_PAGE_SIZE - Maximum allowed items per page
 * @property {number[]} PAGE_SIZE_OPTIONS - Available page size options for user selection
 * 
 * @example
 * const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
}

/**
 * localStorage key constants for client-side data persistence
 * Prefixed with 'gpa_' to avoid naming conflicts
 * 
 * @constant
 * @type {Object.<string, string>}
 * @property {string} AUTH_TOKEN - JWT authentication token storage key
 * @property {string} USER_DATA - User profile data storage key
 * @property {string} THEME - UI theme preference (light/dark) storage key
 * @property {string} LANGUAGE - User language preference storage key
 * @property {string} ONBOARDING_COMPLETE - Onboarding completion flag storage key
 * @property {string} LAST_CALCULATION - Most recent calculation data storage key
 * 
 * @example
 * const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
 * localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'gpa_auth_token',
  USER_DATA: 'gpa_user_data',
  THEME: 'gpa_theme',
  LANGUAGE: 'gpa_language',
  ONBOARDING_COMPLETE: 'gpa_onboarding',
  LAST_CALCULATION: 'gpa_last_calc',
}

/**
 * API endpoint URLs for backend communication
 * Organized by feature domain for easy navigation
 * 
 * @constant
 * @type {Object}
 * @property {string} HEALTH - Health check endpoint
 * @property {Object} AUTH - Authentication endpoints (login, register, logout, refresh)
 * @property {Object} CARBON - Carbon calculation endpoints
 * @property {Object} USER - User profile and stats endpoints
 * @property {Object} CHALLENGES - Challenge management endpoints
 * @property {Object} AI - AI advisor endpoints
 * @property {string} ANALYTICS - Analytics data endpoint
 * @property {string} DASHBOARD - Dashboard summary endpoint
 * 
 * @example
 * const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CARBON.CALCULATE}`, {
 *   method: 'POST',
 *   body: JSON.stringify(data)
 * });
 */
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

/**
 * HTTP status code constants for response handling
 * Standard REST API status codes
 * 
 * @constant
 * @type {Object.<string, number>}
 * @property {number} OK - 200 Success
 * @property {number} CREATED - 201 Resource created
 * @property {number} NO_CONTENT - 204 Success with no response body
 * @property {number} BAD_REQUEST - 400 Invalid request
 * @property {number} UNAUTHORIZED - 401 Authentication required
 * @property {number} FORBIDDEN - 403 Access denied
 * @property {number} NOT_FOUND - 404 Resource not found
 * @property {number} CONFLICT - 409 Resource conflict
 * @property {number} TOO_MANY_REQUESTS - 429 Rate limit exceeded
 * @property {number} INTERNAL_ERROR - 500 Server error
 * @property {number} SERVICE_UNAVAILABLE - 503 Service unavailable
 * 
 * @example
 * if (response.status === HTTP_STATUS.UNAUTHORIZED) {
 *   redirectToLogin();
 * }
 */
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

/**
 * User-facing error messages for consistent error handling
 * Provides friendly, actionable error descriptions
 * 
 * @constant
 * @type {Object.<string, string>}
 * @property {string} NETWORK_ERROR - Network connectivity error message
 * @property {string} UNAUTHORIZED - Authentication required error message
 * @property {string} FORBIDDEN - Permission denied error message
 * @property {string} NOT_FOUND - Resource not found error message
 * @property {string} SERVER_ERROR - Server-side error message
 * @property {string} VALIDATION_ERROR - Input validation error message
 * @property {string} UNKNOWN_ERROR - Fallback error message
 * 
 * @example
 * catch (error) {
 *   showNotification(ERROR_MESSAGES.NETWORK_ERROR);
 * }
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
}

/**
 * User-facing success messages for positive feedback
 * Provides encouraging confirmation messages
 * 
 * @constant
 * @type {Object.<string, string>}
 * @property {string} CALCULATION_SAVED - Successful calculation message
 * @property {string} PROFILE_UPDATED - Profile update success message
 * @property {string} CHALLENGE_JOINED - Challenge join success message
 * @property {string} CHALLENGE_COMPLETED - Challenge completion success message
 * @property {string} ACHIEVEMENT_UNLOCKED - Achievement unlock success message
 * 
 * @example
 * showNotification(SUCCESS_MESSAGES.CHALLENGE_COMPLETED, 'success');
 */
export const SUCCESS_MESSAGES = {
  CALCULATION_SAVED: 'Carbon footprint calculated successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  CHALLENGE_JOINED: 'Challenge joined successfully!',
  CHALLENGE_COMPLETED: 'Challenge completed! Points earned.',
  ACHIEVEMENT_UNLOCKED: 'Achievement unlocked!',
}

/**
 * Animation duration constants for consistent UI transitions
 * All values in milliseconds
 * 
 * @constant
 * @type {Object.<string, number>}
 * @property {number} FAST - Quick transitions (200ms) for immediate feedback
 * @property {number} NORMAL - Standard transitions (300ms) for most UI changes
 * @property {number} SLOW - Deliberate transitions (500ms) for emphasis
 * @property {number} VERY_SLOW - Extended transitions (1000ms) for major changes
 * 
 * @example
 * const fadeOut = { transition: `opacity ${ANIMATION_DURATION.NORMAL}ms ease-in-out` };
 */
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
}

/**
 * Chart color palette for data visualizations
 * Warm, energetic color scheme (orange/red/amber theme)
 * 
 * @constant
 * @type {Object.<string, string>}
 * @property {string} PRIMARY - Energetic Orange (#F97316)
 * @property {string} SECONDARY - Vibrant Red (#EF4444)
 * @property {string} ACCENT - Warm Amber (#F59E0B)
 * @property {string} SUCCESS - Success green (#10B981)
 * @property {string} WARNING - Warning amber (#F59E0B)
 * @property {string} DANGER - Danger red (#EF4444)
 * @property {string} INFO - Info amber light (#FDBA74)
 * @property {string} GRAY - Neutral gray (#6B7280)
 * 
 * @example
 * const lineChart = {
 *   datasets: [{
 *     borderColor: CHART_COLORS.PRIMARY,
 *     backgroundColor: CHART_COLORS.ACCENT
 *   }]
 * };
 */
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

/**
 * Responsive design breakpoints (pixels)
 * Matches Tailwind CSS default breakpoints
 * 
 * @constant
 * @type {Object.<string, number>}
 * @property {number} SM - Small devices (640px+) - Large phones
 * @property {number} MD - Medium devices (768px+) - Tablets
 * @property {number} LG - Large devices (1024px+) - Laptops
 * @property {number} XL - Extra large devices (1280px+) - Desktops
 * @property {number} 2XL - 2X large devices (1536px+) - Large desktops
 * 
 * @example
 * if (window.innerWidth >= BREAKPOINTS.MD) {
 *   // Show desktop layout
 * }
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
}

/**
 * Feature flags for enabling/disabling application features
 * Allows runtime feature toggling without code changes
 * 
 * @constant
 * @type {Object.<string, boolean>}
 * @property {boolean} ENABLE_AI_ADVISOR - Toggle AI-powered recommendations
 * @property {boolean} ENABLE_CHALLENGES - Toggle gamification challenges
 * @property {boolean} ENABLE_SOCIAL_SHARING - Toggle social media sharing
 * @property {boolean} ENABLE_DARK_MODE - Toggle dark mode theme
 * @property {boolean} ENABLE_NOTIFICATIONS - Toggle push notifications
 * @property {boolean} ENABLE_ANALYTICS - Toggle analytics tracking
 * @property {boolean} ENABLE_EXPORT - Toggle data export functionality
 * 
 * @example
 * {FEATURES.ENABLE_AI_ADVISOR && <AIAdvisorButton />}
 */
export const FEATURES = {
  ENABLE_AI_ADVISOR: true,
  ENABLE_CHALLENGES: true,
  ENABLE_SOCIAL_SHARING: true,
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_EXPORT: true,
}

/**
 * Contact information for support and social channels
 * 
 * @constant
 * @type {Object.<string, string>}
 * @property {string} EMAIL - Support email address
 * @property {string} TWITTER - Twitter/X handle
 * @property {string} GITHUB - GitHub repository URL
 * 
 * @example
 * <a href={`mailto:${CONTACT.EMAIL}`}>Contact Support</a>
 */
export const CONTACT = {
  EMAIL: 'support@ecopulse.ai',
  TWITTER: '@ecopulse',
  GITHUB: '',
}

/**
 * Application metadata and versioning information
 * 
 * @constant
 * @type {Object}
 * @property {string} NAME - Application name
 * @property {string} VERSION - Semantic version number
 * @property {string} DESCRIPTION - Application description
 * @property {string} COPYRIGHT - Copyright notice
 * 
 * @example
 * <footer>{APP_INFO.COPYRIGHT} - v{APP_INFO.VERSION}</footer>
 */
export const APP_INFO = {
  NAME: 'EcoPulse',
  VERSION: '1.0.0',
  DESCRIPTION: 'EcoPulse - Carbon Intelligence Platform',
  COPYRIGHT: '© 2026 EcoPulse',
}

/**
 * Default export containing all application constants
 * Use named imports for better tree-shaking
 * 
 * @type {Object}
 * @exports default
 * 
 * @example
 * // Preferred: Named imports (better for tree-shaking)
 * import { API_CONFIG, EMISSION_FACTORS } from './constants';
 * 
 * // Alternative: Default import (imports everything)
 * import constants from './constants';
 * const apiUrl = constants.API_CONFIG.BASE_URL;
 */
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
