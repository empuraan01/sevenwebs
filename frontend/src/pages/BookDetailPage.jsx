import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Button,
  Grid,
  Card,
  CardBody,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  Avatar,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  useColorModeValue,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi';
import { booksAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const StarRating = ({ rating, size = 'md' }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const decimal = rating % 1;
  
  const hasHalfStar = decimal >= 0.3 && decimal < 0.8;
  
  const displayStars = decimal >= 0.8 ? fullStars + 1 : fullStars;
  
  for (let i = 0; i < displayStars; i++) {
    stars.push(
      <Box key={i} as={FaStar} color="yellow.400" boxSize={size === 'sm' ? 4 : 5} />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <Box key="half" as={FaStarHalf} color="yellow.400" boxSize={size === 'sm' ? 4 : 5} />
    );
  }

  const totalShownStars = displayStars + (hasHalfStar ? 1 : 0);
  const emptyStars = 5 - totalShownStars;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Box key={`empty-${i}`} as={FaStar} color="gray.300" boxSize={size === 'sm' ? 4 : 5} />
    );
  }

  return <HStack spacing={1}>{stars}</HStack>;
};

const InteractiveStarRating = ({ value, onChange, error }) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <VStack align="start" spacing={2}>
      <HStack spacing={1}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Box
            key={star}
            as={FaStar}
            boxSize={6}
            color={star <= (hoverValue || value) ? 'yellow.400' : 'gray.300'}
            cursor="pointer"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            transition="color 0.2s"
            _hover={{ transform: 'scale(1.1)' }}
          />
        ))}
      </HStack>
      {value > 0 && (
        <Text fontSize="sm" color="white" fontWeight="medium">
          {value} star{value !== 1 ? 's' : ''}
        </Text>
      )}
      {error && (
        <Text fontSize="sm" color="red.500">
          {error}
        </Text>
      )}
    </VStack>
  );
};

const reviewSchema = yup.object({
  rating: yup
    .number()
    .min(1, 'Please select a rating')
    .max(5, 'Rating cannot exceed 5 stars')
    .required('Rating is required'),
  reviewText: yup
    .string()
    .max(1000, 'Review cannot exceed 1000 characters')
    .optional(),
});

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      reviewText: '',
    },
  });

  const watchedRating = watch('rating');
  const watchedReviewText = watch('reviewText');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await booksAPI.getBookById(id);
        setBookData(response.data.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
        if (error.response?.status === 404) {
          setError('Book not found');
        } else {
          setError('Failed to load book details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  const onSubmitReview = async (data) => {
    setReviewError('');
    setReviewSuccess(false);
    
    try {
      await booksAPI.addReview(id, data);
      setReviewSuccess(true);
      reset();
      onClose();
      
      const response = await booksAPI.getBookById(id);
      setBookData(response.data.data);
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewError(
        error.response?.data?.message || 'Failed to submit review. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={4} py={8}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading book details...</Text>
        </VStack>
      </Container>
    );
  }

  if (error || !bookData) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={4} py={8}>
          <Alert status="error">
            <AlertIcon />
            {error || 'Book not found'}
          </Alert>
          <Button as={RouterLink} to="/books" leftIcon={<HiArrowLeft />}>
            Back to Books
          </Button>
        </VStack>
      </Container>
    );
  }

  const { book, reviews } = bookData;
  const userHasReviewed = reviews.some(review => review.user._id === user?._id);

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8}>
        <HStack w="full" justify="flex-start">
          <Button
            as={RouterLink}
            to="/books"
            leftIcon={<HiArrowLeft />}
            variant="ghost"
            size="sm"
          >
            Back to Books
          </Button>
        </HStack>

        {reviewSuccess && (
          <Alert 
            status="success" 
            variant="solid"
            borderRadius="xl"
            p={6}
            fontSize="lg"
            fontWeight="semibold"
            shadow="xl"
            bg="green.500"
            color="white"
            border="3px solid"
            borderColor="green.300"
          >
            <AlertIcon boxSize={6} mr={4} />
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" fontSize="xl">
                🎉 Review submitted successfully!
              </Text>
              <Text fontSize="md" opacity={0.9}>
                Thank you for sharing your thoughts with the community.
              </Text>
            </VStack>
          </Alert>
        )}

        <Card w="full" bg={cardBg} border="1px" borderColor={borderColor} shadow="lg">
          <CardBody p={8}>
            <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8}>
              <VStack align="start" spacing={6}>
                <VStack align="start" spacing={4}>
                  <Heading size="xl" color="blue.600">
                    {book.title}
                  </Heading>
                  <Text fontSize="xl" color="white" fontWeight="medium">
                    by {book.author}
                  </Text>
                  <Badge colorScheme="blue" size="lg" px={3} py={1}>
                    {book.genre}
                  </Badge>
                </VStack>

                <VStack align="start" spacing={3}>
                  <HStack>
                    <StarRating rating={book.averageRating || 0} />
                    <Text fontWeight="bold" fontSize="lg">
                      {book.averageRating ? book.averageRating.toFixed(1) : '0.0'} / 5.0
                    </Text>
                  </HStack>
                  <Text color="white" fontWeight="medium">
                    Based on {book.reviewCount || 0} review{book.reviewCount !== 1 ? 's' : ''}
                  </Text>
                </VStack>
              </VStack>

              <VStack align="start" spacing={4}>
                {isAuthenticated ? (
                  userHasReviewed ? (
                    <Alert status="info" size="sm">
                      <AlertIcon />
                      You've already reviewed this book
                    </Alert>
                  ) : (
                    <Button
                      colorScheme="blue"
                      size="lg"
                      onClick={onOpen}
                      w="full"
                    >
                      Write a Review
                    </Button>
                  )
                ) : (
                  <VStack spacing={3}>
                    <Text textAlign="center" color="white" fontWeight="medium">
                      Sign in to write a review
                    </Text>
                    <Button
                      as={RouterLink}
                      to="/login"
                      colorScheme="blue"
                      size="lg"
                      w="full"
                    >
                      Sign In
                    </Button>
                  </VStack>
                )}
              </VStack>
            </Grid>
          </CardBody>
        </Card>

        <VStack w="full" spacing={6} align="start">
          <Heading size="lg">
            Reviews ({reviews.length})
          </Heading>

          {reviews.length === 0 ? (
            <Card w="full" bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody p={8} textAlign="center">
                <Text color="white" fontSize="lg" fontWeight="medium">
                  No reviews yet. Be the first to review this book!
                </Text>
              </CardBody>
            </Card>
          ) : (
            <VStack w="full" spacing={4}>
              {reviews.map((review) => (
                <Card key={review._id} w="full" bg={cardBg} border="1px" borderColor={borderColor}>
                  <CardBody p={6}>
                    <VStack align="start" spacing={4}>
                      <HStack justify="space-between" w="full">
                        <HStack>
                          <Avatar size="sm" name={review.user.name} />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="semibold">{review.user.name}</Text>
                            <Text fontSize="sm" color="gray.100" fontWeight="medium">
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Text>
                          </VStack>
                        </HStack>
                        <StarRating rating={review.rating} size="sm" />
                      </HStack>

                      {review.reviewText && (
                        <Text color="white" lineHeight="tall" fontWeight="medium">
                          {review.reviewText}
                        </Text>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          )}
        </VStack>

        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Write a Review for "{book.title}"</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form onSubmit={handleSubmit(onSubmitReview)}>
                <VStack spacing={6}>
                  {reviewError && (
                    <Alert status="error">
                      <AlertIcon />
                      {reviewError}
                    </Alert>
                  )}

                  <FormControl isInvalid={errors.rating}>
                    <FormLabel>Rating</FormLabel>
                    <InteractiveStarRating
                      value={watchedRating}
                      onChange={(rating) => setValue('rating', rating)}
                      error={errors.rating?.message}
                    />
                  </FormControl>

                  <FormControl isInvalid={errors.reviewText}>
                    <FormLabel>Review (Optional)</FormLabel>
                    <Textarea
                      placeholder="Share your thoughts about this book..."
                      value={watchedReviewText}
                      onChange={(e) => setValue('reviewText', e.target.value)}
                      rows={4}
                      resize="vertical"
                    />
                    <FormErrorMessage>
                      {errors.reviewText?.message}
                    </FormErrorMessage>
                    <Text fontSize="sm" color="gray.100" fontWeight="medium" mt={1}>
                      {1000 - (watchedReviewText?.length || 0)} characters remaining
                    </Text>
                  </FormControl>

                  <HStack w="full" justify="flex-end" spacing={4}>
                    <Button variant="ghost" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      isLoading={isSubmitting}
                      loadingText="Submitting..."
                    >
                      Submit Review
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default BookDetailPage; 