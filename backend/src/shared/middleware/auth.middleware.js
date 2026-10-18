const mongoose = require('mongoose');
const User = require('../../features/users/user.model');
const Event = require('../../features/events/event.model');
const { verifyToken } = require('../utils/jwt');
const { isAdminLike } = require('../utils/permissions');

/**
 * Protect middleware: Verifies JWT token from httpOnly cookie or Bearer header
 * and loads the user from the DB on every request.
 * Rejects immediately when isActive is false.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check cookies for 'token'
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      message: 'Not authorized, no token provided',
    });
  }

  try {
    const decoded = verifyToken(token);
    // Load fresh user from DB on every request so deactivation takes effect immediately
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: 'Not authorized, account is inactive or not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Not authorized, token invalid or expired',
    });
  }
};

/**
 * Optional authentication middleware:
 * Attaches user to req.user if a valid token exists, but never fails if unauthenticated.
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (user && user.isActive) {
      req.user = user;
    }
  } catch (err) {
    // Ignore invalid token in optionalAuth
  }

  next();
};

/**
 * Require admin-like privileges: role === 'admin' || showDashboard === true
 */
const requireAdminLike = (req, res, next) => {
  if (!req.user || !isAdminLike(req.user)) {
    return res.status(403).json({
      message: 'Forbidden: Admin access required',
    });
  }
  next();
};

/**
 * Require event access:
 * Loads event by req.params.id (or req.params.eventId).
 * Allows admin-like users, or coordinators whose id is in event.coordinators.
 * Otherwise returns 403 (or 404 for invalid/missing event).
 */
const requireEventAccess = async (req, res, next) => {
  const eventId = req.params.id || req.params.eventId;

  if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(404).json({
      message: 'Event not found',
    });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({
      message: 'Event not found',
    });
  }

  req.event = event;

  // 1. Admin-like always allowed
  if (isAdminLike(req.user)) {
    return next();
  }

  // 2. Coordinator assigned to this event
  const isAssigned = (event.coordinators || []).some(
    (coordId) => coordId.toString() === req.user._id.toString()
  );

  if (req.user.role === 'coordinator' && isAssigned) {
    return next();
  }

  return res.status(403).json({
    message: 'Forbidden: You are not assigned as a coordinator for this event',
  });
};

/**
 * Role-Based Access Control middleware: restrictTo(...roles)
 * @param  {...string} roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: role (${req.user?.role || 'Unknown'}) is not allowed`,
      });
    }
    next();
  };
};

module.exports = {
  protect,
  optionalAuth,
  requireAdminLike,
  requireEventAccess,
  restrictTo,
  authorizeRoles: restrictTo,
};
