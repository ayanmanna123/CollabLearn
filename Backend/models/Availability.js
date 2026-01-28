import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: String,
      required: true
    },
    timeSlots: [String],
    duration: {
      type: Number,
      default: 60
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

availabilitySchema.index({ mentor: 1, date: 1 }, { unique: true });

const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability;
