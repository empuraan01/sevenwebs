import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaBook, FaStar, FaUsers, FaSearch } from 'react-icons/fa';

const Feature = ({ title, text, icon }) => {
  return (
    <VStack
      p={6}
      bg={useColorModeValue('white', 'gray.800')}
      rounded="lg"
      shadow="md"
      spacing={4}
      align="center"
    >
      <Icon as={icon} w={10} h={10} color="blue.500" />
      <Heading size="md" textAlign="center">
        {title}
      </Heading>
      <Text textAlign="center" color="gray.600">
        {text}
      </Text>
    </VStack>
  );
};

const HomePage = () => {
  return (
    <Box>
      <Box
        bgGradient="linear(to-r, blue.400, blue.600)"
        color="white"
        py={20}
      >
        <Container maxW="container.lg">
          <VStack spacing={8} textAlign="center">
            <Heading size="2xl" fontWeight="bold">
              📚 Discover Your Next Great Read
            </Heading>
            <Text fontSize="xl" maxW="2xl">
              Join our community of book lovers. Discover new books, share your thoughts, 
              and help others find their perfect read through honest reviews and ratings.
            </Text>
            <HStack spacing={6}>
              <Button
                as={RouterLink}
                to="/books"
                size="lg"
                bg="white"
                color="blue.600"
                _hover={{ 
                  bg: "gray.50",
                  transform: "translateY(-2px)",
                  shadow: "lg"
                }}
                _active={{ transform: "translateY(0)" }}
                fontWeight="semibold"
                px={8}
                py={6}
                borderRadius="xl"
                transition="all 0.2s"
              >
                Browse Books
              </Button>
              <Button
                as={RouterLink}
                to="/signup"
                size="lg"
                variant="outline"
                borderColor="white"
                color="white"
                bg="transparent"
                _hover={{ 
                  bg: "whiteAlpha.200",
                  transform: "translateY(-2px)",
                  shadow: "lg"
                }}
                _active={{ transform: "translateY(0)" }}
                fontWeight="semibold"
                px={8}
                py={6}
                borderRadius="xl"
                borderWidth="2px"
                transition="all 0.2s"
              >
                Join Community
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.lg" py={16}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading size="lg">Why Choose BookReview?</Heading>
            <Text color="gray.600" maxW="2xl">
              Our platform makes it easy to discover, review, and share your favorite books 
              with a community of passionate readers.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            <Feature
              icon={FaBook}
              title="Vast Library"
              text="Browse through thousands of books across all genres and find your next favorite read."
            />
            <Feature
              icon={FaStar}
              title="Honest Reviews"
              text="Read and write authentic reviews to help others make informed reading choices."
            />
            <Feature
              icon={FaUsers}
              title="Community"
              text="Connect with fellow book lovers and discover recommendations from like-minded readers."
            />
            <Feature
              icon={FaSearch}
              title="Smart Search"
              text="Find books easily with our advanced filtering and search capabilities."
            />
          </SimpleGrid>
        </VStack>
      </Container>


      <Box bg="gray.50" py={16}>
        <Container maxW="container.lg">
          <VStack spacing={8} textAlign="center">
            <Heading size="lg">Ready to Start Your Reading Journey?</Heading>
            <Text fontSize="lg" color="gray.600">
              Join thousands of readers who are already discovering amazing books.
            </Text>
            <Button
              as={RouterLink}
              to="/signup"
              size="lg"
              colorScheme="blue"
            >
              Get Started Today
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 