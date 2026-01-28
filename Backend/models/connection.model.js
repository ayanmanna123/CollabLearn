import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'connected', 'disconnected'],
      default: 'connected'
    },
    connectedAt: {
      type: Date,
      default: Date.now
    },
    disconnectedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Ensure unique connection between student and mentor
connectionSchema.index({ student: 1, mentor: 1 }, { unique: true });

export default mongoose.model('Connection', connectionSchema);
