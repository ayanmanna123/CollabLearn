import mongoose from 'mongoose';
import Booking from '../models/booking.model.js';
import Review from '../models/review.model.js';

export async function getMentorRatingsMap(mentorIds) {
  const ids = Array.isArray(mentorIds) ? mentorIds.filter(Boolean) : [];
  if (!ids.length) {
    console.log('⭐ getMentorRatingsMap: No mentor IDs provided');
    return new Map();
  }

  const objectIds = ids.map((id) => {
    if (typeof id === 'string') {
      return new mongoose.Types.ObjectId(id);
    }
    return id;
  });
  
  console.log(`⭐ getMentorRatingsMap: Processing ${ids.length} mentors`);

  try {
    // Get ratings from both Booking.sessionRating and Review collection
    const bookingRatings = await Booking.aggregate([
      {
        $match: {
          mentor: { $in: objectIds },
          'sessionRating.student.rating': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$mentor',
          ratings: { $push: '$sessionRating.student.rating' }
        }
      }
    ]);

    const reviewRatings = await Review.aggregate([
      {
        $match: {
          mentor: { $in: objectIds },
          rating: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$mentor',
          ratings: { $push: '$rating' }
        }
      }
    ]);

    console.log(`⭐ Booking ratings:`, bookingRatings);
    console.log(`⭐ Review ratings:`, reviewRatings);

    const ratingsByMentorId = new Map();
    
    // Merge booking and review ratings
    const allRatings = {};
    
    bookingRatings.forEach(br => {
      const mentorIdStr = String(br._id);
      allRatings[mentorIdStr] = (allRatings[mentorIdStr] || []).concat(br.ratings);
    });
    
    reviewRatings.forEach(rr => {
      const mentorIdStr = String(rr._id);
      allRatings[mentorIdStr] = (allRatings[mentorIdStr] || []).concat(rr.ratings);
    });

    // Calculate average and total for each mentor
    objectIds.forEach((mentorId) => {
      const mentorIdStr = String(mentorId);
      const ratings = allRatings[mentorIdStr] || [];
      
      if (ratings.length > 0) {
        const avgRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
        ratingsByMentorId.set(mentorIdStr, {
          averageRating: Number(avgRating.toFixed(2)),
          totalReviews: ratings.length
        });
        console.log(`⭐ Mentor ${mentorIdStr}: avg=${avgRating.toFixed(2)}, count=${ratings.length}`);
      } else {
        ratingsByMentorId.set(mentorIdStr, {
          averageRating: 0,
          totalReviews: 0
        });
        console.log(`⭐ Mentor ${mentorIdStr}: avg=0.00, count=0 (no ratings)`);
      }
    });

    console.log(`⭐ Final ratings map size:`, ratingsByMentorId.size);
    return ratingsByMentorId;
  } catch (error) {
    console.error('⭐ Error in getMentorRatingsMap:', error);
    return new Map();
  }
}
