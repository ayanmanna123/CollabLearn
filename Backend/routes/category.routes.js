import express from 'express';
import {
  GetAllCategories,
  GetCategoryById,
  GetMentorsByCategory,
  GetCategoryStats
} from '../controllers/category.controller.js';

const router = express.Router();

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', GetAllCategories);

/**
 * @route   GET /api/categories/:categoryId
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:categoryId', GetCategoryById);

/**
 * @route   GET /api/categories/:categoryId/mentors
 * @desc    Get mentors by category with pagination
 * @access  Public
 * @query   page (default: 1), limit (default: 10)
 */
router.get('/:categoryId/mentors', GetMentorsByCategory);

/**
 * @route   GET /api/categories/stats
 * @desc    Get category statistics
 * @access  Public
 */
router.get('/stats', GetCategoryStats);

export default router;
