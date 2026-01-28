import mongoose from 'mongoose';

const forumQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Question title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Question content is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['engineering', 'data-science', 'business', 'product', 'general'],
      default: 'general',
      required: true
    },
    domain: {
      type: String,
      default: 'general'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    answers: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        content: {
          type: String,
          required: true,
          trim: true
        },
        upvotes: {
          type: Number,
          default: 0,
          min: 0
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    upvotes: {
      type: Number,
      default: 0,
      min: 0
    },
    upvoters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    isResolved: {
      type: Boolean,
      default: false
    },
    resolvedAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumQuestion.answers'
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for better search performance
forumQuestionSchema.index({ title: 'text', content: 'text' });
forumQuestionSchema.index({ category: 1, createdAt: -1 });
forumQuestionSchema.index({ author: 1, createdAt: -1 });

// Virtual for answer count
forumQuestionSchema.virtual('answerCount').get(function () {
  return this.answers ? this.answers.length : 0;
});

// Ensure virtuals are included in JSON
forumQuestionSchema.set('toJSON', { virtuals: true });

const ForumQuestion = mongoose.model('ForumQuestion', forumQuestionSchema);

export default ForumQuestion;
