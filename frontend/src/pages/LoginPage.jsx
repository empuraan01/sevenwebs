import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Alert,
  AlertIcon,
  Link,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';


const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginPage = () => {
  const [apiError, setApiError] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/books';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setApiError('');
    
    const result = await login(data);
    
    if (!result.success) {
      setApiError(result.message);
    } else {
      const from = location.state?.from?.pathname || '/books';
      navigate(from, { replace: true });
    }
  };

  if (isLoading) {
    return (
      <Container maxW="md" py={12}>
        <VStack spacing={4}>
          <Text>Loading...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="md" py={12}>
      <VStack spacing={8}>
        <VStack spacing={4} textAlign="center">
          <Heading size="xl" color="blue.600">
            Welcome Back
          </Heading>
          <Text color="gray.600">
            Sign in to your account to continue
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
              {apiError && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {apiError}
                </Alert>
              )}

              <FormControl isInvalid={errors.email}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  size="lg"
                  {...register('email')}
                />
                <FormErrorMessage>
                  {errors.email?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  size="lg"
                  {...register('password')}
                />
                <FormErrorMessage>
                  {errors.password?.message}
                </FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                isLoading={isSubmitting}
                loadingText="Signing In..."
              >
                Sign In
              </Button>
            </VStack>
          </form>
        </Box>

        <HStack w="full">
          <Divider />
          <Text fontSize="sm" color="gray.500" px={3}>
            OR
          </Text>
          <Divider />
        </HStack>

        <VStack spacing={4} textAlign="center">
          <Text color="gray.600">
            Don't have an account?{' '}
            <Link
              as={RouterLink}
              to="/signup"
              color="blue.500"
              fontWeight="semibold"
              _hover={{ textDecoration: 'underline' }}
            >
              Sign up here
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

export default LoginPage; 