import dotenv from 'dotenv';
import { sendEmail } from './services/emailService.js';

dotenv.config();

const testEmail = async () => {
    try {
        console.log('Testing email configuration...');
        console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Present' : 'Missing');
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Present' : 'Missing');
        
        // We don't actually send to avoid spamming, just check if transporter initializes
        // and if variables are correctly picked up.
        // If we want to really test connection:
        // const transporter = getTransporter(); // But this is internal
        
        await sendEmail({
            to: 'test@example.com',
            subject: 'Test Email from CollabLearn',
            text: 'If you see this, the configuration is working.',
            html: '<p>If you see this, the configuration is working.</p>'
        });
        
        console.log('✅ Email service initialized and sent request successfully (or at least configuration is valid)');
        process.exit(0);
    } catch (err) {
        console.error('❌ Email Test Failed:', err.message);
        process.exit(1);
    }
};

testEmail();
