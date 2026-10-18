const mongoose = require('mongoose');
const Event = require('./event.model');
const Attendance = require('../attendance/attendance.model');
const User = require('../users/user.model');
const { getOrSet, invalidateAllModulesCache } = require('../../shared/utils/cache');
const { isAdminLike } = require('../../shared/utils/permissions');
const {
  buildISTDateTime,
  isTodayIST,
  startOfSemesterIST,
  startOfPreviousSemesterIST,
  formatISTTime,
  formatISTDisplayDate,
} = require('../../shared/utils/time');

// Escape regex special chars
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Format event item with attendeeCount, isToday, status, canScan, coordinators
 */
const formatEventItem = (event, user) => {
  const now = new Date();
  const startsAt = new Date(event.startsAt);
  const endsAt = new Date(event.endsAt);

  // Scan window: from 3 hours BEFORE startsAt until endsAt
  const scanOpensAt = new Date(startsAt.getTime() - 3 * 60 * 60 * 1000);
  const isWithinScanWindow = now >= scanOpensAt && now <= endsAt;

  // Caller permission to scan: admin-like OR coordinator in event.coordinators
  const hasScanRole =
    isAdminLike(user) ||
    (user.role === 'coordinator' &&
      (event.coordinators || []).some(
        (c) => (c._id || c).toString() === user._id.toString()
      ));

  const canScan = hasScanRole && isWithinScanWindow;

  let status = 'upcoming';
  if (now > endsAt) {
    status = 'completed';
  } else if (now >= startsAt && now <= endsAt) {
    status = 'live';
  }

  const isToday = isTodayIST(startsAt);

  const coordinators = (event.coordinators || []).map((c) => ({
    id: c._id || c,
    name: c.name || '',
  }));

  return {
    id: event._id,
    name: event.name,
    category: event.category,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    venue: event.venue,
    attendeeCount: event.attendeeCount || 0,
    isToday,
    status,
    canScan,
    coordinators,
  };
};

/**
 * Get events list (scoped by user role: admin-like sees all, coordinator sees assigned)
 */
const getEvents = async (queryParams, user) => {
  const {
    q,
    page = 1,
    limit = 8,
  } = queryParams;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(24, Math.max(1, parseInt(limit, 10) || 8));
  const skip = (pageNum - 1) * limitNum;

  const isUserAdminLike = isAdminLike(user);
  const scopeKey = isUserAdminLike ? 'all' : `coord:${user._id}`;

  const normalizedKey = `events:list:${scopeKey}:${JSON.stringify({
    q: q?.trim().toLowerCase() || '',
    page: pageNum,
    limit: limitNum,
  })}`;

  return getOrSet(normalizedKey, async () => {
    const filter = {};

    if (!isUserAdminLike) {
      filter.coordinators = user._id;
    }

    if (q && q.trim()) {
      const escaped = escapeRegex(q.trim());
      const regex = new RegExp(escaped, 'i');
      filter.$or = [
        { name: regex },
        { venue: regex },
        { category: regex },
      ];
    }

    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .sort({ startsAt: 1, _id: 1 }) // Default sort: startsAt ascending
      .skip(skip)
      .limit(limitNum)
      .populate('coordinators', 'name')
      .lean();

    // Attach attendee counts for each event
    const eventIds = events.map((e) => e._id);
    const counts = await Attendance.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: '$event', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const data = events.map((ev) => {
      ev.attendeeCount = countMap[ev._id.toString()] || 0;
      return formatEventItem(ev, user);
    });

    return {
      data,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    };
  }, 60);
};

/**
 * Get events statistics (Total Events, Total Attendees vs previous semester)
 */
const getEventsStats = async (user) => {
  const isUserAdminLike = isAdminLike(user);
  const scopeKey = isUserAdminLike ? 'all' : `coord:${user._id}`;

  return getOrSet(`events:stats:${scopeKey}`, async () => {
    const currentSemStart = startOfSemesterIST();
    const prevSemStart = startOfPreviousSemesterIST();

    const eventScopeFilter = isUserAdminLike ? {} : { coordinators: user._id };

    // 1. Total events
    const totalEvents = await Event.countDocuments(eventScopeFilter);

    const eventsThisSem = await Event.countDocuments({
      ...eventScopeFilter,
      createdAt: { $gte: currentSemStart },
    });

    const eventsPrevSem = await Event.countDocuments({
      ...eventScopeFilter,
      createdAt: { $gte: prevSemStart, $lt: currentSemStart },
    });

    const eventsGrowth = eventsPrevSem > 0
      ? Math.round(((eventsThisSem - eventsPrevSem) / eventsPrevSem) * 100)
      : null;

    // 2. Total attendees
    let attendeeScopeFilter = {};
    if (!isUserAdminLike) {
      const coordEvents = await Event.find({ coordinators: user._id }).select('_id').lean();
      const coordEventIds = coordEvents.map((e) => e._id);
      attendeeScopeFilter = { event: { $in: coordEventIds } };
    }

    const totalAttendees = await Attendance.countDocuments(attendeeScopeFilter);

    const attendeesThisSem = await Attendance.countDocuments({
      ...attendeeScopeFilter,
      checkedInAt: { $gte: currentSemStart },
    });

    const attendeesPrevSem = await Attendance.countDocuments({
      ...attendeeScopeFilter,
      checkedInAt: { $gte: prevSemStart, $lt: currentSemStart },
    });

    const attendeesGrowth = attendeesPrevSem > 0
      ? Math.round(((attendeesThisSem - attendeesPrevSem) / attendeesPrevSem) * 100)
      : null;

    return {
      totalEvents: {
        total: totalEvents,
        growthPercent: eventsGrowth,
      },
      totalAttendees: {
        total: totalAttendees,
        growthPercent: attendeesGrowth,
      },
    };
  }, 60);
};

/**
 * Create event
 */
const createEvent = async (eventData, actorUser) => {
  const {
    name,
    category,
    date, // YYYY-MM-DD
    startTime, // HH:mm
    endTime, // HH:mm
    venue,
    coordinatorIds = [],
  } = eventData;

  const startsAt = buildISTDateTime(date, startTime);
  const endsAt = buildISTDateTime(date, endTime);

  if (endsAt <= startsAt) {
    const error = new Error('End time must be after start time');
    error.statusCode = 400;
    throw error;
  }

  // Validate coordinatorIds are active users with role coordinator
  if (coordinatorIds.length > 0) {
    const validCoordinators = await User.find({
      _id: { $in: coordinatorIds },
      role: 'coordinator',
      isActive: true,
    });
    if (validCoordinators.length !== coordinatorIds.length) {
      const error = new Error('One or more selected coordinators are invalid or inactive');
      error.statusCode = 400;
      throw error;
    }
  }

  const event = new Event({
    name: name.trim(),
    category,
    startsAt,
    endsAt,
    venue: venue.trim(),
    coordinators: coordinatorIds,
    createdBy: actorUser._id,
  });

  await event.save();
  invalidateAllModulesCache();

  return event;
};

/**
 * Update event
 */
const updateEvent = async (id, eventData) => {
  const event = await Event.findById(id);
  if (!event) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  const {
    name,
    category,
    date,
    startTime,
    endTime,
    venue,
    coordinatorIds,
  } = eventData;

  if (name !== undefined) event.name = name.trim();
  if (category !== undefined) event.category = category;
  if (venue !== undefined) event.venue = venue.trim();

  // Update startsAt / endsAt if date/time provided
  if (date || startTime || endTime) {
    const currentDateIST = formatISTDisplayDate(event.startsAt);
    const dateStr = date || formatISTDateString(event.startsAt);
    const startStr = startTime || formatISTTime(event.startsAt);
    const endStr = endTime || formatISTTime(event.endsAt);

    const startsAt = buildISTDateTime(dateStr, startStr);
    const endsAt = buildISTDateTime(dateStr, endStr);

    if (endsAt <= startsAt) {
      const error = new Error('End time must be after start time');
      error.statusCode = 400;
      throw error;
    }

    event.startsAt = startsAt;
    event.endsAt = endsAt;
  }

  if (coordinatorIds !== undefined) {
    if (coordinatorIds.length > 0) {
      const validCoordinators = await User.find({
        _id: { $in: coordinatorIds },
        role: 'coordinator',
        isActive: true,
      });
      if (validCoordinators.length !== coordinatorIds.length) {
        const error = new Error('One or more selected coordinators are invalid or inactive');
        error.statusCode = 400;
        throw error;
      }
    }
    event.coordinators = coordinatorIds;
  }

  await event.save();
  invalidateAllModulesCache();

  return event;
};

/**
 * Delete event
 */
const deleteEvent = async (id) => {
  const event = await Event.findById(id);
  if (!event) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  const attendeeCount = await Attendance.countDocuments({ event: event._id });
  if (attendeeCount > 0) {
    const error = new Error('Event has attendees');
    error.statusCode = 409;
    throw error;
  }

  await Event.findByIdAndDelete(id);
  invalidateAllModulesCache();

  return { message: 'Event deleted successfully' };
};

/**
 * Get event details by ID
 */
const getEventDetails = async (event, user) => {
  await event.populate('coordinators', 'name email role position');
  const attendeeCount = await Attendance.countDocuments({ event: event._id });
  event.attendeeCount = attendeeCount;
  return formatEventItem(event, user);
};

/**
 * Get event attendees (Live: never cached)
 */
const getEventAttendees = async (eventId, queryParams) => {
  const {
    q,
    page = 1,
    limit = 8,
  } = queryParams;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 8));
  const skip = (pageNum - 1) * limitNum;

  const event = await Event.findById(eventId).populate('coordinators', 'name').lean();
  if (!event) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  // Attendance query
  const attendanceFilter = { event: event._id };

  // If search query is provided, find matching user IDs first
  if (q && q.trim()) {
    const escaped = escapeRegex(q.trim());
    const regex = new RegExp(escaped, 'i');
    const matchingUsers = await User.find({
      $or: [
        { name: regex },
        { email: regex },
        { enrollmentNumber: regex },
      ],
    }).select('_id');

    attendanceFilter.user = { $in: matchingUsers.map((u) => u._id) };
  }

  const total = await Attendance.countDocuments(attendanceFilter);
  const attendanceRecords = await Attendance.find(attendanceFilter)
    .sort({ checkedInAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate('user', 'name email enrollmentNumber department year position role')
    .lean();

  const totalAttendees = await Attendance.countDocuments({ event: event._id });
  const activeMembersTotal = await User.countDocuments({ isActive: true });

  // Rate = totalAttendees / activeMembersTotal
  const attendanceRate = activeMembersTotal > 0
    ? Math.round((totalAttendees / activeMembersTotal) * 100)
    : 0;

  // Find previous event by date to calculate rateDelta
  const prevEvent = await Event.findOne({
    startsAt: { $lt: event.startsAt },
  })
    .sort({ startsAt: -1 })
    .lean();

  let rateDelta = null;
  if (prevEvent) {
    const prevAttendeesCount = await Attendance.countDocuments({ event: prevEvent._id });
    const prevRate = activeMembersTotal > 0
      ? Math.round((prevAttendeesCount / activeMembersTotal) * 100)
      : 0;
    rateDelta = attendanceRate - prevRate;
  }

  const membersPct = totalAttendees > 0 ? 100 : 0;

  const stats = {
    totalAttendees,
    members: {
      count: totalAttendees,
      percentage: membersPct,
    },
    nonMembers: 0,
    attendanceRate,
    rateDelta,
  };

  const data = attendanceRecords.map((att) => {
    const u = att.user || {};
    const handle = u.email ? u.email.split('@')[0] : '';
    return {
      userId: u._id,
      name: u.name || 'Unknown',
      handle: `@${handle}`,
      email: u.email || '',
      enrollmentNumber: u.enrollmentNumber || '—',
      department: u.department || '',
      year: u.year || 1,
      type: 'Member',
      status: 'Present',
      checkedInAt: att.checkedInAt,
    };
  });

  return {
    event: {
      id: event._id,
      name: event.name,
      category: event.category,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      venue: event.venue,
      isToday: isTodayIST(event.startsAt),
      coordinators: (event.coordinators || []).map((c) => ({
        id: c._id,
        name: c.name,
      })),
    },
    stats,
    data,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

/**
 * Export attendees CSV
 */
const getAttendeesCSV = async (eventId) => {
  const event = await Event.findById(eventId).lean();
  if (!event) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  const attendees = await Attendance.find({ event: event._id })
    .sort({ checkedInAt: 1 })
    .populate('user', 'name email enrollmentNumber department year')
    .lean();

  // Sanitize cell for CSV injection: if starts with = + - @ prefix with '
  const sanitizeCell = (val) => {
    if (val === null || val === undefined) return '""';
    let str = String(val).trim();
    if (/^[=+\-@]/.test(str)) {
      str = `'${str}`;
    }
    // Escape double quotes
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headers = ['Name', 'Email', 'Enrollment No.', 'Department', 'Year', 'Status', 'Checked In At (IST)'];
  const rows = [headers.join(',')];

  attendees.forEach((att) => {
    const u = att.user || {};
    const checkedInStr = formatISTDisplayDate(att.checkedInAt) + ' ' + formatISTTime(att.checkedInAt);
    const row = [
      sanitizeCell(u.name),
      sanitizeCell(u.email),
      sanitizeCell(u.enrollmentNumber || '—'),
      sanitizeCell(u.department || '—'),
      sanitizeCell(u.year || '—'),
      sanitizeCell('Present'),
      sanitizeCell(checkedInStr),
    ];
    rows.push(row.join(','));
  });

  const slug = event.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return {
    filename: `${slug || 'event'}-attendees.csv`,
    csv: rows.join('\r\n'),
  };
};

/**
 * Remove mistaken attendee from event
 */
const removeAttendee = async (eventId, userId) => {
  const result = await Attendance.findOneAndDelete({
    event: eventId,
    user: userId,
  });

  if (!result) {
    const error = new Error('Attendee record not found for this event');
    error.statusCode = 404;
    throw error;
  }

  invalidateAllModulesCache(userId.toString());

  return { message: 'Attendee removed successfully' };
};

/**
 * Process QR scan for event attendance
 * Idempotent, handles double scan races
 */
const processScan = async (event, ticketCode, actorUser) => {
  const now = new Date();
  const startsAt = new Date(event.startsAt);
  const endsAt = new Date(event.endsAt);

  // Scan window: 3 hours BEFORE startsAt until endsAt
  const scanOpensAt = new Date(startsAt.getTime() - 3 * 60 * 60 * 1000);

  if (now < scanOpensAt) {
    const opensTimeStr = formatISTTime(startsAt);
    const error = new Error(`Scanning opens at ${opensTimeStr}`);
    error.statusCode = 400;
    throw error;
  }

  if (now > endsAt) {
    const error = new Error('This event has ended');
    error.statusCode = 400;
    throw error;
  }

  // Find user by ticketCode
  const member = await User.findOne({ ticketCode }).select('+ticketCode');
  if (!member) {
    const error = new Error('Invalid ticket');
    error.statusCode = 404;
    throw error;
  }

  if (!member.isActive) {
    const error = new Error('Member is inactive');
    error.statusCode = 403;
    throw error;
  }

  // Check if attendance already exists
  let attendance = await Attendance.findOne({
    event: event._id,
    user: member._id,
  });

  let status = 'checked_in';

  if (attendance) {
    status = 'already_checked_in';
  } else {
    try {
      attendance = new Attendance({
        event: event._id,
        user: member._id,
        scannedBy: actorUser._id,
        checkedInAt: now,
      });
      await attendance.save();
    } catch (err) {
      // Catch unique compound index collision (race condition)
      if (err.code === 11000) {
        attendance = await Attendance.findOne({
          event: event._id,
          user: member._id,
        });
        status = 'already_checked_in';
      } else {
        throw err;
      }
    }
  }

  // Invalidate profile cache for scanned user
  invalidateAllModulesCache(member._id.toString());

  const attendeeCount = await Attendance.countDocuments({ event: event._id });

  return {
    status,
    member: {
      id: member._id,
      name: member.name,
      year: member.year,
      department: member.department,
      position: member.position,
    },
    checkedInAt: attendance.checkedInAt,
    attendeeCount,
  };
};

module.exports = {
  getEvents,
  getEventsStats,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventDetails,
  getEventAttendees,
  getAttendeesCSV,
  removeAttendee,
  processScan,
};
