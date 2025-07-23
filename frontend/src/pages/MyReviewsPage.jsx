import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi';
import { reviewsAPI } from '../utils/api';

const StarRating = ({ rating, size = 'sm' }) => {
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

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await reviewsAPI.getUserReviews();
      setReviews(response.data.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load your reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={4} py={8}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading your reviews...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={4} py={8}>
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
          <Button onClick={fetchMyReviews}>Try Again</Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8}>
        <HStack w="full" justify="space-between">
          <Button
            as={RouterLink}
            to="/"
            leftIcon={<HiArrowLeft />}
            variant="ghost"
            size="sm"
          >
            Back to Home
          </Button>
        </HStack>

        <VStack spacing={6} align="start" w="full">
          <Heading size="xl">My Reviews</Heading>
          <Text color="gray.600">
            You have written {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </Text>

          {reviews.length === 0 ? (
            <Card w="full" bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody p={8} textAlign="center">
                <VStack spacing={4}>
                  <Text fontSize="lg" color="gray.500">
                    You haven't written any reviews yet
                  </Text>
                  <Button as={RouterLink} to="/books" colorScheme="blue">
                    Browse Books to Review
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            <VStack w="full" spacing={4}>
              {reviews.map((review) => (
                <Card key={review._id} w="full" bg={cardBg} border="1px" borderColor={borderColor}>
                  <CardBody p={6}>
                    <VStack align="start" spacing={4}>
                      <VStack align="start" spacing={2}>
                        <Button
                          as={RouterLink}
                          to={`/books/${review.book._id}`}
                          variant="link"
                          size="lg"
                          fontWeight="bold"
                          color="blue.600"
                          p={0}
                          h="auto"
                          textAlign="left"
                        >
                          {review.book.title}
                        </Button>
                        <Text color="gray.600">by {review.book.author}</Text>
                        <Badge colorScheme="blue" variant="subtle">
                          {review.book.genre}
                        </Badge>
                      </VStack>

                      <HStack justify="space-between" w="full">
                        <StarRating rating={review.rating} />
                        <Text fontSize="sm" color="gray.500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Text>
                      </HStack>

                      {review.reviewText && (
                        <Text color="gray.700" lineHeight="tall">
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
      </VStack>
    </Container>
  );
};

export default MyReviewsPage; 