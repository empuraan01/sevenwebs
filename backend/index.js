import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import reviewRoutes from './routes/reviews.js';


dotenv.config();

const app = express();

connectDB();

app.use(cors({
  origin: [
    
    'http://localhost:5173', 
    'http://localhost:3000', 
    
    
    process.env.CLIENT_URL,
    process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null,
    
    
    'https://sevenwebsfrontend.vercel.app',
    'https://sevenwebsfrontend-padmanabhans-projects-62e10444.vercel.app',
    'https://sevenwebsfrontend-empuraan01-padmanabhans-projects-62e10444.vercel.app',
    'https://sevenwebsfrontend-mw3ybya1u-padmanabhans-projects-62e10444.vercel.app',
    

    /\.vercel\.app$/,  
    /\.railway\.app$/  
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Book Review Platform API is running!',
    status: 'OK'
  });
});



app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`Server available at: http://localhost:${PORT}`);
}); 