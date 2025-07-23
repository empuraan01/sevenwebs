import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Button,
  Alert,
  AlertIcon,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { booksAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';


const bookSchema = yup.object({
  title: yup
    .string()
    .min(1, 'Title must be at least 1 character')
    .max(200, 'Title cannot exceed 200 characters')
    .required('Book title is required'),
  author: yup
    .string()
    .min(2, 'Author name must be at least 2 characters')
    .max(100, 'Author name cannot exceed 100 characters')
    .required('Author name is required'),
  genre: yup
    .string()
    .required('Please select a genre'),
});

const AddBookPage = () => {
  const [genres, setGenres] = useState([]);
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await booksAPI.getGenres();
        setGenres(response.data.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(bookSchema),
  });

  const onSubmit = async (data) => {
    setApiError('');
    setIsSuccess(false);
    
    try {
      await booksAPI.createBook(data);
      setIsSuccess(true);
      reset(); 
      
      setTimeout(() => {
        navigate('/books');
      }, 2000);
    } catch (error) {
      console.error('Error creating book:', error);
      setApiError(
        error.response?.data?.message || 'Failed to create book. Please try again.'
      );
    }
  };

  return (
    <Container maxW="md" py={12}>
      <VStack spacing={8}>
        <VStack spacing={4} textAlign="center">
          <Heading size="xl" color="blue.600">
            Add New Book
          </Heading>
          <Text color="gray.600">
            Share a great book with the community
          </Text>
        </VStack>

        <Box
          w="full"
          bg={bgColor}
          p={8}
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          shadow="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6}>
              {isSuccess && (
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  Book added successfully! Redirecting to books page...
                </Alert>
              )}

              {apiError && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {apiError}
                </Alert>
              )}

              <FormControl isInvalid={errors.title}>
                <FormLabel>Book Title</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter the book title"
                  size="lg"
                  {...register('title')}
                />
                <FormErrorMessage>
                  {errors.title?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.author}>
                <FormLabel>Author</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter the author's name"
                  size="lg"
                  {...register('author')}
                />
                <FormErrorMessage>
                  {errors.author?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.genre}>
                <FormLabel>Genre</FormLabel>
                <Select
                  placeholder="Select a genre"
                  size="lg"
                  {...register('genre')}
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.genre?.message}
                </FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                isLoading={isSubmitting}
                loadingText="Adding Book..."
                isDisabled={isSuccess}
              >
                Add Book
              </Button>
            </VStack>
          </form>
        </Box>

        <VStack spacing={4} textAlign="center">
          <Text color="gray.600">
            Want to browse existing books?{' '}
            <Link
              as={RouterLink}
              to="/books"
              color="blue.500"
              fontWeight="semibold"
              _hover={{ textDecoration: 'underline' }}
            >
              View all books
            </Link>
          </Text>
          
          <Link
            as={RouterLink}
            to="/"
            color="gray.500"
            fontSize="sm"
            _hover={{ textDecoration: 'underline' }}
          >
            ← Back to Home
          </Link>
        </VStack>
      </VStack>
    </Container>
  );
};

export default AddBookPage; 