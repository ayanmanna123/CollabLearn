import express from 'express';
const router = express.Router();
import {
  getCompletedSessions,
  saveSessionNotes,
  getSessionNotes,
  saveJournalEntry,
  getJournalEntries
} from '../controllers/journal.controller.js';

// Middleware to verify user is authenticated
import authenticateToken from '../middleware/auth.middleware.js';

// Get completed sessions for student
router.get('/sessions/completed', authenticateToken, getCompletedSessions);

// Save session notes
router.post('/notes', authenticateToken, saveSessionNotes);

// Get session notes
router.get('/notes/:sessionId', authenticateToken, getSessionNotes);

// Save complete journal entry
router.post('/entry', authenticateToken, saveJournalEntry);

// Get all journal entries for student
router.get('/entries', authenticateToken, getJournalEntries);

export default router;
