import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';


import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BooksPage from './pages/BooksPage';
import AddBookPage from './pages/AddBookPage';
import BookDetailPage from './pages/BookDetailPage';

function App() {
  return (
    <AuthProvider>
      <Box minH="100vh" bg="gray.50">
        <Navbar />
        <Box as="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            

            <Route path="/add-book" element={
              <ProtectedRoute>
                <AddBookPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Box>
      </Box>
    </AuthProvider>
  );
}

export default App;
