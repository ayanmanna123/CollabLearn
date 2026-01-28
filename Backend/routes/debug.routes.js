import express from 'express';
import Booking from '../models/booking.model.js';

const router = express.Router();

// Debug endpoint to check bookings with ratings
router.get('/bookings-with-ratings', async (req, res) => {
  try {
    const allBookings = await Booking.find({}).select('mentor sessionRating status');
    
    const bookingsWithRatings = allBookings.filter(b => b.sessionRating?.student?.rating);
    
    console.log('🔍 DEBUG: Total bookings:', allBookings.length);
    console.log('🔍 DEBUG: Bookings with ratings:', bookingsWithRatings.length);
    
    res.json({
      totalBookings: allBookings.length,
      bookingsWithRatings: bookingsWithRatings.length,
      sampleBookingsWithRatings: bookingsWithRatings.slice(0, 5).map(b => ({
        mentor: String(b.mentor),
        rating: b.sessionRating.student.rating,
        status: b.status
      })),
      allBookingsSample: allBookings.slice(0, 10).map(b => ({
        mentor: String(b.mentor),
        status: b.status,
        hasSessionRating: !!b.sessionRating,
        hasStudentRating: !!b.sessionRating?.student?.rating,
        studentRatingValue: b.sessionRating?.student?.rating,
        fullSessionRating: b.sessionRating
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings with complete data
router.get('/all-bookings', async (req, res) => {
  try {
    const allBookings = await Booking.find({})
      .populate('mentor', 'name email')
      .populate('student', 'name email');
    
    const bookingsData = allBookings.map(b => ({
      _id: b._id,
      mentor: b.mentor?.name || 'Unknown',
      mentorId: b.mentor?._id,
      student: b.student?.name || 'Unknown',
      status: b.status,
      sessionRating: b.sessionRating,
      hasStudentRating: !!b.sessionRating?.student?.rating,
      studentRatingValue: b.sessionRating?.student?.rating || null,
      studentReview: b.sessionRating?.student?.review || null
    }));
    
    const withRatings = bookingsData.filter(b => b.hasStudentRating);
    
    res.json({
      totalBookings: allBookings.length,
      bookingsWithRatings: withRatings.length,
      allBookings: bookingsData,
      bookingsWithRatings: withRatings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Insert test rating data for debugging
router.post('/insert-test-rating', async (req, res) => {
  try {
    const mentorId = '692aa45e6a02e85e152c4dee';
    const booking = await Booking.findOne({ mentor: mentorId });
    
    if (!booking) {
      return res.status(404).json({ error: 'No booking found for this mentor' });
    }
    
    booking.sessionRating = {
      student: {
        rating: 4.5,
        review: 'Great mentor!'
      }
    };
    
    await booking.save();
    
    res.json({ 
      success: true, 
      message: 'Test rating inserted',
      booking: booking
    });
  } catch (error) {
    console.error('Insert test rating error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
