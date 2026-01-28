import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  insights: {
    summary: String,
    keyTakeaways: [String],
    actionItems: [String]
  },
  notes: {
    type: String,
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  },
  mentorName: String,
  sessionDate: String,
  sessionTime: String,
  duration: Number,
  topic: String
}, {
  timestamps: true
});

// Index for efficient queries
journalEntrySchema.index({ sessionId: 1, studentId: 1 }, { unique: true });
journalEntrySchema.index({ studentId: 1 });

export default mongoose.model('JournalEntry', journalEntrySchema);
