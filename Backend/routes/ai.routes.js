import express from 'express';
import { generateSessionInsights, generateQuickInsights } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Generate AI insights for a specific session
router.get('/session-insights/:sessionId', protect, generateSessionInsights);

// Generate quick insights (for testing/demo)
router.post('/quick-insights', protect, generateQuickInsights);

export default router;
