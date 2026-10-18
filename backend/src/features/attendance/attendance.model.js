const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    checkedInAt: {
      type: Date,
      default: Date.now,
    },
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ScannedBy user is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index on (event, user)
attendanceSchema.index({ event: 1, user: 1 }, { unique: true });
attendanceSchema.index({ user: 1 });
attendanceSchema.index({ event: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
