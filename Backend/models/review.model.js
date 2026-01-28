import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session"
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: String,
  },
  { timestamps: true }
);

export default mongoose.model("Review", ReviewSchema);
