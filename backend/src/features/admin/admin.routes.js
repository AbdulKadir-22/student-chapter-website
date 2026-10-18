const express = require('express');
const { z } = require('zod');
const {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deactivateMember,
  getDashboard,
} = require('./admin.controller');
const { protect, requireAdminLike } = require('../../shared/middleware/auth.middleware');
const validate = require('../../shared/middleware/validate.middleware');

const router = express.Router();

const createMemberSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    enrollmentNumber: z.string().regex(/^\d{8,16}$/, 'Enrollment number must be 8-16 digits').optional(),
    year: z.coerce.number().min(1).max(4).optional(),
    department: z.string().optional(),
    position: z.string().nullable().optional(),
    role: z.enum(['member', 'coordinator']).optional(),
    coordinatorEventIds: z.array(z.string()).optional(),
  }),
});

const updateMemberSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    phone: z.string().optional(),
    enrollmentNumber: z.string().regex(/^\d{8,16}$/, 'Enrollment number must be 8-16 digits').optional(),
    year: z.coerce.number().min(1).max(4).optional(),
    department: z.string().optional(),
    position: z.string().nullable().optional(),
    role: z.enum(['member', 'coordinator']).optional(),
    coordinatorEventIds: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});

// All routes require authentication and admin-like privileges
router.use(protect, requireAdminLike);

// Dashboard stats
router.get('/dashboard', getDashboard);

// Member management
router.get('/members', getMembers);
router.get('/members/:id', getMemberById);
router.post('/members', validate(createMemberSchema), createMember);
router.patch('/members/:id', validate(updateMemberSchema), updateMember);
router.delete('/members/:id', deactivateMember);

module.exports = router;
