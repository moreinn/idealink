import express from 'express';
import {
  sendRequest, respondToRequest,
  getMyConnections, getMyRequests, getMessages
} from '../controllers/connectionController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/request', protect, sendRequest);
router.put('/request/:id', protect, respondToRequest);
router.get('/mine', protect, getMyConnections);
router.get('/requests', protect, getMyRequests);
router.get('/:id/messages', protect, getMessages);

export default router;