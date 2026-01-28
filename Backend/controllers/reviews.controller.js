import Review from "../models/review.model.js";
import Session from "../models/Session.model.js";

export async function CreateReviewHandler(req, res) {
  try {
    const { sessionId, bookingId, rating, review } = req.body;
    const userId = req.user?.id;

    console.log('CreateReviewHandler called with:', { sessionId, bookingId, rating, userId });

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required"
      });
    }

    if (!sessionId && !bookingId) {
      return res.status(400).json({
        success: false,
        message: "Session ID or Booking ID is required"
      });
    }

    // Import Booking model to get mentor info
    const Booking = (await import('../models/booking.model.js')).default;

    let mentorId = null;
    let session = null;

    // Try to find booking to get mentor ID
    if (bookingId) {
      const booking = await Booking.findById(bookingId).populate('mentor');
      if (booking) {
        mentorId = booking.mentor?._id || booking.mentorId;
        console.log('Mentor ID from booking:', mentorId);
      }
    }

    // Try to find session
    if (sessionId) {
      session = await Session.findById(sessionId);
      if (session && !mentorId) {
        mentorId = session.mentorId;
      }
    }

    const newReview = await Review.create({
      session: sessionId || bookingId,
      booking: bookingId,
      mentor: mentorId,
      rating,
      review: review || undefined,
      student: userId
    });

    const populatedReview = await Review.findById(newReview._id)
      .populate('student', 'name profilePicture')
      .populate('mentor', 'name')
      .populate({
        path: 'session',
        select: 'mentorId studentId startTime endTime'
      });

    console.log('Review created successfully:', populatedReview);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: populatedReview
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message
    });
  }
}

export async function GetReviewsHandler(req, res) {
  try {
    const { mentor, mentorId, studentId } = req.query;
    // Try both req.user.id and req.user._id since JWT might use either
    const userId = req.user?.id || req.user?._id;

    console.log('GetReviewsHandler - userId:', userId, 'studentId:', studentId, 'mentorId:', mentorId, 'mentor:', mentor);
    console.log('GetReviewsHandler - req.user:', req.user);

    // If mentor or mentorId is provided, fetch reviews ABOUT that mentor (priority)
    const currentMentorId = mentor || mentorId;
    if (currentMentorId) {
      console.log('Fetching reviews ABOUT mentor:', currentMentorId);
      
      // Find all reviews for this mentor (from bookings or sessions or direct mentor field)
      const reviews = await Review.find({
        $or: [
          { mentor: currentMentorId },
          { 'session.mentor': currentMentorId },
          { 'session.mentorId': currentMentorId }
        ]
      })
        .populate('student', 'name profilePicture')
        .populate({
          path: 'session',
          select: 'mentorId studentId startTime endTime',
          populate: [
            { path: 'mentorId', select: 'name' },
            { path: 'studentId', select: 'name profilePicture' }
          ]
        })
        .sort({ createdAt: -1 });

      console.log('Reviews found for mentor:', currentMentorId, 'count:', reviews.length);

      const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
      const averageRating = reviews.length > 0 ? parseFloat((totalRating / reviews.length).toFixed(2)) : 0;

      return res.status(200).json({
        success: true,
        count: reviews.length,
        averageRating,
        reviews
      });
    }

    // If studentId is provided, fetch reviews submitted by that student
    if (studentId) {
      const reviews = await Review.find({ student: studentId })
        .populate('student', 'name profilePicture')
        .populate('mentor', 'name profilePicture')
        .sort({ createdAt: -1 });

      console.log('Reviews for student:', studentId, 'count:', reviews.length);

      // Fetch mentor profile pictures from MentorProfile model for those without profile pictures
      const MentorProfile = (await import('../models/mentorProfile.model.js')).default;
      
      const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
          const obj = review.toObject();
          if (obj.mentor && (!obj.mentor.profilePicture || obj.mentor.profilePicture === '')) {
            try {
              const mentorProfile = await MentorProfile.findOne({ user: obj.mentor._id }).select('profilePicture');
              if (mentorProfile && mentorProfile.profilePicture) {
                obj.mentor.profilePicture = mentorProfile.profilePicture;
              }
            } catch (err) {
              console.error(`⚠️ Error fetching MentorProfile for ${obj.mentor._id}:`, err);
            }
          }
          return obj;
        })
      );

      return res.status(200).json({
        success: true,
        count: enrichedReviews.length,
        reviews: enrichedReviews
      });
    }

    // If no mentor/mentorId/studentId but user is authenticated, fetch their own reviews (as student)
    if (userId) {
      const reviews = await Review.find({ student: userId })
        .populate('student', 'name profilePicture')
        .populate('mentor', 'name profilePicture')
        .sort({ createdAt: -1 });

      console.log('Reviews for authenticated user:', userId, 'count:', reviews.length);

      // Fetch mentor profile pictures from MentorProfile model for those without profile pictures
      const MentorProfile = (await import('../models/mentorProfile.model.js')).default;
      
      const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
          const obj = review.toObject();
          if (obj.mentor && (!obj.mentor.profilePicture || obj.mentor.profilePicture === '')) {
            try {
              const mentorProfile = await MentorProfile.findOne({ user: obj.mentor._id }).select('profilePicture');
              if (mentorProfile && mentorProfile.profilePicture) {
                obj.mentor.profilePicture = mentorProfile.profilePicture;
              }
            } catch (err) {
              console.error(`⚠️ Error fetching MentorProfile for ${obj.mentor._id}:`, err);
            }
          }
          return obj;
        })
      );

      return res.status(200).json({
        success: true,
        count: enrichedReviews.length,
        reviews: enrichedReviews
      });
    }

    // No query params and not authenticated
    return res.status(400).json({
      success: false,
      message: "Mentor ID or Student ID is required"
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message
    });
  }
}

export async function GetReviewById(req, res) {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate({
        path: 'session',
        populate: [
          { path: 'mentor', select: 'name email' },
          { path: 'student', select: 'name email' }
        ]
      });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    console.error("Get review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch review"
    });
  }
}
