const express = require('express');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const {
  getEvents,
  getEventsStats,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getAttendees,
  exportAttendees,
  removeAttendee,
  scanTicket,
} = require('./event.controller');
const {
  protect,
  requireAdminLike,
  requireEventAccess,
} = require('../../shared/middleware/auth.middleware');
const validate = require('../../shared/middleware/validate.middleware');

const router = express.Router();

// Scanner rate limit: 60 scans per min per user
const scanLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req) => req.user?._id?.toString() || 'anonymous',
  validate: { xForwardedForHeader: false },
  message: { message: 'Too many scan attempts, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

const createEventSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Event name is required'),
    category: z.enum(['Workshop', 'Seminar', 'Competition', 'Talk']),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time must be HH:mm'),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, 'End time must be HH:mm'),
    venue: z.string().min(1, 'Venue is required'),
    coordinatorIds: z.array(z.string()).optional(),
  }),
});

const updateEventSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    category: z.enum(['Workshop', 'Seminar', 'Competition', 'Talk']).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    venue: z.string().min(1).optional(),
    coordinatorIds: z.array(z.string()).optional(),
  }),
});

const scanTicketSchema = z.object({
  body: z.object({
    ticketCode: z.string().min(1, 'Ticket code is required'),
  }),
});

// Guard: all /api/events routes require authentication and admin-like or coordinator role
router.use(protect, (req, res, next) => {
  const allowed = req.user.role === 'admin' || req.user.role === 'coordinator' || req.user.showDashboard === true;
  if (!allowed) {
    return res.status(403).json({ message: 'Forbidden: Member access denied' });
  }
  next();
});

// Stats & List
router.get('/stats', getEventsStats);
router.get('/', getEvents);

// Admin-only event CRUD
router.post('/', requireAdminLike, validate(createEventSchema), createEvent);
router.patch('/:id', requireAdminLike, validate(updateEventSchema), updateEvent);
router.delete('/:id', requireAdminLike, deleteEvent);

// Event-specific routes with requireEventAccess
router.get('/:id', requireEventAccess, getEventById);
router.get('/:id/attendees', requireEventAccess, getAttendees);
router.get('/:id/attendees/export', requireEventAccess, exportAttendees);
router.delete('/:id/attendees/:userId', requireEventAccess, removeAttendee);
router.post(
  '/:id/scan',
  requireEventAccess,
  scanLimiter,
  validate(scanTicketSchema),
  scanTicket
);

module.exports = router;
