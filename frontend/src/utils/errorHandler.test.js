/**
 * Comprehensive Unit Tests for Error Handler Module
 * 
 * Tests all error handling functions, error parsing, logging,
 * retry logic, and edge cases.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ErrorTypes,
  AppError,
  parseAPIError,
  logError,
  getUserMessage,
  asyncHandler,
  retryWithBackoff,
  handleReactError,
  formatValidationErrors,
  isRecoverable,
  createErrorNotification,
} from './errorHandler';

describe('ErrorTypes', () => {
  it('should have all error type constants', () => {
    expect(ErrorTypes.NETWORK).toBe('NETWORK_ERROR');
    expect(ErrorTypes.VALIDATION).toBe('VALIDATION_ERROR');
    expect(ErrorTypes.AUTH).toBe('AUTHENTICATION_ERROR');
    expect(ErrorTypes.PERMISSION).toBe('PERMISSION_ERROR');
    expect(ErrorTypes.NOT_FOUND).toBe('NOT_FOUND_ERROR');
    expect(ErrorTypes.SERVER).toBe('SERVER_ERROR');
    expect(ErrorTypes.UNKNOWN).toBe('UNKNOWN_ERROR');
  });
});

describe('AppError', () => {
  it('should create error with all properties', () => {
    const error = new AppError('Test error', ErrorTypes.NETWORK, 500, { key: 'value' });
    
    expect(error.message).toBe('Test error');
    expect(error.type).toBe(ErrorTypes.NETWORK);
    expect(error.statusCode).toBe(500);
    expect(error.details).toEqual({ key: 'value' });
    expect(error.timestamp).toBeDefined();
    expect(error.name).toBe('AppError');
  });

  it('should use default values when not provided', () => {
    const error = new AppError('Test error');
    
    expect(error.type).toBe(ErrorTypes.UNKNOWN);
    expect(error.statusCode).toBe(500);
    expect(error.details).toEqual({});
  });

  it('should capture timestamp as ISO string', () => {
    const error = new AppError('Test');
    const timestamp = new Date(error.timestamp);
    
    expect(timestamp).toBeInstanceOf(Date);
    expect(isNaN(timestamp.getTime())).toBe(false);
  });
});

describe('parseAPIError', () => {
  it('should parse network error (no response)', () => {
    const error = { message: 'Network failed' };
    const result = parseAPIError(error);
    
    expect(result).toBeInstanceOf(AppError);
    expect(result.type).toBe(ErrorTypes.NETWORK);
    expect(result.statusCode).toBe(0);
    expect(result.message).toContain('Network error');
  });

  it('should parse 400 Bad Request', () => {
    const error = {
      response: {
        status: 400,
        data: { detail: 'Invalid input' }
      }
    };
    const result = parseAPIError(error);
    
    expect(result.type).toBe(ErrorTypes.VALIDATION);
    expect(result.statusCode).toBe(400);
    expect(result.message).toBe('Invalid input');
  });

  it('should parse 401 Unauthorized', () => {
    const error = {
      response: {
        status: 401,
        data: {}
      }
    };
    const result = parseAPIError(error);
    
    expect(result.type).toBe(ErrorTypes.AUTH);
    expect(result.statusCode).toBe(401);
    expect(result.message).toContain('log in');
  });

  it('should parse 403 Forbidden', () => {
    const error = {
      response: {
        status: 403,
        data: {}
      }
    };
    const result = parseAPIError(error);
    
    expect(result.type).toBe(ErrorTypes.PERMISSION);
    expect(result.statusCode).toBe(403);
  });

  it('should parse 404 Not Found', () => {
    const error = {
      response: {
        status: 404,
        data: {}
      }
    };
    const result = parseAPIError(error);
    
    expect(result.type).toBe(ErrorTypes.NOT_FOUND);
    expect(result.statusCode).toBe(404);
  });

  it('should parse 429 Too Many Requests', () => {
    const error = {
      response: {
        status: 429,
        data: {}
      }
    };
    const result = parseAPIError(error);
    
    expect(result.type).toBe(ErrorTypes.NETWORK);
    expect(result.statusCode).toBe(429);
    expect(result.message).toContain('Too many requests');
  });

  it('should parse 500 Server Error', () => {
    const error = {
      response: {
        status: 500,
        data: {}
      }
    };
    const result = parseAPIError(error);
    
    expect(result.type).toBe(ErrorTypes.SERVER);
    expect(result.statusCode).toBe(500);
  });

  it('should parse 502 Bad Gateway', () => {
    const error = {
      response: {
        status: 502,
        data: {}
      }
    };
    const result = parseAPIError(error);
    
    expect(result.type).toBe(ErrorTypes.SERVER);
    expect(result.statusCode).toBe(502);
  });

  it('should parse 503 Service Unavailable', () => {
    const error = {
      response: {
        status: 503,
        data: {}
      }
    };
    const result = parseAPIError(error);
    
    expect(result.type).toBe(ErrorTypes.SERVER);
    expect(result.statusCode).toBe(503);
  });

  it('should parse unknown status code', () => {
    const error = {
      response: {
        status: 418,
        data: { detail: 'I am a teapot' }
      }
    };
    const result = parseAPIError(error);
    
    expect(result.type).toBe(ErrorTypes.UNKNOWN);
    expect(result.statusCode).toBe(418);
  });

  it('should use fallback message when detail missing', () => {
    const error = {
      response: {
        status: 400,
        data: {}
      }
    };
    const result = parseAPIError(error);
    
    expect(result.message).toBe('Invalid request');
  });
});

describe('logError', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should log error in development', () => {
    const error = new AppError('Test error', ErrorTypes.NETWORK);
    logError(error, { userId: '123' });
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    const loggedData = consoleErrorSpy.mock.calls[0][1];
    expect(loggedData.message).toBe('Test error');
    expect(loggedData.type).toBe(ErrorTypes.NETWORK);
  });

  it('should include context in log', () => {
    const error = new Error('Test');
    const context = { action: 'test_action', userId: '456' };
    logError(error, context);
    
    const loggedData = consoleErrorSpy.mock.calls[0][1];
    expect(loggedData.context).toEqual(context);
  });

  it('should include timestamp in log', () => {
    const error = new Error('Test');
    logError(error);
    
    const loggedData = consoleErrorSpy.mock.calls[0][1];
    expect(loggedData.timestamp).toBeDefined();
  });

  it('should not log in production', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Test');
    logError(error);
    
    // In production, would send to external service instead
    // For now, just verify console.error not called
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});

describe('getUserMessage', () => {
  it('should return message from AppError', () => {
    const error = new AppError('Custom message', ErrorTypes.NETWORK);
    expect(getUserMessage(error)).toBe('Custom message');
  });

  it('should return default message for standard Error', () => {
    const error = new Error('Technical error');
    const message = getUserMessage(error);
    expect(message).toContain('unexpected error');
  });

  it('should return friendly message for network errors', () => {
    const error = new AppError('', ErrorTypes.NETWORK);
    const message = getUserMessage(error);
    expect(message).toContain('internet connection');
  });

  it('should return friendly message for auth errors', () => {
    const error = new AppError('', ErrorTypes.AUTH);
    const message = getUserMessage(error);
    expect(message).toContain('log in');
  });

  it('should return friendly message for permission errors', () => {
    const error = new AppError('', ErrorTypes.PERMISSION);
    const message = getUserMessage(error);
    expect(message).toContain('permission');
  });
});

describe('asyncHandler', () => {
  it('should execute function successfully', async () => {
    const fn = async () => 'success';
    const wrapped = asyncHandler(fn);
    
    const result = await wrapped();
    expect(result).toBe('success');
  });

  it('should catch and parse errors', async () => {
    const error = {
      response: { status: 400, data: { detail: 'Bad request' } }
    };
    const fn = async () => { throw error; };
    const wrapped = asyncHandler(fn);
    
    await expect(wrapped()).rejects.toThrow(AppError);
  });

  it('should pass arguments to wrapped function', async () => {
    const fn = async (a, b) => a + b;
    const wrapped = asyncHandler(fn);
    
    const result = await wrapped(2, 3);
    expect(result).toBe(5);
  });

  it('should log error before throwing', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    process.env.NODE_ENV = 'development';
    
    const error = { response: { status: 500, data: {} } };
    const fn = async () => { throw error; };
    const wrapped = asyncHandler(fn);
    
    try {
      await wrapped();
    } catch (e) {
      expect(consoleErrorSpy).toHaveBeenCalled();
    }
    
    consoleErrorSpy.mockRestore();
  });
});

describe('retryWithBackoff', () => {
  it('should succeed on first try', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await retryWithBackoff(fn, 3, 100);
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on server errors', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new AppError('Error', ErrorTypes.SERVER, 500))
      .mockResolvedValue('success');
    
    const result = await retryWithBackoff(fn, 3, 10);
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should not retry on client errors', async () => {
    const fn = vi.fn()
      .mockRejectedValue(new AppError('Error', ErrorTypes.VALIDATION, 400));
    
    await expect(retryWithBackoff(fn, 3, 10)).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should throw after max retries', async () => {
    const fn = vi.fn()
      .mockRejectedValue(new AppError('Error', ErrorTypes.SERVER, 500));
    
    await expect(retryWithBackoff(fn, 3, 10)).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should use exponential backoff', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new AppError('Error', ErrorTypes.SERVER, 500))
      .mockRejectedValueOnce(new AppError('Error', ErrorTypes.SERVER, 500))
      .mockResolvedValue('success');
    
    const start = Date.now();
    await retryWithBackoff(fn, 3, 100);
    const duration = Date.now() - start;
    
    // Should wait at least 100ms + 200ms = 300ms
    expect(duration).toBeGreaterThanOrEqual(200);
  });
});

describe('handleReactError', () => {
  it('should format React error details', () => {
    const error = new Error('React component error');
    const errorInfo = {
      componentStack: '\n    at Component (Component.js:10)\n    at div'
    };
    
    const result = handleReactError(error, errorInfo);
    
    expect(result.message).toBe('React component error');
    expect(result.componentStack).toBeDefined();
    expect(result.timestamp).toBeDefined();
  });

  it('should include error stack', () => {
    const error = new Error('Test');
    const errorInfo = { componentStack: 'stack' };
    
    const result = handleReactError(error, errorInfo);
    
    expect(result.stack).toBeDefined();
  });
});

describe('formatValidationErrors', () => {
  it('should format array of errors', () => {
    const errors = ['Error 1', 'Error 2', 'Error 3'];
    const result = formatValidationErrors(errors);
    
    expect(result).toBe('Error 1. Error 2. Error 3');
  });

  it('should format object of errors', () => {
    const errors = {
      email: 'Invalid email',
      password: 'Too short'
    };
    const result = formatValidationErrors(errors);
    
    expect(result).toContain('email: Invalid email');
    expect(result).toContain('password: Too short');
  });

  it('should convert string errors', () => {
    const errors = 'Single error message';
    const result = formatValidationErrors(errors);
    
    expect(result).toBe('Single error message');
  });

  it('should handle empty array', () => {
    const errors = [];
    const result = formatValidationErrors(errors);
    
    expect(result).toBe('');
  });

  it('should handle empty object', () => {
    const errors = {};
    const result = formatValidationErrors(errors);
    
    expect(result).toBe('');
  });
});

describe('isRecoverable', () => {
  it('should return true for network errors', () => {
    const error = new AppError('Network error', ErrorTypes.NETWORK);
    expect(isRecoverable(error)).toBe(true);
  });

  it('should return true for validation errors', () => {
    const error = new AppError('Validation error', ErrorTypes.VALIDATION);
    expect(isRecoverable(error)).toBe(true);
  });

  it('should return false for auth errors', () => {
    const error = new AppError('Auth error', ErrorTypes.AUTH);
    expect(isRecoverable(error)).toBe(false);
  });

  it('should return false for server errors', () => {
    const error = new AppError('Server error', ErrorTypes.SERVER);
    expect(isRecoverable(error)).toBe(false);
  });

  it('should return false for standard Error', () => {
    const error = new Error('Standard error');
    expect(isRecoverable(error)).toBe(false);
  });
});

describe('createErrorNotification', () => {
  it('should create notification object', () => {
    const error = new AppError('Test error', ErrorTypes.NETWORK);
    const notification = createErrorNotification(error);
    
    expect(notification.type).toBe('error');
    expect(notification.title).toBe('Error');
    expect(notification.message).toBeDefined();
    expect(notification.duration).toBe(5000);
  });

  it('should include retry action for recoverable errors', () => {
    const error = new AppError('Network error', ErrorTypes.NETWORK);
    const notification = createErrorNotification(error);
    
    expect(notification.action).not.toBeNull();
    expect(notification.action.label).toBe('Retry');
  });

  it('should not include action for non-recoverable errors', () => {
    const error = new AppError('Server error', ErrorTypes.SERVER);
    const notification = createErrorNotification(error);
    
    expect(notification.action).toBeNull();
  });

  it('should use user-friendly message', () => {
    const error = new AppError('Custom message', ErrorTypes.VALIDATION);
    const notification = createErrorNotification(error);
    
    expect(notification.message).toBe('Custom message');
  });
});

describe('Edge Cases', () => {
  it('should handle null error', () => {
    const result = getUserMessage(null);
    expect(result).toContain('unexpected error');
  });

  it('should handle undefined error', () => {
    const result = getUserMessage(undefined);
    expect(result).toContain('unexpected error');
  });

  it('should handle error without message', () => {
    const error = new Error();
    const result = getUserMessage(error);
    expect(result).toBeDefined();
  });

  it('should handle very long error messages', () => {
    const longMessage = 'A'.repeat(10000);
    const error = new AppError(longMessage, ErrorTypes.UNKNOWN);
    expect(error.message).toBe(longMessage);
  });

  it('should handle special characters in error messages', () => {
    const message = 'Error with <script>alert("xss")</script> and émojis 🚨';
    const error = new AppError(message);
    expect(error.message).toBe(message);
  });

  it('should handle circular references in details', () => {
    const details = { key: 'value' };
    details.self = details; // Circular reference
    
    const error = new AppError('Test', ErrorTypes.UNKNOWN, 500, details);
    expect(error.details).toBe(details);
  });
});

describe('Performance Tests', () => {
  it('should handle rapid error creation', () => {
    const start = Date.now();
    
    for (let i = 0; i < 1000; i++) {
      new AppError(`Error ${i}`, ErrorTypes.NETWORK);
    }
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100); // Should complete in < 100ms
  });

  it('should handle rapid parseAPIError calls', () => {
    const error = {
      response: { status: 400, data: { detail: 'Error' } }
    };
    
    const start = Date.now();
    
    for (let i = 0; i < 1000; i++) {
      parseAPIError(error);
    }
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });
});
