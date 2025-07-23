import express from 'express';
import { body } from 'express-validator';
import { getUserReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import auth from '../middleware/auth.js';

const router = express.Router();


const validateReviewUpdate = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  
  body('reviewText')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Review text cannot exceed 1000 characters')
];


router.get('/my-reviews', auth, getUserReviews);


router.put('/:reviewId', auth, validateReviewUpdate, updateReview);


router.delete('/:reviewId', auth, deleteReview);

export default router; 