/**
 * Custom AppError class for handling all application errors
 * Extends Error to maintain stack trace and add custom properties
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a validation error
   */
  static validationError(errors) {
    const error = new AppError('Validation error', 400);
    error.errors = errors;
    return error;
  }

  /**
   * Create a cast/invalid ID error
   */
  static castError() {
    return new AppError('Invalid ID format', 400);
  }

  /**
   * Create a duplicate field error
   */
  static duplicateFieldError(field) {
    return new AppError(`Duplicate field value: ${field}`, 400);
  }

  /**
   * Create an invalid token error
   */
  static invalidTokenError() {
    return new AppError('Invalid token', 401);
  }

  /**
   * Create a token expired error
   */
  static tokenExpiredError() {
    return new AppError('Token expired', 401);
  }

  /**
   * Create a not found error
   */
  static notFoundError(resource = 'Resource') {
    return new AppError(`${resource} not found`, 404);
  }

  /**
   * Create an unauthorized error
   */
  static unauthorizedError(message = 'Unauthorized access') {
    return new AppError(message, 401);
  }

  /**
   * Create a forbidden error
   */
  static forbiddenError(message = 'Forbidden access') {
    return new AppError(message, 403);
  }

  /**
   * Create a server error
   */
  static internalServerError(message = 'Internal server error') {
    return new AppError(message, 500);
  }
}

export default AppError;
