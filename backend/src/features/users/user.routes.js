const express = require('express');
const { z } = require('zod');
const {
  getFeatured,
  getFilters,
  getDirectory,
  getMe,
  getMyTicket,
  updateMe,
  getProfileById,
  getUserEvents,
  getUserCoordinatorRoles,
} = require('./user.controller');
const { protect, optionalAuth } = require('../../shared/middleware/auth.middleware');
const validate = require('../../shared/middleware/validate.middleware');

const router = express.Router();

const updateMeSchema = z.object({
  body: z.object({
    shortBio: z.string().max(160, 'Short bio max 160 characters').optional(),
    about: z.string().max(1000, 'About max 1000 characters').optional(),
    skills: z.array(z.string().max(24, 'Skill max 24 chars')).max(8, 'Max 8 skills').optional(),
    quote: z.string().max(80, 'Quote max 80 characters').optional(),
    socials: z.object({
      linkedin: z.string().optional(),
      github: z.string().optional(),
      instagram: z.string().optional(),
    }).optional(),
  }).passthrough(),
});

// Featured office bearers
router.get('/featured', protect, getFeatured);

// Directory filter options
router.get('/filters', protect, getFilters);

// Own profile & ticket
router.get('/me', protect, getMe);
router.get('/me/ticket', protect, getMyTicket);
router.patch('/me', protect, validate(updateMeSchema), updateMe);

// Directory listing
router.get('/', protect, getDirectory);

// Public profile & sub-resources
router.get('/:id/events', optionalAuth, getUserEvents);
router.get('/:id/coordinator-roles', optionalAuth, getUserCoordinatorRoles);
router.get('/:id', optionalAuth, getProfileById);

module.exports = router;
