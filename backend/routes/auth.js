import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);

router.post('/login', validateLogin, loginUser);


router.get('/profile', auth, getUserProfile);

export default router; 