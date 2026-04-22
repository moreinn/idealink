import express from 'express';
import {
  register, login, getMe, updateProfile,
  getUserProfile, updateSocial, submitVerification, updateRole
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.get('/user/:id', getUserProfile);
router.patch('/me/social', protect, updateSocial);
router.patch('/me/role', protect, updateRole);
router.post('/me/verify', protect, upload.single('document'), submitVerification);

export default router;