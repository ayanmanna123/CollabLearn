import { Router } from 'express';
import { 
  CreateReviewHandler, 
  GetReviewsHandler,
  GetReviewById 
} from '../controllers/reviews.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const reviewsRouter = Router();

reviewsRouter.post('/', authenticateToken, CreateReviewHandler);
reviewsRouter.get('/', authenticateToken, GetReviewsHandler);
reviewsRouter.get('/:id', authenticateToken, GetReviewById);

export default reviewsRouter;
