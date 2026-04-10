import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/booking.model.js';
import { updateBookingStatus } from './controllers/booking.controller.js';
import Notification from './models/notification.model.js';
import { getIO } from './config/socket.js';
import { sendBookingConfirmationEmail } from './services/emailService.js';

dotenv.config();

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find a pending booking
        const booking = await Booking.findOne({ status: 'pending' });
        if (!booking) {
            console.log('No pending booking found to test with.');
            process.exit(0);
        }

        console.log('Found pending booking:', booking._id);

        // Mock req and res
        const req = {
            params: { bookingId: booking._id.toString() },
            body: { status: 'confirmed' },
            user: { id: booking.mentor.toString() } // act as mentor
        };

        const res = {
            status: (code) => {
                console.log('res.status called with:', code);
                return res;
            },
            json: (data) => {
                console.log('res.json called with:', data);
            }
        };

        console.log('Testing updateBookingStatus...');
        await updateBookingStatus(req, res);
        console.log('Test complete!');

        // Cleanup
        booking.status = 'pending';
        await booking.save();
        
        process.exit(0);
    } catch (err) {
        console.error('Test Failed:', err);
        process.exit(1);
    }
};

runTest();
