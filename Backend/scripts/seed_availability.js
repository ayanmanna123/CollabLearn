
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Availability from '../models/availability.model.js';
import User from '../models/user.model.js';

dotenv.config();

const normalizeDateString = (date) => {
    return date.toISOString().substring(0, 10);
};

const seedAvailability = async () => {
    try {
        await connectDB();
        console.log('✅ Connected to DB');

        const mentorId = '697a178d47c5b7ca1e5da118';
        
        // Verify mentor exists
        const mentor = await User.findById(mentorId);
        if (!mentor) {
            console.error(`❌ Mentor with ID ${mentorId} not found!`);
            process.exit(1);
        }
        console.log(`👤 Found mentor: ${mentor.name} (${mentor.email})`);

        // Generate dates for the next 30 days
        const today = new Date();
        const dates = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            // Skip weekends (0 is Sunday, 6 is Saturday)
            const day = date.getDay();
            if (day !== 0 && day !== 6) {
                dates.push(normalizeDateString(date));
            }
        }

        console.log(`📅 Preparing to seed availability for ${dates.length} days...`);

        const timeSlots = [
            '09:00 AM', '10:00 AM', '11:00 AM', 
            '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
        ];

        let createdCount = 0;
        let updatedCount = 0;

        for (const dateStr of dates) {
            // Check if exists
            let availability = await Availability.findOne({
                mentor: mentorId,
                date: dateStr
            });

            // Convert simple strings to objects as controller expects/saves
            const formattedTimeSlots = timeSlots.map(time => {
                // Calculate end time (simple version for seeding, assuming 60 mins)
                // This mimics the controller logic roughly but simplified since we know inputs
                // Actually, let's just use the string format if the model supports it or pre-calculate
                // strict model schema validation might fail if we don't provide endTime
                
                // Let's reuse the logic from controller for calculating endTime to be safe
                // or just hardcode for simplicity since we know the slots
                 const [timePart, period] = time.split(' ');
                 let [hours, minutes] = timePart.split(':').map(Number);
                 if (period === 'PM' && hours !== 12) hours += 12;
                 if (period === 'AM' && hours === 12) hours = 0;
                 
                 let endHours = hours + 1;
                 const endPeriod = endHours >= 12 ? 'PM' : 'AM';
                 if (endHours > 12) endHours -= 12;
                 if (endHours === 0 || endHours === 24) endHours = 12;
                 
                 const endTime = `${String(endHours).padStart(2, '0')}:00 ${endPeriod}`;

                 return {
                     startTime: time,
                     endTime: endTime,
                     isBooked: false
                 };
            });

            if (availability) {
                // Skip if already exists to avoid overwriting real data if any (though we know there isn't)
                // Or update it? Let's update it if it has NO slots.
                if (availability.timeSlots.length === 0) {
                     availability.timeSlots = formattedTimeSlots;
                     availability.isActive = true;
                     await availability.save();
                     updatedCount++;
                }
            } else {
                availability = new Availability({
                    mentor: mentorId,
                    date: dateStr,
                    timeSlots: formattedTimeSlots,
                    duration: 60,
                    isActive: true
                });
                await availability.save();
                createdCount++;
            }
        }

        console.log(`✅ Finished! Created: ${createdCount}, Updated: ${updatedCount}`);
        
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding availability:', error);
        process.exit(1);
    }
};

seedAvailability();
