const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validation');
const { authRateLimit } = require('../middleware/auth');
const {
  registerSchema,
  loginSchema,
  passwordResetSchema,
  newPasswordSchema
} = require('../middleware/validation');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth API is working' });
});

// Authentication routes
router.post('/register', 
  authRateLimit,
  validate(registerSchema),
  authController.register
);

router.post('/login', 
  authRateLimit,
  validate(loginSchema),
  authController.login
);

router.post('/refresh-token', 
  authController.refreshToken
);

router.post('/logout', 
  authController.logout
);

// Email verification
router.get('/verify-email/:token', 
  authController.verifyEmail
);

// Password reset
router.post('/forgot-password', 
  authRateLimit,
  validate(passwordResetSchema),
  authController.forgotPassword
);

router.post('/reset-password', 
  authRateLimit,
  validate(newPasswordSchema),
  authController.resetPassword
);

module.exports = router;
