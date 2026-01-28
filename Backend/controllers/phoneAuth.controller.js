import User from '../models/user.model.js';
import { generateOTP, storeOTP, verifyOTP, hasActiveOTP, getOTPExpiryTime } from '../services/otpService.js';
import smsService from '../services/smsService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Send OTP for phone number login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function sendPhoneOTP(req, res) {
  try {
    let { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    // Normalize phone number: remove spaces, dashes, parentheses
    phoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '').trim();

    // Validate phone number format (basic validation)
    const phoneRegex = /^[+]?[\d]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid phone number format. Please use format like: +919876543210 or 9876543210' 
      });
    }

    // Check if user exists with this phone number (case-insensitive, normalized)
    const user = await User.findOne({ 
      phoneNumber: { $regex: `^${phoneNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } 
    });
    if (!user) {
      // Let's check if there are any users with phone numbers at all
      const usersWithPhone = await User.find({ phoneNumber: { $exists: true, $ne: '' } }).limit(5);
      
      if (usersWithPhone.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'No users with phone numbers found in database. Please add phone numbers to user accounts first.' 
        });
      }
      
      // List available phone numbers for testing (only in development)
      const availablePhones = usersWithPhone.map(u => u.phoneNumber);
      console.log('Available phone numbers for testing:', availablePhones);
      
      return res.status(404).json({ 
        success: false, 
        message: `No account found with phone number: ${phoneNumber}. Available numbers for testing: ${availablePhones.join(', ')}` 
      });
    }

    // Check if there's already an active OTP
    if (hasActiveOTP(phoneNumber)) {
      const remainingTime = getOTPExpiryTime(phoneNumber);
      return res.status(429).json({ 
        success: false, 
        message: `OTP already sent. Please wait ${remainingTime} seconds before requesting a new one.` 
      });
    }

    // Generate and store OTP
    const otp = generateOTP();
    storeOTP(phoneNumber, otp);

    // Send OTP via SMS service
    const smsSent = await smsService.sendOTP(phoneNumber, otp);

    res.status(200).json({ 
      success: true, 
      message: smsSent ? 'OTP sent successfully via SMS' : 'OTP sent (SMS service unavailable - check console)',
      // In development or when SMS fails, return OTP for testing
      otp: (!smsService.isConfigured || !smsSent) ? otp : undefined,
      expiresIn: 300 // 5 minutes in seconds
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

/**
 * Verify OTP and login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function verifyPhoneOTP(req, res) {
  try {
    let { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number and OTP are required' 
      });
    }

    // Normalize phone number: remove spaces, dashes, parentheses
    phoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '').trim();

    // Verify OTP
    const isValidOTP = verifyOTP(phoneNumber, otp);
    if (!isValidOTP) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired OTP' 
      });
    }

    // Find user with normalized phone number (case-insensitive)
    const user = await User.findOne({ 
      phoneNumber: { $regex: `^${phoneNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } 
    });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Generate JWT token (use 'id' field for consistency with other auth methods)
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
        isProfileComplete: user.isProfileComplete,
        karmaPoints: user.karmaPoints
      }
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

/**
 * Resend OTP
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function resendPhoneOTP(req, res) {
  try {
    let { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    // Normalize phone number: remove spaces, dashes, parentheses
    phoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '').trim();

    // Check if user exists with normalized phone number (case-insensitive)
    const user = await User.findOne({ 
      phoneNumber: { $regex: `^${phoneNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } 
    });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this phone number' 
      });
    }

    // Check remaining time for existing OTP
    if (hasActiveOTP(phoneNumber)) {
      const remainingTime = getOTPExpiryTime(phoneNumber);
      if (remainingTime > 60) { // Allow resend only if less than 1 minute remaining
        return res.status(429).json({ 
          success: false, 
          message: `Please wait ${remainingTime} seconds before requesting a new OTP.` 
        });
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    storeOTP(phoneNumber, otp);

    // Send OTP via SMS service
    const smsSent = await smsService.sendOTP(phoneNumber, otp);

    res.status(200).json({ 
      success: true, 
      message: smsSent ? 'OTP resent successfully via SMS' : 'OTP resent (SMS service unavailable - check console)',
      // In development or when SMS fails, return OTP for testing
      otp: (!smsService.isConfigured || !smsSent) ? otp : undefined,
      expiresIn: 300
    });

  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

export {
  sendPhoneOTP,
  verifyPhoneOTP,
  resendPhoneOTP
};
