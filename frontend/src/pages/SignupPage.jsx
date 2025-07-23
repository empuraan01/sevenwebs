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
  AlertDescription,
  Link,
  Divider,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { HiCheck } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const signupSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .required('Full name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .matches(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .matches(/(?=.*\d)/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const SignupPage = () => {
  const [apiError, setApiError] = useState('');
  const [apiErrors, setApiErrors] = useState([]);
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/books', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setApiError('');
    setApiErrors([]);
    
    const result = await registerUser(data);
    
    if (!result.success) {
      setApiError(result.message);
      if (result.errors && result.errors.length > 0) {
        setApiErrors(result.errors);
      }
    } else {
      navigate('/books', { replace: true });
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
            Join BookReview
          </Heading>
          <Text color="gray.600">
            Create your account to start discovering amazing books
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
                  <AlertDescription>
                    {apiError}
                    {apiErrors.length > 0 && (
                      <List spacing={1} mt={2}>
                        {apiErrors.map((error, index) => (
                          <ListItem key={index} fontSize="sm">
                            • {error.msg || error.message}
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <FormControl isInvalid={errors.name}>
                <FormLabel>Full Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  size="lg"
                  {...register('name')}
                />
                <FormErrorMessage>
                  {errors.name?.message}
                </FormErrorMessage>
              </FormControl>

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
                  placeholder="Create a password"
                  size="lg"
                  {...register('password')}
                />
                <FormErrorMessage>
                  {errors.password?.message}
                </FormErrorMessage>
                
                {password && (
                  <Box mt={2} p={3} bg="gray.50" borderRadius="md" fontSize="sm">
                    <Text fontWeight="semibold" mb={2}>Password Requirements:</Text>
                    <List spacing={1}>
                      <ListItem>
                        <ListIcon
                          as={HiCheck}
                          color={password.length >= 6 ? 'green.500' : 'gray.400'}
                        />
                        At least 6 characters
                      </ListItem>
                      <ListItem>
                        <ListIcon
                          as={HiCheck}
                          color={/(?=.*[a-z])/.test(password) ? 'green.500' : 'gray.400'}
                        />
                        One lowercase letter
                      </ListItem>
                      <ListItem>
                        <ListIcon
                          as={HiCheck}
                          color={/(?=.*[A-Z])/.test(password) ? 'green.500' : 'gray.400'}
                        />
                        One uppercase letter
                      </ListItem>
                      <ListItem>
                        <ListIcon
                          as={HiCheck}
                          color={/(?=.*\d)/.test(password) ? 'green.500' : 'gray.400'}
                        />
                        One number
                      </ListItem>
                    </List>
                  </Box>
                )}
              </FormControl>

              <FormControl isInvalid={errors.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  size="lg"
                  {...register('confirmPassword')}
                />
                <FormErrorMessage>
                  {errors.confirmPassword?.message}
                </FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                isLoading={isSubmitting}
                loadingText="Creating Account..."
              >
                Create Account
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
            Already have an account?{' '}
            <Link
              as={RouterLink}
              to="/login"
              color="blue.500"
              fontWeight="semibold"
              _hover={{ textDecoration: 'underline' }}
            >
              Sign in here
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

export default SignupPage; 