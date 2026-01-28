import express from 'express';
import { sendPhoneOTP, verifyPhoneOTP, resendPhoneOTP } from '../controllers/phoneAuth.controller.js';

const router = express.Router();

/**
 * POST /api/auth/phone/send-otp
 * Send OTP to user's phone number
 * Body: { phoneNumber }
 */
router.post('/send-otp', sendPhoneOTP);

/**
 * POST /api/auth/phone/verify-otp
 * Verify OTP and login user
 * Body: { phoneNumber, otp }
 */
router.post('/verify-otp', verifyPhoneOTP);

/**
 * POST /api/auth/phone/resend-otp
 * Resend OTP to user's phone number
 * Body: { phoneNumber }
 */
router.post('/resend-otp', resendPhoneOTP);

export default router;
