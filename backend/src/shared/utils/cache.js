const NodeCache = require('node-cache');

// Default TTL: 300 seconds (5 minutes)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * Get cached value or compute and store it
 * @param {string} key 
 * @param {Function} fn 
 * @param {number} [ttl=300] 
 * @returns {Promise<any>}
 */
const getOrSet = async (key, fn, ttl = 300) => {
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const result = await fn();
  if (result !== undefined) {
    cache.set(key, result, ttl);
  }
  return result;
};

/**
 * Delete a specific key
 * @param {string} key 
 */
const del = (key) => {
  cache.del(key);
};

/**
 * Delete all keys matching a prefix
 * @param {string} prefix 
 */
const delByPrefix = (prefix) => {
  const keys = cache.keys();
  const keysToDelete = keys.filter((k) => k.startsWith(prefix));
  if (keysToDelete.length > 0) {
    cache.del(keysToDelete);
  }
};

/**
 * Invalidate all directory and user caches
 * @param {string} [userId]
 */
const invalidateUserAndDirectoryCache = (userId) => {
  if (userId) {
    del(`profile:${userId}`);
  }
  del('featured');
  del('filters');
  delByPrefix('directory:');
};

/**
 * Invalidate dashboard and events caches
 */
const invalidateDashboardAndEventsCache = () => {
  delByPrefix('dashboard:');
  delByPrefix('events:');
};

/**
 * Comprehensive invalidation for event/attendance/member mutations
 * @param {string} [userId]
 */
const invalidateAllModulesCache = (userId) => {
  invalidateUserAndDirectoryCache(userId);
  invalidateDashboardAndEventsCache();
};

module.exports = {
  getOrSet,
  del,
  delByPrefix,
  invalidateUserAndDirectoryCache,
  invalidateDashboardAndEventsCache,
  invalidateAllModulesCache,
};
