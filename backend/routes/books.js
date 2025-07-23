import express from 'express';
import { body } from 'express-validator';
import { getBooks, getBookById, createBook, getGenres } from '../controllers/bookController.js';
import { addReview } from '../controllers/reviewController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const validateBook = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Author name must be between 2 and 100 characters'),
  
  body('genre')
    .notEmpty()
    .withMessage('Genre is required')
    .isIn([
      'Fiction',
      'Non-Fiction', 
      'Mystery',
      'Romance',
      'Science Fiction',
      'Fantasy',
      'Biography',
      'History',
      'Self-Help',
      'Business',
      'Technology',
      'Health',
      'Travel',
      'Children',
      'Young Adult',
      'Other'
    ])
    .withMessage('Please select a valid genre')
];

const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  
  body('reviewText')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Review text cannot exceed 1000 characters')
];

router.get('/genres', getGenres);

router.get('/', getBooks);


router.get('/:id', getBookById);


router.post('/', auth, validateBook, createBook);


router.post('/:bookId/reviews', auth, validateReview, addReview);

export default router; 