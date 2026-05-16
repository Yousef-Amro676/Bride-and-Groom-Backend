// ─────────────────────────────────────────────
//  middleware/validateMiddleware.js
//  Reusable express-validator helper.
//  Call this AFTER defining your validation rules
//  to collect all errors and return them at once.
// ─────────────────────────────────────────────

const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Return all validation errors in one response
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field:   e.path,
        message: e.msg,
      })),
    });
  }

  next();
};

module.exports = validate;
