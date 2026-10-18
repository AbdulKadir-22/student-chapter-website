const express = require('express');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const { login, logout, getMe, changePassword } = require('./auth.controller');
const { protect } = require('../../shared/middleware/auth.middleware');
const validate = require('../../shared/middleware/validate.middleware');

const router = express.Router();

// Rate limiter for login: 10 attempts per 15 min per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
    remember: z.boolean().optional(),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        'Password must contain at least one letter and one number'
      ),
  }),
});

// Routes
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.patch(
  '/change-password',
  protect,
  validate(changePasswordSchema),
  changePassword
);

module.exports = router;
