/**
 * Helper to determine if a user has admin-like privileges
 * Admin-like: user.role === 'admin' || user.showDashboard === true
 * @param {Object} user 
 * @returns {boolean}
 */
const isAdminLike = (user) => {
  if (!user) return false;
  return user.role === 'admin' || user.showDashboard === true;
};

/**
 * Helper to compute client-facing permissions object
 * @param {Object} user 
 * @returns {{ isAdminLike: boolean, isCoordinator: boolean }}
 */
const getUserPermissions = (user) => {
  if (!user) {
    return { isAdminLike: false, isCoordinator: false };
  }
  return {
    isAdminLike: isAdminLike(user),
    isCoordinator: user.role === 'coordinator',
  };
};

module.exports = {
  isAdminLike,
  getUserPermissions,
};
