const User = require('./user.model');
const Event = require('../events/event.model');
const Attendance = require('../attendance/attendance.model');
const { getOrSet, invalidateUserAndDirectoryCache } = require('../../shared/utils/cache');
const { computeBadges } = require('../auth/auth.service');

// Escape regex special chars
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Shape of directory item (no email, no phone, no ticketCode)
const formatDirectoryItem = (user) => {
  return {
    id: user._id,
    name: user.name,
    year: user.year,
    department: user.department,
    position: user.position || null,
    roleLabel: user.position || (user.role === 'admin' ? 'Admin' : user.role === 'coordinator' ? 'Coordinator' : 'Core Member'),
    shortBio: user.shortBio || '',
    skills: user.skills || [],
    socials: user.socials || { linkedin: '', github: '', instagram: '' },
  };
};

// Public profile shape with stats, badges, recentEvents, coordinatorRoles
const formatProfile = async (user, isAuthenticated = false) => {
  const userId = user._id;

  // Attended events (last 4)
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

  // Coordinator roles (last 4)
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

  const profile = {
    id: user._id,
    name: user.name,
    role: user.role,
    position: user.position || null,
    roleLabel: user.position || (user.role === 'admin' ? 'Admin' : user.role === 'coordinator' ? 'Coordinator' : 'Core Member'),
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

  if (isAuthenticated && user.email) {
    profile.email = user.email;
  }

  return profile;
};

/**
 * Get featured office bearers
 */
const getFeaturedUsers = async () => {
  return getOrSet('featured', async () => {
    // Office bearers: position not null
    const users = await User.find({
      isActive: true,
      position: { $ne: null },
    }).lean();

    // Order: Chairperson -> Vice Chairperson -> Secretary -> Joint Secretary -> Webmaster
    const order = ['Chairperson', 'Vice Chairperson', 'Secretary', 'Joint Secretary', 'Webmaster'];
    users.sort((a, b) => {
      const idxA = order.indexOf(a.position);
      const idxB = order.indexOf(b.position);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });

    return users.map(formatDirectoryItem);
  });
};

/**
 * Get directory filters
 */
const getDirectoryFilters = async () => {
  return getOrSet('filters', async () => {
    const activeUsers = await User.find({ isActive: true }).select('department year position').lean();

    const departments = [...new Set(activeUsers.map((u) => u.department).filter(Boolean))].sort();
    const years = [...new Set(activeUsers.map((u) => u.year).filter(Boolean))].sort((a, b) => a - b);

    // Positions + Core Member
    const positions = ['Chairperson', 'Vice Chairperson', 'Secretary', 'Joint Secretary', 'Webmaster', 'Core Member'];

    return {
      departments,
      years,
      roles: positions,
    };
  });
};

/**
 * Get directory of users
 */
const getDirectory = async (queryParams) => {
  const {
    q,
    role,
    year,
    department,
    sort = 'name_asc',
    page = 1,
    limit = 8,
  } = queryParams;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(24, Math.max(1, parseInt(limit, 10) || 8));

  // Build normalized query key for caching
  const normalizedKey = `directory:${JSON.stringify({
    q: q?.trim().toLowerCase() || '',
    role: role || '',
    year: year || '',
    department: department || '',
    sort,
    page: pageNum,
    limit: limitNum,
  })}`;

  return getOrSet(normalizedKey, async () => {
    const filter = { isActive: true };

    const hasSearchOrFilters = !!(
      (q && q.trim()) ||
      role ||
      year ||
      department
    );

    // If no search or filters, exclude office bearers (they appear in featured)
    if (!hasSearchOrFilters) {
      filter.position = null;
    }

    // Role filter
    if (role) {
      if (role === 'Core Member') {
        filter.position = null;
      } else {
        filter.position = role;
      }
    }

    // Year filter
    if (year) {
      filter.year = parseInt(year, 10);
    }

    // Department filter
    if (department) {
      filter.department = department;
    }

    // Search query over name, skills, position, shortBio, department
    if (q && q.trim()) {
      const escaped = escapeRegex(q.trim());
      const regex = new RegExp(escaped, 'i');
      filter.$or = [
        { name: regex },
        { skills: regex },
        { position: regex },
        { shortBio: regex },
        { department: regex },
      ];
    }

    // Sorting
    let sortOptions = { name: 1 };
    if (sort === 'name_desc') {
      sortOptions = { name: -1 };
    } else if (sort === 'year_desc') {
      sortOptions = { year: -1, name: 1 };
    } else if (sort === 'recent') {
      sortOptions = { joinedAt: -1, _id: -1 };
    }

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum) || 1;
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    return {
      data: users.map(formatDirectoryItem),
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    };
  });
};

/**
 * Get member profile by ID
 */
const getProfileById = async (id, isAuthenticated = false) => {
  // Check public profile in cache (email-less)
  const cachedPublic = await getOrSet(`profile:${id}`, async () => {
    const user = await User.findOne({ _id: id, isActive: true }).lean();
    if (!user) return null;
    return await formatProfile(user, false);
  });

  if (!cachedPublic) {
    return null;
  }

  // If authenticated, attach email dynamically
  if (isAuthenticated) {
    const user = await User.findById(id).select('email').lean();
    return {
      ...cachedPublic,
      email: user?.email || '',
    };
  }

  return cachedPublic;
};

/**
 * Update current user profile
 */
const updateOwnProfile = async (userId, updateData) => {
  const allowedFields = ['shortBio', 'about', 'skills', 'quote', 'socials'];
  const updatePayload = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      updatePayload[field] = updateData[field];
    }
  }

  const user = await User.findByIdAndUpdate(userId, { $set: updatePayload }, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Invalidate cache
  invalidateUserAndDirectoryCache(userId.toString());

  return await formatProfile(user, true);
};

/**
 * Get member's attended events paginated
 */
const getUserEvents = async (userId, page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const total = await Attendance.countDocuments({ user: userId });
  const records = await Attendance.find({ user: userId })
    .sort({ checkedInAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate('event', 'name category startsAt endsAt venue')
    .lean();

  const data = records
    .filter((r) => r.event)
    .map((r) => ({
      id: r.event._id,
      name: r.event.name,
      category: r.event.category,
      startsAt: r.event.startsAt,
      endsAt: r.event.endsAt,
      venue: r.event.venue,
      checkedInAt: r.checkedInAt,
    }));

  return {
    data,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

/**
 * Get member's coordinator roles paginated
 */
const getUserCoordinatorRoles = async (userId, page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const total = await Event.countDocuments({ coordinators: userId });
  const events = await Event.find({ coordinators: userId })
    .sort({ startsAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  const now = new Date();
  const data = events.map((ev) => ({
    id: ev._id,
    name: ev.name,
    category: ev.category,
    startsAt: ev.startsAt,
    endsAt: ev.endsAt,
    venue: ev.venue,
    isCurrent: new Date(ev.endsAt) > now,
  }));

  return {
    data,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

module.exports = {
  getFeaturedUsers,
  getDirectoryFilters,
  getDirectory,
  getProfileById,
  updateOwnProfile,
  formatProfile,
  getUserEvents,
  getUserCoordinatorRoles,
};
