const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'coordinator', 'member'],
        message: '{VALUE} is not a valid role',
      },
      default: 'member',
    },
    position: {
      type: String,
      enum: {
        values: ['Chairperson', 'Vice Chairperson', 'Secretary', 'Treasurer', 'Webmaster', null],
        message: '{VALUE} is not a valid position',
      },
      default: null,
    },
    showDashboard: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    enrollmentNumber: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      match: [/^\d{8,16}$/, 'Enrollment number must be 8 to 16 digits'],
    },
    ticketCode: {
      type: String,
      unique: true,
      sparse: true,
      select: false, // Never return in default queries or profile shapes
    },
    year: {
      type: Number,
      min: 1,
      max: 4,
      default: 1,
    },
    department: {
      type: String,
      trim: true,
      default: 'Computer Science & Engineering',
    },
    academicYear: {
      type: String,
      default: '2025 – 2026',
    },
    college: {
      type: String,
      default: 'AMTICS, Gandhinagar',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    shortBio: {
      type: String,
      maxlength: [160, 'Short bio cannot exceed 160 characters'],
      default: '',
    },
    about: {
      type: String,
      maxlength: [1000, 'About cannot exceed 1000 characters'],
      default: '',
    },
    skills: {
      type: [
        {
          type: String,
          maxlength: [24, 'Skill cannot exceed 24 characters'],
        },
      ],
      validate: [
        (val) => val.length <= 8,
        'Cannot have more than 8 skills',
      ],
      default: [],
    },
    quote: {
      type: String,
      maxlength: [80, 'Quote cannot exceed 80 characters'],
      default: '',
    },
    socials: {
      linkedin: {
        type: String,
        default: '',
      },
      github: {
        type: String,
        default: '',
      },
      instagram: {
        type: String,
        default: '',
      },
    },
    mustChangePassword: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for roleLabel: position || (role === 'admin' ? 'Admin' : role === 'coordinator' ? 'Coordinator' : 'Core Member')
userSchema.virtual('roleLabel').get(function () {
  if (this.position) return this.position;
  if (this.role === 'admin') return 'Admin';
  if (this.role === 'coordinator') return 'Coordinator';
  return 'Core Member';
});

// Indexes for directory searching & filtering
userSchema.index({ role: 1 });
userSchema.index({ position: 1 });
userSchema.index({ year: 1 });
userSchema.index({ department: 1 });
userSchema.index({ name: 1 });

// Pre-save hook: auto-generate ticketCode if missing, and hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.ticketCode) {
    this.ticketCode = crypto.randomBytes(16).toString('hex');
  }

  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Also keep matchPassword for backward compatibility
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
