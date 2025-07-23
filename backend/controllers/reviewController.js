import Review from '../models/Review.js';
import Book from '../models/Book.js';
import { validationResult } from 'express-validator';


export const addReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { rating, reviewText } = req.body;
    const bookId = req.params.bookId;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const existingReview = await Review.findOne({ book: bookId, user: userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book'
      });
    }

    const review = await Review.create({
      book: bookId,
      user: userId,
      rating,
      reviewText: reviewText || ''
    });

    await review.populate('user', 'name');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: { review }
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding review'
    });
  }
};


export const getUserReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const sortOptions = {};
    const validSortFields = ['rating', 'createdAt'];
    
    if (validSortFields.includes(sortBy)) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ user: req.user._id })
      .populate('book', 'title author genre averageRating')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalReviews = await Review.countDocuments({ user: req.user._id });
    const totalPages = Math.ceil(totalReviews / parseInt(limit));

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalReviews,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reviews'
    });
  }
};


export const updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const reviewId = req.params.reviewId;
    const userId = req.user._id;
    const { rating, reviewText } = req.body;

    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to update it'
      });
    }

    review.rating = rating;
    review.reviewText = reviewText || '';
    await review.save();

    await review.populate('user', 'name');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating review'
    });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user._id;


    const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to delete it'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting review'
    });
  }
}; 