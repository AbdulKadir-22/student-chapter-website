const mongoose = require('mongoose');
const User = require('../users/user.model');
const Event = require('../events/event.model');
const Attendance = require('../attendance/attendance.model');
const { getOrSet, invalidateAllModulesCache } = require('../../shared/utils/cache');
const { isAdminLike } = require('../../shared/utils/permissions');
const {
  startOfMonthIST,
  startOfPreviousMonthIST,
} = require('../../shared/utils/time');

// Escape regex special chars
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Get admin members list with search, filter, pagination
 */
const getAdminMembers = async (queryParams) => {
  const {
    q,
    page = 1,
    limit = 8,
    status = 'all',
  } = queryParams;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(24, Math.max(1, parseInt(limit, 10) || 8));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  if (status === 'active') {
    filter.isActive = true;
  } else if (status === 'inactive') {
    filter.isActive = false;
  }

  if (q && q.trim()) {
    const escaped = escapeRegex(q.trim());
    const regex = new RegExp(escaped, 'i');
    filter.$or = [
      { name: regex },
      { email: regex },
      { enrollmentNumber: regex },
    ];
  }

  // Default sort: joinedAt ascending as in mockup
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort({ joinedAt: 1, _id: 1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  const data = users.map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    roleLabel: u.position || (u.role === 'admin' ? 'Admin' : u.role === 'coordinator' ? 'Coordinator' : 'Member'),
    role: u.role,
    joinedAt: u.joinedAt,
    isActive: u.isActive,
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
 * Get member details for edit modal
 */
const getMemberDetails = async (id) => {
  const user = await User.findById(id).lean();
  if (!user) {
    const error = new Error('Member not found');
    error.statusCode = 404;
    throw error;
  }

  // Find events where this user is coordinator
  const coordinatorEvents = await Event.find({ coordinators: user._id })
    .select('name')
    .lean();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    enrollmentNumber: user.enrollmentNumber || '',
    year: user.year,
    department: user.department,
    position: user.position || null,
    role: user.role,
    isActive: user.isActive,
    coordinatorEvents: coordinatorEvents.map((e) => ({
      id: e._id,
      name: e.name,
    })),
  };
};

/**
 * Create a new member
 */
const createMember = async (memberData) => {
  const {
    name,
    email,
    phone,
    enrollmentNumber,
    year,
    department,
    position,
    role = 'member',
    coordinatorEventIds = [],
  } = memberData;

  const normalizedEmail = email.toLowerCase().trim();

  // Check duplicate email
  const existingEmail = await User.findOne({ email: normalizedEmail });
  if (existingEmail) {
    const error = new Error('A member with this email already exists');
    error.statusCode = 409;
    error.field = 'email';
    throw error;
  }

  // Check duplicate enrollmentNumber if provided
  if (enrollmentNumber && enrollmentNumber.trim()) {
    const existingEnrollment = await User.findOne({
      enrollmentNumber: enrollmentNumber.trim(),
    });
    if (existingEnrollment) {
      const error = new Error('A member with this enrollment number already exists');
      error.statusCode = 409;
      error.field = 'enrollmentNumber';
      throw error;
    }
  }

  // Password = email local part
  const tempPassword = normalizedEmail.split('@')[0];

  // Restrict role from UI to member or coordinator
  const assignedRole = role === 'coordinator' ? 'coordinator' : 'member';

  const user = new User({
    name: name.trim(),
    email: normalizedEmail,
    password: tempPassword,
    phone: phone ? phone.trim() : '',
    enrollmentNumber: enrollmentNumber ? enrollmentNumber.trim() : undefined,
    year: parseInt(year, 10) || 1,
    department: department ? department.trim() : 'Computer Science & Engineering',
    position: position || null,
    role: assignedRole,
    mustChangePassword: true,
    isActive: true,
  });

  await user.save();

  // If role is coordinator and coordinatorEventIds are passed, sync events
  if (assignedRole === 'coordinator' && Array.isArray(coordinatorEventIds) && coordinatorEventIds.length > 0) {
    await Event.updateMany(
      { _id: { $in: coordinatorEventIds } },
      { $addToSet: { coordinators: user._id } }
    );
  }

  invalidateAllModulesCache(user._id.toString());

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    temporaryPassword: tempPassword,
  };
};

/**
 * Update member details
 */
const updateMember = async (id, updateData, actorUser) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error('Member not found');
    error.statusCode = 404;
    throw error;
  }

  const {
    name,
    phone,
    enrollmentNumber,
    year,
    department,
    position,
    role,
    coordinatorEventIds,
    isActive,
  } = updateData;

  // Rule: Reject any role or status change on users who are admin-like
  const isTargetAdminLike = isAdminLike(user);
  if (isTargetAdminLike) {
    if (role !== undefined && role !== user.role) {
      const error = new Error('Cannot change role for an admin-like user');
      error.statusCode = 403;
      throw error;
    }
    if (isActive !== undefined && isActive !== user.isActive) {
      const error = new Error('Cannot change active status for an admin-like user');
      error.statusCode = 403;
      throw error;
    }
  }

  // Rule: Block self-deactivation
  if (user._id.toString() === actorUser._id.toString() && isActive === false) {
    const error = new Error('You cannot deactivate your own account');
    error.statusCode = 403;
    throw error;
  }

  // Check enrollment uniqueness if changed
  if (enrollmentNumber !== undefined && enrollmentNumber !== user.enrollmentNumber) {
    if (enrollmentNumber && enrollmentNumber.trim()) {
      const existing = await User.findOne({
        enrollmentNumber: enrollmentNumber.trim(),
        _id: { $ne: user._id },
      });
      if (existing) {
        const error = new Error('A member with this enrollment number already exists');
        error.statusCode = 409;
        error.field = 'enrollmentNumber';
        throw error;
      }
      user.enrollmentNumber = enrollmentNumber.trim();
    } else {
      user.enrollmentNumber = undefined;
    }
  }

  if (name !== undefined) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim();
  if (year !== undefined) user.year = parseInt(year, 10);
  if (department !== undefined) user.department = department.trim();
  if (position !== undefined) user.position = position || null;

  // Handle role change & coordinator events sync
  if (!isTargetAdminLike && role !== undefined) {
    const prevRole = user.role;
    const nextRole = role === 'coordinator' ? 'coordinator' : 'member';
    user.role = nextRole;

    if (nextRole === 'coordinator') {
      const targetEventIds = Array.isArray(coordinatorEventIds)
        ? coordinatorEventIds.map((eid) => new mongoose.Types.ObjectId(eid))
        : [];

      // Add to listed events
      await Event.updateMany(
        { _id: { $in: targetEventIds } },
        { $addToSet: { coordinators: user._id } }
      );
      // Remove from events not in the list
      await Event.updateMany(
        { _id: { $nin: targetEventIds }, coordinators: user._id },
        { $pull: { coordinators: user._id } }
      );
    } else if (prevRole === 'coordinator' && nextRole === 'member') {
      // Remove from all events
      await Event.updateMany(
        { coordinators: user._id },
        { $pull: { coordinators: user._id } }
      );
    }
  } else if (user.role === 'coordinator' && coordinatorEventIds !== undefined) {
    // Role stays coordinator, sync event list
    const targetEventIds = Array.isArray(coordinatorEventIds)
      ? coordinatorEventIds.map((eid) => new mongoose.Types.ObjectId(eid))
      : [];

    await Event.updateMany(
      { _id: { $in: targetEventIds } },
      { $addToSet: { coordinators: user._id } }
    );
    await Event.updateMany(
      { _id: { $nin: targetEventIds }, coordinators: user._id },
      { $pull: { coordinators: user._id } }
    );
  }

  if (!isTargetAdminLike && isActive !== undefined) {
    user.isActive = !!isActive;
  }

  await user.save();

  invalidateAllModulesCache(user._id.toString());

  return getMemberDetails(user._id);
};

/**
 * Deactivate member (never hard delete)
 */
const deactivateMember = async (id, actorUser) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error('Member not found');
    error.statusCode = 404;
    throw error;
  }

  if (isAdminLike(user)) {
    const error = new Error('Cannot deactivate an admin-like user');
    error.statusCode = 403;
    throw error;
  }

  if (user._id.toString() === actorUser._id.toString()) {
    const error = new Error('You cannot deactivate your own account');
    error.statusCode = 403;
    throw error;
  }

  user.isActive = false;
  await user.save();

  invalidateAllModulesCache(user._id.toString());

  return { message: 'Member deactivated successfully' };
};

/**
 * Admin Dashboard statistics
 */
const getDashboardStats = async () => {
  return getOrSet('dashboard:stats', async () => {
    const startOfCurrentMonth = startOfMonthIST();
    const startOfPrevMonth = startOfPreviousMonthIST();

    // 1. Members
    // Active members total
    const totalActiveMembers = await User.countDocuments({ isActive: true });
    // Members existing at end of last month = created before start of current month (and active)
    const membersBeforeThisMonth = await User.countDocuments({
      isActive: true,
      createdAt: { $lt: startOfCurrentMonth },
    });
    // New members this month
    const newMembersThisMonth = totalActiveMembers - membersBeforeThisMonth;
    const membersGrowth = membersBeforeThisMonth > 0
      ? Math.round((newMembersThisMonth / membersBeforeThisMonth) * 100)
      : (newMembersThisMonth > 0 ? 100 : null);

    // 2. Events
    const totalEvents = await Event.countDocuments();
    const eventsThisMonth = await Event.countDocuments({
      createdAt: { $gte: startOfCurrentMonth },
    });
    const eventsLastMonth = await Event.countDocuments({
      createdAt: { $gte: startOfPrevMonth, $lt: startOfCurrentMonth },
    });
    const eventsGrowth = eventsLastMonth > 0
      ? Math.round(((eventsThisMonth - eventsLastMonth) / eventsLastMonth) * 100)
      : null;

    // 3. Attendees
    const totalAttendees = await Attendance.countDocuments();
    const attendeesThisMonth = await Attendance.countDocuments({
      checkedInAt: { $gte: startOfCurrentMonth },
    });
    const attendeesLastMonth = await Attendance.countDocuments({
      checkedInAt: { $gte: startOfPrevMonth, $lt: startOfCurrentMonth },
    });
    const attendeesGrowth = attendeesLastMonth > 0
      ? Math.round(((attendeesThisMonth - attendeesLastMonth) / attendeesLastMonth) * 100)
      : null;

    // 4. Projects: static 0 with null growth
    return {
      members: {
        total: totalActiveMembers,
        growthPercent: membersGrowth,
      },
      events: {
        total: totalEvents,
        growthPercent: eventsGrowth,
      },
      attendees: {
        total: totalAttendees,
        growthPercent: attendeesGrowth,
      },
      projects: {
        total: 0,
        growthPercent: null,
      },
      generatedAt: new Date().toISOString(),
    };
  }, 60); // 60s cache TTL
};

module.exports = {
  getAdminMembers,
  getMemberDetails,
  createMember,
  updateMember,
  deactivateMember,
  getDashboardStats,
};
