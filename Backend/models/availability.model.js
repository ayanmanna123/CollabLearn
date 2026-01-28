import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  }
}, { _id: false });

const availabilitySchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  timeSlots: [timeSlotSchema],
  duration: {
    type: Number,
    default: 60 // Default session duration in minutes
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create compound index for efficient queries
availabilitySchema.index({ mentor: 1, date: 1 });

const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability;
