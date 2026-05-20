// ─────────────────────────────────────────────
//  middleware/errorHandler.js
//  Centralized error handling for all routes.
//  Express identifies this as an error handler
//  because it takes exactly 4 arguments.
//  Hardened to NEVER crash on Vercel serverless.
// ─────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  // Log every error that reaches here
  console.error('🔴 errorHandler caught:', err.message);
  console.error('🔴 errorHandler stack:', err.stack);

  // Guard: if headers are already sent, delegate to Express default
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message    = err.message || 'Internal Server Error';

  // ── Mongoose: Bad ObjectId (e.g. /api/vendors/not-valid-id)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message    = `Invalid ID format: ${err.value}`;
  }

  // ── Mongoose: Duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message    = `${field} already exists — please use a different value`;
  }

  // ── Mongoose: Validation errors (schema-level)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message    = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // ── JWT: Token errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message    = 'Invalid token — please log in again';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message    = 'Token expired — please log in again';
  }

  try {
    res.status(statusCode).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  } catch (resError) {
    // Last resort: if even res.json fails, log it
    console.error('🔴 errorHandler — res.json failed:', resError.message);
  }
};

module.exports = errorHandler;
