import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Select,
  Button,
  Grid,
  Card,
  CardBody,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  IconButton,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { HiSearch, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import { booksAPI } from '../utils/api';


const StarRating = ({ rating, size = 'sm' }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const decimal = rating % 1;
  
  const hasHalfStar = decimal >= 0.3 && decimal < 0.8;
  
  const displayStars = decimal >= 0.8 ? fullStars + 1 : fullStars;
  
  for (let i = 0; i < displayStars; i++) {
    stars.push(
      <Box key={i} as={FaStar} color="yellow.400" boxSize={size === 'sm' ? 3 : 4} />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <Box key="half" as={FaStarHalf} color="yellow.400" boxSize={size === 'sm' ? 3 : 4} />
    );
  }

  const totalShownStars = displayStars + (hasHalfStar ? 1 : 0);
  const emptyStars = 5 - totalShownStars;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Box key={`empty-${i}`} as={FaStar} color="gray.300" boxSize={size === 'sm' ? 3 : 4} />
    );
  }

  return <HStack spacing={1}>{stars}</HStack>;
};

const BookCard = ({ book }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Card
      as={RouterLink}
      to={`/books/${book._id}`}
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
      shadow="md"
      _hover={{
        shadow: 'lg',
        transform: 'translateY(-2px)',
        borderColor: 'blue.300',
      }}
      transition="all 0.2s"
      cursor="pointer"
    >
      <CardBody p={6}>
        <VStack align="start" spacing={4}>
          <Heading size="md" color="blue.600" noOfLines={2}>
            {book.title}
          </Heading>

          <Text color="gray.600" fontWeight="medium">
            by {book.author}
          </Text>

          <Badge colorScheme="blue" variant="subtle" size="sm">
            {book.genre}
          </Badge>

          <VStack align="start" spacing={2}>
            <HStack>
              <StarRating rating={book.averageRating || 0} />
              <Text fontSize="sm" color="gray.500">
                ({book.reviewCount || 0} reviews)
              </Text>
            </HStack>
            {book.averageRating > 0 && (
              <Text fontSize="sm" fontWeight="bold" color="gray.700">
                {book.averageRating.toFixed(1)} / 5.0
              </Text>
            )}
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const showPages = Math.min(5, totalPages);
  const startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  const endPage = Math.min(totalPages, startPage + showPages - 1);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <HStack spacing={2}>
      <IconButton
        icon={<HiChevronLeft />}
        isDisabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        variant="outline"
        size="sm"
      />
      
      {pages.map(page => (
        <Button
          key={page}
          size="sm"
          variant={page === currentPage ? 'solid' : 'outline'}
          colorScheme={page === currentPage ? 'blue' : 'gray'}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      
      <IconButton
        icon={<HiChevronRight />}
        isDisabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        variant="outline"
        size="sm"
      />
    </HStack>
  );
};

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    author: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12,
  });

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
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await booksAPI.getBooks(filters);
        setBooks(response.data.data.books);
        setPagination(response.data.data.pagination);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to load books. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value, 
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <VStack spacing={4} textAlign="center">
          <Heading size="xl" color="blue.600">
            Discover Books
          </Heading>
          <Text color="gray.600" maxW="2xl">
            Browse our collection of books, filter by genre or author, and find your next great read.
          </Text>
        </VStack>

        <Box w="full" bg="white" p={6} borderRadius="xl" shadow="sm" border="1px" borderColor="gray.200">
          <VStack spacing={6}>
                          <Box w="full">
                <form onSubmit={handleSearchSubmit}>
                  <InputGroup size="lg" maxW="600px" mx="auto">
                    <InputLeftElement pointerEvents="none" pl={4}>
                      <Box as={HiSearch} color="gray.400" boxSize={5} />
                    </InputLeftElement>
                    <Input
                      placeholder="Search books by title or author..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      bg="gray.50"
                      border="2px"
                      borderColor="gray.200"
                      borderRadius="full"
                      pl={12}
                      pr={6}
                      py={6}
                      fontSize="md"
                      color="black"
                      _hover={{
                        borderColor: "blue.300",
                        bg: "white"
                      }}
                      _focus={{
                        borderColor: "blue.500",
                        bg: "white",
                        boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)"
                      }}
                      _placeholder={{ 
                        color: "gray.500",
                        fontSize: "md"
                      }}
                    />
                  </InputGroup>
                </form>
              </Box>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4} w="full">
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Genre</Text>
                <Select
                  placeholder="All Genres"
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Author</Text>
                <Input
                  placeholder="Filter by author"
                  value={filters.author}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                />
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Sort By</Text>
                <Select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="createdAt">Newest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="author">Author A-Z</option>
                  <option value="averageRating">Highest Rated</option>
                  <option value="reviewCount">Most Reviewed</option>
                </Select>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Order</Text>
                <Select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </Select>
              </Box>
            </Grid>
          </VStack>
        </Box>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {loading ? (
          <VStack spacing={4} py={8}>
            <Spinner size="xl" color="blue.500" />
            <Text>Loading books...</Text>
          </VStack>
        ) : books.length === 0 ? (
          <VStack spacing={4} py={8}>
            <Text fontSize="lg" color="gray.600">
              No books found matching your criteria.
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => setFilters({
                search: '',
                genre: '',
                author: '',
                sortBy: 'createdAt',
                sortOrder: 'desc',
                page: 1,
                limit: 12,
              })}
            >
              Clear Filters
            </Button>
          </VStack>
        ) : (
          <>
            <Flex justify="space-between" align="center" w="full">
              <Text color="gray.600">
                Showing {books.length} of {pagination.totalBooks} books
              </Text>
              <Text fontSize="sm" color="gray.500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </Text>
            </Flex>

            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(4, 1fr)',
              }}
              gap={6}
              w="full"
            >
              {books.map(book => (
                <BookCard key={book._id} book={book} />
              ))}
            </Grid>

            
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => handleFilterChange('page', page)}
              />
            )}
          </>
        )}
      </VStack>
    </Container>
  );
};

export default BooksPage; 