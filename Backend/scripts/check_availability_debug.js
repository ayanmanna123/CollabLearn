
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Availability from '../models/availability.model.js';

dotenv.config();

const checkAvailability = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    const mentorId = '697a178d47c5b7ca1e5da118'; // From the screenshot URL
    
    const count = await Availability.countDocuments({ mentor: mentorId });
    console.log(`Total availability records for mentor ${mentorId}: ${count}`);

    const availabilities = await Availability.find({ mentor: mentorId }).sort({ date: 1 });
    
    if (availabilities.length === 0) {
      console.log('No availability found for this mentor.');
    } else {
      console.log('Found availabilities for dates:');
      availabilities.forEach(a => {
        console.log(`- Date: ${a.date}, Slots: ${a.timeSlots.length}, IsActive: ${a.isActive}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAvailability();
