import express from 'express';
import { generateTwilioToken } from '../controllers/twilio.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * POST /api/twilio/token
 * Generate a Twilio Video access token for joining a room
 * Requires authentication
 */
router.post('/token', protect, generateTwilioToken);

export default router;
