const authService = require('./auth.service');

const COOKIE_OPTIONS = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge,
});

/**
 * @desc    Login user & get token cookie
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password, remember } = req.body;
    const result = await authService.loginUser({ email, password, remember: !!remember });

    res.cookie('token', result.token, COOKIE_OPTIONS(result.cookieMaxAge));

    return res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
      permissions: result.permissions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return res.status(200).json({
    message: 'Logged out successfully',
  });
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const ownProfile = await authService.formatOwnProfile(req.user);
    return res.status(200).json({
      user: ownProfile,
      permissions: ownProfile.permissions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password
 * @route   PATCH /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword({
      userId: req.user._id,
      currentPassword,
      newPassword,
    });

    res.cookie('token', result.token, COOKIE_OPTIONS(result.cookieMaxAge));

    return res.status(200).json({
      message: 'Password changed successfully',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  getMe,
  changePassword,
};
