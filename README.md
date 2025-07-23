# 📚 SevenWebs - Book Review Platform

A modern, full-stack book review platform that allows users to discover books, write reviews, and share their reading experiences with a community of book lovers.


## 🌟 Features

### 📖 Book Management
- **Browse Books**: Explore a comprehensive catalog of books with filtering and search capabilities
- **Book Details**: View detailed information including ratings, reviews, and metadata
- **Add Books**: Authenticated users can contribute by adding new books to the platform
- **Genre Classification**: Books organized by genres for easy discovery

### 👤 User Authentication
- **Secure Registration**: Create accounts with email validation and password hashing
- **JWT Authentication**: Secure login system with JSON Web Tokens
- **Protected Routes**: Access control for user-specific features
- **User Profiles**: Personalized user experience

### ⭐ Review System
- **Rate Books**: Give books a rating from 1 to 5 stars
- **Write Reviews**: Share detailed thoughts and opinions about books
- **Edit Reviews**: Update your reviews anytime
- **Delete Reviews**: Remove reviews you no longer want published
- **My Reviews**: View and manage all your reviews in one place

### 📊 Rating System
- **Average Ratings**: Automatic calculation of book ratings based on user reviews
- **Review Count**: Track the number of reviews for each book
- **Real-time Updates**: Ratings update instantly when reviews are added or modified

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Chakra UI** - Modern, accessible component library
- **React Router Dom** - Client-side routing
- **React Hook Form** - Efficient form handling with validation
- **Axios** - HTTP client for API requests
- **React Icons** - Icon library
- **Framer Motion** - Animation library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation middleware

## 📁 Project Structure

```
sevenwebs/
├── backend/                 # Backend API server
│   ├── config/
│   │   └── database.js     # MongoDB connection
│   ├── controllers/        # Request handlers
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   └── reviewController.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js        # JWT authentication
│   │   └── validation.js  # Input validation
│   ├── models/            # Mongoose schemas
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Review.js  
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── books.js
│   │   └── reviews.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── package.json
│   └── index.js           # Server entry point
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/       # React context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── BooksPage.jsx
│   │   │   ├── AddBookPage.jsx
│   │   │   ├── BookDetailPage.jsx
│   │   │   └── MyReviewsPage.jsx
│   │   ├── utils/
│   │   │   └── api.js      # API configuration
│   │   ├── App.jsx        # Main app component  
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **MongoDB Atlas account** or local MongoDB installation


### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/empuraan01/sevenwebs.git
   cd sevenwebs
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**  
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

User neeeds to add .env files for both backend and frontend. I have uploaded files in the google drive folder available in my google form response. User simply has to copy and paste them.

User can also refer to the Loom video where I have setup the project from scratch by cloning the github repository


### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   node index.js
   ```
   The API server will start on `http://localhost:$PORT`

2. **Start the Frontend Development Server** (in a new terminal)
   ```bash
   cd frontend  
   npm run dev
   ```
   The React app will start on `http://localhost:5173`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`




### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/profile` | Get user profile | Yes |

### Book Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/books` | Get all books (with filtering) | No |
| GET | `/books/:id` | Get book by ID | No |
| POST | `/books` | Create new book | Yes |
| GET | `/books/genres` | Get available genres | No |

### Review Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/books/:bookId/reviews` | Add review to book | Yes |
| GET | `/reviews/my-reviews` | Get user's reviews | Yes |
| PUT | `/reviews/:reviewId` | Update review | Yes |
| DELETE | `/reviews/:reviewId` | Delete review | Yes |

### Request/Response Examples

**Register User**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "new@example.com", 
  "password": "password123"
}
```

**Add Review**
```bash
POST /api/books/:bookId/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "reviewText": "Amazing book! Highly recommended."
}
```

## 🌐 Deployment

This application is configured for deployment on multiple platforms:

### Frontend Deployment (Vercel)
- Deployed at: `https://sevenwebsfrontend.vercel.app`


### Backend Deployment (Railway)
- Deployed at: `sevenwebsbackend-production.up.railway.app`


### Environment-Specific Configuration
The application automatically detects the deployment environment and configures CORS accordingly for:
- Local development
- Vercel frontend deployments  
- Railway backend deployments
- Custom domain deployments




**Happy Reading! 📚✨** 