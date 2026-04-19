import express from 'express';
import { createIdea, getIdeas, getIdea, updateIdea, deleteIdea } from '../controllers/ideaController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getIdeas);
router.get('/:id', getIdea);
router.post('/', protect, createIdea);
router.put('/:id', protect, updateIdea);
router.delete('/:id', protect, deleteIdea);

export default router;