const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an event name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide an event category'],
      enum: {
        values: ['Workshop', 'Seminar', 'Competition', 'Talk'],
        message: '{VALUE} is not a valid category',
      },
    },
    startsAt: {
      type: Date,
      required: [true, 'Please provide a start date and time'],
    },
    endsAt: {
      type: Date,
      required: [true, 'Please provide an end date and time'],
    },
    venue: {
      type: String,
      required: [true, 'Please provide a venue'],
      trim: true,
    },
    coordinators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ startsAt: 1 });
eventSchema.index({ coordinators: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
