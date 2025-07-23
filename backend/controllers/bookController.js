import Book from '../models/Book.js';
import Review from '../models/Review.js';
import { validationResult } from 'express-validator';


export const getBooks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      genre,
      author,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    const filter = {};
    
    if (genre && genre !== 'all') {
      filter.genre = genre;
    }
    
    if (author) {
      filter.author = { $regex: author, $options: 'i' };
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    const validSortFields = ['title', 'author', 'genre', 'averageRating', 'createdAt', 'reviewCount'];
    
    if (validSortFields.includes(sortBy)) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const books = await Book.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalBooks = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / parseInt(limit));

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBooks,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching books'
    });
  }
};


export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const reviews = await Review.find({ book: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        book,
        reviews
      }
    });

  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching book'
    });
  }
};


export const createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, author, genre } = req.body;

    const existingBook = await Book.findOne({ 
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      author: { $regex: new RegExp(`^${author}$`, 'i') }
    });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'A book with this title and author already exists'
      });
    }

    const book = await Book.create({
      title,
      author,
      genre
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: { book }
    });

  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating book'
    });
  }
};


export const getGenres = async (req, res) => {
  try {
    const genres = [
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
    ];

    res.json({
      success: true,
      data: { genres }
    });

  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching genres'
    });
  }
}; 