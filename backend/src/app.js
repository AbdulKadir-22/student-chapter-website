const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const authRoutes = require('./features/auth/auth.routes');
const userRoutes = require('./features/users/user.routes');
const adminRoutes = require('./features/admin/admin.routes');
const eventRoutes = require('./features/events/event.routes');
const errorHandler = require('./shared/middleware/error.middleware');

const createApp = () => {
  const app = express();

  // Security headers
  app.use(helmet());

  // Cross-origin resource sharing with credentials
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    })
  );

  // Cookie parser
  app.use(cookieParser());

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check route
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Feature Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/events', eventRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
