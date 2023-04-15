import express from 'express';
import { requireAuth } from '../middleware/requireAuth';
import {
  getChatHistory,
  createNewMessage,
} from '../controllers/chatController';
const router = express.Router();

router.use(requireAuth);

router.get('/', getChatHistory);
router.post('/', createNewMessage);

export default router;
