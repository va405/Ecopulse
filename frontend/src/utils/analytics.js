// Performance monitoring and analytics

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      apiCalls: [],
      errors: [],
      userActions: []
    };
  }

  // Track page load performance
  trackPageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      this.metrics.pageLoadTime = pageLoadTime;
      
      return {
        pageLoadTime,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
        resourcesLoaded: perfData.loadEventEnd - perfData.domContentLoadedEventEnd,
        dns: perfData.domainLookupEnd - perfData.domainLookupStart,
        tcp: perfData.connectEnd - perfData.connectStart,
        ttfb: perfData.responseStart - perfData.requestStart
      };
    }
    return null;
  }

  // Track API call performance
  trackAPICall(endpoint, duration, success) {
    this.metrics.apiCalls.push({
      endpoint,
      duration,
      success,
      timestamp: Date.now()
    });

    // Keep only last 50 calls
    if (this.metrics.apiCalls.length > 50) {
      this.metrics.apiCalls.shift();
    }
  }

  // Track errors
  trackError(error, context) {
    this.metrics.errors.push({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    });

    console.error('Error tracked:', error, context);
  }

  // Track user actions
  trackUserAction(action, details) {
    this.metrics.userActions.push({
      action,
      details,
      timestamp: Date.now()
    });

    // Keep only last 100 actions
    if (this.metrics.userActions.length > 100) {
      this.metrics.userActions.shift();
    }
  }

  // Get performance report
  getReport() {
    const avgApiTime = this.metrics.apiCalls.length > 0
      ? this.metrics.apiCalls.reduce((sum, call) => sum + call.duration, 0) / this.metrics.apiCalls.length
      : 0;

    const successRate = this.metrics.apiCalls.length > 0
      ? (this.metrics.apiCalls.filter(call => call.success).length / this.metrics.apiCalls.length) * 100
      : 100;

    return {
      pageLoadTime: this.metrics.pageLoadTime,
      totalAPICalls: this.metrics.apiCalls.length,
      avgAPITime: avgApiTime.toFixed(2),
      apiSuccessRate: successRate.toFixed(2),
      totalErrors: this.metrics.errors.length,
      totalUserActions: this.metrics.userActions.length,
      recentErrors: this.metrics.errors.slice(-5),
      recentActions: this.metrics.userActions.slice(-10)
    };
  }

  // Clear metrics
  clear() {
    this.metrics = {
      pageLoadTime: 0,
      apiCalls: [],
      errors: [],
      userActions: []
    };
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Track page visibility
export const trackPageVisibility = (callback) => {
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      callback(document.hidden ? 'hidden' : 'visible');
    });
  }
};

// Track network status
export const trackNetworkStatus = (callback) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => callback('online'));
    window.addEventListener('offline', () => callback('offline'));
  }
};

// Measure component render time
export const measureRenderTime = (componentName, callback) => {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  const renderTime = endTime - startTime;
  
  performanceMonitor.trackUserAction('component_render', {
    component: componentName,
    renderTime: renderTime.toFixed(2)
  });
  
  return renderTime;
};

// Track user engagement
export const trackEngagement = () => {
  let startTime = Date.now();
  let isActive = true;

  const calculateEngagementTime = () => {
    if (isActive) {
      return Date.now() - startTime;
    }
    return 0;
  };

  // Track when user leaves/returns
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isActive = false;
      performanceMonitor.trackUserAction('page_blur', {
        engagementTime: calculateEngagementTime()
      });
    } else {
      isActive = true;
      startTime = Date.now();
    }
  });

  // Track before unload
  window.addEventListener('beforeunload', () => {
    performanceMonitor.trackUserAction('page_unload', {
      totalEngagementTime: calculateEngagementTime()
    });
  });

  return {
    getEngagementTime: calculateEngagementTime
  };
};

// Initialize analytics
export const initAnalytics = () => {
  // Track page load
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const perfMetrics = performanceMonitor.trackPageLoad();
      // Performance metrics tracked for monitoring
    });
  }

  // Track engagement
  trackEngagement();

  // Track network status
  trackNetworkStatus((status) => {
    performanceMonitor.trackUserAction('network_status', { status });
  });

  // Track page visibility
  trackPageVisibility((status) => {
    performanceMonitor.trackUserAction('page_visibility', { status });
  });

  // Global error handler
  window.addEventListener('error', (event) => {
    performanceMonitor.trackError(event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    performanceMonitor.trackError(new Error(event.reason), {
      type: 'unhandled_promise_rejection'
    });
  });
};

export default performanceMonitor;
