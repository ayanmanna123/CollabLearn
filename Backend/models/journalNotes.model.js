import mongoose from 'mongoose';

const journalNotesSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Temporarily make optional to fix validation issue
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null  // Optional - only for mentor notes
  },
  studentNotes: {
    type: String,
    default: ''
  },
  mentorNotes: {
    type: String,
    default: ''
  },
  savedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries - one record per session
journalNotesSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

// Update the updatedAt field before saving
journalNotesSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('JournalNotes', journalNotesSchema);
