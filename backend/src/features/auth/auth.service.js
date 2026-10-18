const User = require('../users/user.model');
const Event = require('../events/event.model');
const Attendance = require('../attendance/attendance.model');
const { generateToken } = require('../../shared/utils/jwt');
const { invalidateUserAndDirectoryCache } = require('../../shared/utils/cache');
const { getUserPermissions } = require('../../shared/utils/permissions');

// Badge rules
const computeBadges = (eventCount, roleCount) => {
  return [
    { key: 'active_member', name: 'Active Member', earned: eventCount >= 5 },
    { key: 'event_enthusiast', name: 'Event Enthusiast', earned: eventCount >= 10 },
    { key: 'project_contributor', name: 'Project Contributor', earned: false },
    { key: 'idea_sharer', name: 'Idea Sharer', earned: false },
    { key: 'community_builder', name: 'Community Builder', earned: false },
    { key: 'leadership', name: 'Leadership', earned: roleCount >= 1 },
  ];
};

// Format user into own-profile shape with stats, badges, recentEvents, coordinatorRoles, and permissions
const formatOwnProfile = async (user) => {
  const userId = user._id;

  // 1. Attended events count & last 4 recent attended events
  const attendedRecords = await Attendance.find({ user: userId })
    .sort({ checkedInAt: -1 })
    .limit(4)
    .populate('event', 'name category startsAt venue endsAt')
    .lean();

  const totalEventsAttended = await Attendance.countDocuments({ user: userId });

  const recentEvents = attendedRecords
    .filter((att) => att.event)
    .map((att) => ({
      id: att.event._id,
      name: att.event.name,
      category: att.event.category,
      startsAt: att.event.startsAt,
      venue: att.event.venue,
      checkedInAt: att.checkedInAt,
    }));

  // 2. Coordinator roles count & last 4 coordinator events
  const now = new Date();
  const coordinatorEvents = await Event.find({ coordinators: userId })
    .sort({ startsAt: -1 })
    .limit(4)
    .lean();

  const totalRolesHeld = await Event.countDocuments({ coordinators: userId });

  const recentRoles = coordinatorEvents.map((ev) => ({
    id: ev._id,
    name: ev.name,
    category: ev.category,
    startsAt: ev.startsAt,
    isCurrent: new Date(ev.endsAt) > now,
  }));

  const badges = computeBadges(totalEventsAttended, totalRolesHeld);
  const earnedBadgesCount = badges.filter((b) => b.earned).length;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    position: user.position || null,
    roleLabel: user.position || (user.role === 'admin' ? 'Admin' : user.role === 'coordinator' ? 'Coordinator' : 'Core Member'),
    phone: user.phone || '',
    enrollmentNumber: user.enrollmentNumber || '',
    year: user.year,
    department: user.department,
    academicYear: user.academicYear,
    college: user.college,
    joinedAt: user.joinedAt,
    shortBio: user.shortBio || '',
    about: user.about || '',
    skills: user.skills || [],
    quote: user.quote || '',
    socials: user.socials || { linkedin: '', github: '', instagram: '' },
    mustChangePassword: !!user.mustChangePassword,
    showDashboard: !!user.showDashboard,
    permissions: getUserPermissions(user),
    stats: {
      badges: earnedBadgesCount,
      events: totalEventsAttended,
      projects: 0,
      roles: totalRolesHeld,
    },
    badges,
    recentEvents,
    coordinatorRoles: recentRoles,
  };
};

/**
 * Service to authenticate user with email and password
 * @param {string} email
 * @param {string} password
 * @param {boolean} remember
 */
const loginUser = async ({ email, password, remember }) => {
  if (!email || !password) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Find user by lowercase trimmed email including hashed password
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user || !user.isActive) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const expiresIn = remember ? '30d' : '1d';
  const cookieMaxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  const token = generateToken(
    {
      id: user._id,
      role: user.role,
    },
    expiresIn
  );

  const ownProfile = await formatOwnProfile(user);

  return {
    token,
    cookieMaxAge,
    user: ownProfile,
    permissions: ownProfile.permissions,
  };
};

/**
 * Service to change password
 * @param {string} userId
 * @param {string} currentPassword
 * @param {string} newPassword
 */
const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 400;
    throw error;
  }

  if (currentPassword === newPassword) {
    const error = new Error('New password must differ from the current password');
    error.statusCode = 400;
    throw error;
  }

  // Password rules: at least 8 chars, letter and number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    const error = new Error('Password must be at least 8 characters with at least one letter and one number');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  user.mustChangePassword = false;
  await user.save();

  // Invalidate cache
  invalidateUserAndDirectoryCache(user._id.toString());

  // Issue new token
  const token = generateToken(
    {
      id: user._id,
      role: user.role,
    },
    '1d'
  );

  const ownProfile = await formatOwnProfile(user);

  return {
    token,
    cookieMaxAge: 24 * 60 * 60 * 1000,
    user: ownProfile,
  };
};

module.exports = {
  loginUser,
  changePassword,
  formatOwnProfile,
  computeBadges,
};
