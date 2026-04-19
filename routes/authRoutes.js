import express from 'express';
import { register, login, getMe, updateProfile, getUserProfile,  updateSocial } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.get('/user/:id', getUserProfile);
router.patch('/me/social', protect, updateSocial);

export default router;