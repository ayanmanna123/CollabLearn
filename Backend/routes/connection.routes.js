import express from 'express';
import {
  connectToMentor,
  disconnectFromMentor,
  getStudentConnections,
  getMentorConnections,
  checkConnection,
  getMentorConnectionCount
} from '../controllers/connection.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @route   POST /api/connections/connect
// @desc    Connect to a mentor
// @access  Private (Students only)
router.post('/connect', connectToMentor);

// @route   POST /api/connections/disconnect
// @desc    Disconnect from a mentor
// @access  Private (Students only)
router.post('/disconnect', disconnectFromMentor);

// @route   GET /api/connections/my-connections
// @desc    Get all connections for authenticated student
// @access  Private (Students only)
// @query   ?status=connected
router.get('/my-connections', getStudentConnections);

// @route   GET /api/connections/mentor-connections
// @desc    Get all connections for authenticated mentor (students connected to this mentor)
// @access  Private (Mentors only)
// @query   ?status=connected
router.get('/mentor-connections', getMentorConnections);

// @route   GET /api/connections/check
// @desc    Check if student is connected to a mentor
// @access  Private
// @query   ?mentorId=<id>
router.get('/check', checkConnection);

// @route   GET /api/connections/count
// @desc    Get mentor's connection count
// @access  Public
// @query   ?mentorId=<id>
router.get('/count', getMentorConnectionCount);

export default router;
