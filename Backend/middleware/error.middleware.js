import AppError from '../utils/errorHandler.js';

/**
 * Error handling middleware
 * Catches all errors from route handlers and sends appropriate responses
 * Must be placed after all other middleware and routes
 */
const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let isOperational = err.isOperational ?? true;

  // Handle MongoDB Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }

  // Handle MongoDB Cast Error (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Handle MongoDB Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value';
    const field = Object.keys(err.keyPattern)[0];
    return res.status(statusCode).json({
      success: false,
      message,
      field
    });
  }

  // Handle JWT Invalid Token Error
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  // Handle JWT Expired Token Error
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Don't send response if headers already sent
  if (res.headersSent) {
    return next(err);
  }

  // Send error response
  const errorResponse = {
    success: false,
    message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      name: err.name,
      isOperational 
    })
  };

  res.status(statusCode).json(errorResponse);
};

export default errorMiddleware;
