import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  answerQuestion,
  upvoteQuestion,
  getQuestionsByCategory,
  getQuestionsByMentor,
  searchQuestions
} from '../controllers/forum.controller.js';

const router = express.Router();

// Public routes
router.get('/questions', getAllQuestions);
router.get('/questions/search', searchQuestions);
router.get('/questions/category/:category', getQuestionsByCategory);
router.get('/questions/:id', getQuestionById);

// Protected routes (require authentication)
router.post('/questions', authenticateToken, createQuestion);
router.put('/questions/:id', authenticateToken, updateQuestion);
router.delete('/questions/:id', authenticateToken, deleteQuestion);
router.post('/questions/:id/answer', authenticateToken, answerQuestion);
router.post('/questions/:id/upvote', authenticateToken, upvoteQuestion);
router.get('/mentor/:mentorId/questions', authenticateToken, getQuestionsByMentor);

export default router;
