import React from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Avatar,
} from '@chakra-ui/react';
import { HiMenu, HiX, HiPlus } from 'react-icons/hi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavLink = ({ children, to, ...rest }) => (
  <Button
    as={RouterLink}
    to={to}
    variant="ghost"
    colorScheme="blue"
    {...rest}
  >
    {children}
  </Button>
);

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} px={4} shadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        
        <HStack spacing={8} alignItems="center">
          <Box>
            <Text
              as={RouterLink}
              to="/"
              fontSize="xl"
              fontWeight="bold"
              color="blue.500"
              _hover={{ textDecoration: 'none', color: 'blue.600' }}
            >
              BookReview
            </Text>
          </Box>
          
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/books">Books</NavLink>
            {isAuthenticated && (
                             <NavLink to="/add-book" leftIcon={<HiPlus />}>
                Add Book
              </NavLink>
            )}
          </HStack>
        </HStack>


        <Flex alignItems="center">
          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minW={0}
                >
                  <HStack>
                    <Avatar size="sm" name={user?.name} />
                    <Text>{user?.name}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/reviews/my-reviews">
                    My Reviews
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button as={RouterLink} to="/login" variant="ghost">
                  Login
                </Button>
                <Button as={RouterLink} to="/signup" colorScheme="blue">
                  Sign Up
                </Button>
              </>
            )}
          </HStack>


          <IconButton
            size="md"
            icon={isOpen ? <HiX /> : <HiMenu />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
        </Flex>
      </Flex>


      {isOpen && (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={4}>
            <NavLink to="/" onClick={onClose}>Home</NavLink>
            <NavLink to="/books" onClick={onClose}>Books</NavLink>
            
            {isAuthenticated ? (
              <>
                <NavLink to="/add-book" onClick={onClose}>Add Book</NavLink>
                <NavLink to="/reviews/my-reviews" onClick={onClose}>My Reviews</NavLink>
                <Button variant="ghost" onClick={() => { handleLogout(); onClose(); }}>
                  Logout ({user?.name})
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={onClose}>Login</NavLink>
                <NavLink to="/signup" onClick={onClose}>Sign Up</NavLink>
              </>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Navbar; 