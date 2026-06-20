/**
 * Edge Case Tests for Analytics Utilities
 * Comprehensive testing of boundary conditions and error scenarios
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { performanceMonitor } from './analytics';

describe('Analytics Edge Cases', () => {
  beforeEach(() => {
    performanceMonitor.clear();
  });

  afterEach(() => {
    performanceMonitor.clear();
  });

  describe('Zero and Empty Values', () => {
    it('should handle zero page load time', () => {
      const report = performanceMonitor.getReport();
      expect(report.pageLoadTime).toBe(0);
    });

    it('should handle empty API calls array', () => {
      const report = performanceMonitor.getReport();
      expect(report.totalAPICalls).toBe(0);
      expect(report.avgAPITime).toBe('0.00');
      expect(report.apiSuccessRate).toBe('100.00');
    });

    it('should handle empty errors array', () => {
      const report = performanceMonitor.getReport();
      expect(report.totalErrors).toBe(0);
      expect(report.recentErrors).toEqual([]);
    });

    it('should handle empty user actions array', () => {
      const report = performanceMonitor.getReport();
      expect(report.totalUserActions).toBe(0);
      expect(report.recentActions).toEqual([]);
    });
  });

  describe('Negative Values', () => {
    it('should handle negative duration gracefully', () => {
      performanceMonitor.trackAPICall('/api/test', -100, true);
      const report = performanceMonitor.getReport();
      expect(report.avgAPITime).toBe('-100.00');
    });

    it('should track errors with negative timestamps', () => {
      const error = new Error('Test error');
      performanceMonitor.trackError(error, { timestamp: -1 });
      const report = performanceMonitor.getReport();
      expect(report.totalErrors).toBe(1);
    });
  });

  describe('Very Large Values', () => {
    it('should handle very large API duration', () => {
      performanceMonitor.trackAPICall('/api/slow', 999999999, true);
      const report = performanceMonitor.getReport();
      expect(parseFloat(report.avgAPITime)).toBe(999999999);
    });

    it('should handle very large page load time', () => {
      performanceMonitor.metrics.pageLoadTime = Number.MAX_SAFE_INTEGER;
      const report = performanceMonitor.getReport();
      expect(report.pageLoadTime).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should maintain array size limit with many API calls', () => {
      for (let i = 0; i < 100; i++) {
        performanceMonitor.trackAPICall(`/api/test${i}`, 100, true);
      }
      expect(performanceMonitor.metrics.apiCalls.length).toBe(50);
    });

    it('should maintain array size limit with many user actions', () => {
      for (let i = 0; i < 200; i++) {
        performanceMonitor.trackUserAction('click', { button: i });
      }
      expect(performanceMonitor.metrics.userActions.length).toBe(100);
    });
  });

  describe('Special Characters and Invalid Input', () => {
    it('should handle API endpoint with special characters', () => {
      performanceMonitor.trackAPICall('/api/<script>alert()</script>', 100, true);
      const report = performanceMonitor.getReport();
      expect(report.totalAPICalls).toBe(1);
    });

    it('should handle empty string endpoint', () => {
      performanceMonitor.trackAPICall('', 100, true);
      const report = performanceMonitor.getReport();
      expect(report.totalAPICalls).toBe(1);
    });

    it('should handle null/undefined in error tracking', () => {
      const error = new Error();
      error.message = null;
      error.stack = undefined;
      performanceMonitor.trackError(error, null);
      const report = performanceMonitor.getReport();
      expect(report.totalErrors).toBe(1);
    });

    it('should handle Unicode characters in user actions', () => {
      performanceMonitor.trackUserAction('🚀 rocket click', { emoji: '👍' });
      const report = performanceMonitor.getReport();
      expect(report.totalUserActions).toBe(1);
    });
  });

  describe('Boundary Conditions', () => {
    it('should handle exactly 50 API calls', () => {
      for (let i = 0; i < 50; i++) {
        performanceMonitor.trackAPICall(`/api/${i}`, 100, true);
      }
      expect(performanceMonitor.metrics.apiCalls.length).toBe(50);
    });

    it('should handle exactly 51 API calls (trigger overflow)', () => {
      for (let i = 0; i < 51; i++) {
        performanceMonitor.trackAPICall(`/api/${i}`, 100, true);
      }
      expect(performanceMonitor.metrics.apiCalls.length).toBe(50);
    });

    it('should handle exactly 100 user actions', () => {
      for (let i = 0; i < 100; i++) {
        performanceMonitor.trackUserAction('action', { id: i });
      }
      expect(performanceMonitor.metrics.userActions.length).toBe(100);
    });

    it('should handle exactly 101 user actions (trigger overflow)', () => {
      for (let i = 0; i < 101; i++) {
        performanceMonitor.trackUserAction('action', { id: i });
      }
      expect(performanceMonitor.metrics.userActions.length).toBe(100);
    });
  });

  describe('Success Rate Calculations', () => {
    it('should calculate 100% success rate with all successful calls', () => {
      for (let i = 0; i < 10; i++) {
        performanceMonitor.trackAPICall('/api/test', 100, true);
      }
      const report = performanceMonitor.getReport();
      expect(report.apiSuccessRate).toBe('100.00');
    });

    it('should calculate 0% success rate with all failed calls', () => {
      for (let i = 0; i < 10; i++) {
        performanceMonitor.trackAPICall('/api/test', 100, false);
      }
      const report = performanceMonitor.getReport();
      expect(report.apiSuccessRate).toBe('0.00');
    });

    it('should calculate 50% success rate with mixed calls', () => {
      for (let i = 0; i < 10; i++) {
        performanceMonitor.trackAPICall('/api/test', 100, i < 5);
      }
      const report = performanceMonitor.getReport();
      expect(report.apiSuccessRate).toBe('50.00');
    });

    it('should handle single API call success rate', () => {
      performanceMonitor.trackAPICall('/api/test', 100, true);
      const report = performanceMonitor.getReport();
      expect(report.apiSuccessRate).toBe('100.00');
    });
  });

  describe('Precision and Rounding', () => {
    it('should round average API time to 2 decimal places', () => {
      performanceMonitor.trackAPICall('/api/test1', 100.123, true);
      performanceMonitor.trackAPICall('/api/test2', 200.789, true);
      const report = performanceMonitor.getReport();
      expect(report.avgAPITime).toBe('150.46');
    });

    it('should round success rate to 2 decimal places', () => {
      performanceMonitor.trackAPICall('/api/test1', 100, true);
      performanceMonitor.trackAPICall('/api/test2', 100, true);
      performanceMonitor.trackAPICall('/api/test3', 100, false);
      const report = performanceMonitor.getReport();
      expect(report.apiSuccessRate).toBe('66.67');
    });
  });

  describe('Clear Functionality', () => {
    it('should clear all metrics', () => {
      performanceMonitor.trackAPICall('/api/test', 100, true);
      performanceMonitor.trackUserAction('click', {});
      performanceMonitor.trackError(new Error('test'), {});
      
      performanceMonitor.clear();
      
      const report = performanceMonitor.getReport();
      expect(report.totalAPICalls).toBe(0);
      expect(report.totalUserActions).toBe(0);
      expect(report.totalErrors).toBe(0);
      expect(report.pageLoadTime).toBe(0);
    });

    it('should allow tracking after clear', () => {
      performanceMonitor.trackAPICall('/api/test', 100, true);
      performanceMonitor.clear();
      performanceMonitor.trackAPICall('/api/test2', 200, true);
      
      const report = performanceMonitor.getReport();
      expect(report.totalAPICalls).toBe(1);
    });
  });

  describe('Recent Items Retrieval', () => {
    it('should return last 5 errors when more than 5 exist', () => {
      for (let i = 0; i < 10; i++) {
        performanceMonitor.trackError(new Error(`Error ${i}`), {});
      }
      const report = performanceMonitor.getReport();
      expect(report.recentErrors.length).toBe(5);
      expect(report.recentErrors[0].message).toBe('Error 5');
    });

    it('should return all errors when less than 5 exist', () => {
      for (let i = 0; i < 3; i++) {
        performanceMonitor.trackError(new Error(`Error ${i}`), {});
      }
      const report = performanceMonitor.getReport();
      expect(report.recentErrors.length).toBe(3);
    });

    it('should return last 10 actions when more than 10 exist', () => {
      for (let i = 0; i < 20; i++) {
        performanceMonitor.trackUserAction('action', { id: i });
      }
      const report = performanceMonitor.getReport();
      expect(report.recentActions.length).toBe(10);
    });
  });

  describe('Performance Under Load', () => {
    it('should complete 1000 API tracking operations quickly', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        performanceMonitor.trackAPICall('/api/test', 100, true);
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100); // Should complete in < 100ms
    });

    it('should complete 1000 error tracking operations quickly', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        performanceMonitor.trackError(new Error('test'), {});
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100); // Should complete in < 100ms
    });
  });
});
