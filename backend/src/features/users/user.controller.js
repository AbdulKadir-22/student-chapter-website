const userService = require('./user.service');
const User = require('./user.model');
const { formatOwnProfile } = require('../auth/auth.service');

/**
 * @desc    Get featured office bearers
 * @route   GET /api/users/featured
 * @access  Private
 */
const getFeatured = async (req, res, next) => {
  try {
    const featured = await userService.getFeaturedUsers();
    return res.status(200).json({
      data: featured,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get directory filters
 * @route   GET /api/users/filters
 * @access  Private
 */
const getFilters = async (req, res, next) => {
  try {
    const filters = await userService.getDirectoryFilters();
    return res.status(200).json({
      data: filters,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get member directory
 * @route   GET /api/users
 * @access  Private
 */
const getDirectory = async (req, res, next) => {
  try {
    const result = await userService.getDirectory(req.query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get own profile
 * @route   GET /api/users/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const profile = await formatOwnProfile(req.user);
    return res.status(200).json({
      user: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get own permanent ticket QR payload
 * @route   GET /api/users/me/ticket
 * @access  Private
 */
const getMyTicket = async (req, res, next) => {
  try {
    const userWithTicket = await User.findById(req.user._id).select('+ticketCode');
    if (!userWithTicket) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      ticketCode: userWithTicket.ticketCode,
      name: userWithTicket.name,
      year: userWithTicket.year,
      department: userWithTicket.department,
      memberSince: userWithTicket.joinedAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update own profile
 * @route   PATCH /api/users/me
 * @access  Private
 */
const updateMe = async (req, res, next) => {
  try {
    const updated = await userService.updateOwnProfile(req.user._id, req.body);
    return res.status(200).json({
      message: 'Profile updated successfully',
      user: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public member profile by ID
 * @route   GET /api/users/:id
 * @access  Public (Optional Auth)
 */
const getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAuthenticated = !!req.user;
    const profile = await userService.getProfileById(id, isAuthenticated);

    if (!profile) {
      return res.status(404).json({
        message: 'Member not found or inactive',
      });
    }

    return res.status(200).json({
      user: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's attended events history (paginated)
 * @route   GET /api/users/:id/events
 * @access  Public (Optional Auth)
 */
const getUserEvents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const result = await userService.getUserEvents(id, page, limit);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's coordinator roles (paginated)
 * @route   GET /api/users/:id/coordinator-roles
 * @access  Public (Optional Auth)
 */
const getUserCoordinatorRoles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const result = await userService.getUserCoordinatorRoles(id, page, limit);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeatured,
  getFilters,
  getDirectory,
  getMe,
  getMyTicket,
  updateMe,
  getProfileById,
  getUserEvents,
  getUserCoordinatorRoles,
};
