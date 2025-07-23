import mongoose from 'mongoose';
import Book from './Book.js';

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book reference is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1 star'],
    max: [5, 'Rating cannot exceed 5 stars'],
    validate: {
      validator: function(value) {
        return Number.isInteger(value);
      },
      message: 'Rating must be a whole number (1, 2, 3, 4, or 5)'
    }
  },
  reviewText: {
    type: String,
    trim: true,
    maxlength: [1000, 'Review text cannot exceed 1000 characters']
  },
}, {
  timestamps: true
});

reviewSchema.index({ book: 1, user: 1 }, { unique: true });

reviewSchema.index({ book: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });

reviewSchema.post('save', async function() {
  await updateBookRating(this.book);
});

reviewSchema.post('deleteOne', { document: true }, async function() {
  await updateBookRating(this.book);
});

reviewSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    await updateBookRating(doc.book);
  }
});

async function updateBookRating(bookId) {
  try {
    const Review = mongoose.model('Review');
    
    const stats = await Review.aggregate([
      { $match: { book: bookId } },
      {
        $group: {
          _id: '$book',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Book.findByIdAndUpdate(bookId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        reviewCount: stats[0].reviewCount
      });
    } else {
      await Book.findByIdAndUpdate(bookId, {
        averageRating: 0,
        reviewCount: 0
      });
    }
  } catch (error) {
    console.error('Error updating book rating:', error);
  }
}

export default mongoose.model('Review', reviewSchema); 