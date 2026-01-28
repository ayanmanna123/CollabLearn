import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing test data
    await User.deleteMany({ email: { $regex: /@test\.com$/ } });
    await Message.deleteMany({});
    console.log('Cleared existing test data');

    // Create test mentor
    const mentor = await User.create({
      name: 'John Mentor',
      email: 'mentor@test.com',
      password: 'password123',
      role: 'mentor',
      bio: 'Experienced software engineer and mentor',
      hourlyRate: 50
    });

    // Create test students
    const student1 = await User.create({
      name: 'Alice Student',
      email: 'alice@test.com',
      password: 'password123',
      role: 'student',
      bio: 'Learning web development'
    });

    const student2 = await User.create({
      name: 'Bob Student',
      email: 'bob@test.com',
      password: 'password123',
      role: 'student',
      bio: 'Aspiring full-stack developer'
    });

    console.log('Created test users:');
    console.log('- Mentor:', mentor.name, mentor.email);
    console.log('- Student 1:', student1.name, student1.email);
    console.log('- Student 2:', student2.name, student2.email);

    // Create test messages
    const messages = [
      {
        sender: student1._id,
        receiver: mentor._id,
        content: 'Hi! I have a question about React hooks.',
        messageType: 'question'
      },
      {
        sender: mentor._id,
        receiver: student1._id,
        content: 'Sure! What specific aspect of React hooks are you struggling with?',
        messageType: 'normal'
      },
      {
        sender: student1._id,
        receiver: mentor._id,
        content: 'I\'m having trouble understanding useEffect dependencies.',
        messageType: 'question'
      },
      {
        sender: mentor._id,
        receiver: student1._id,
        content: 'Great question! The dependency array controls when useEffect runs. Let me explain...',
        messageType: 'advice'
      },
      {
        sender: student2._id,
        receiver: mentor._id,
        content: 'Hello! Can we schedule a session to review my portfolio project?',
        messageType: 'normal'
      },
      {
        sender: mentor._id,
        receiver: student2._id,
        content: 'Absolutely! I\'d be happy to review your portfolio. Let\'s set up a time.',
        messageType: 'normal'
      }
    ];

    for (const messageData of messages) {
      await Message.create(messageData);
    }

    console.log('Created test messages');

    // Display login credentials
    console.log('\n=== TEST LOGIN CREDENTIALS ===');
    console.log('Mentor Login:');
    console.log('  Email: mentor@test.com');
    console.log('  Password: password123');
    console.log('\nStudent Logins:');
    console.log('  Email: alice@test.com');
    console.log('  Password: password123');
    console.log('  Email: bob@test.com');
    console.log('  Password: password123');
    console.log('===============================\n');

    console.log('Test data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
};

createTestData();
