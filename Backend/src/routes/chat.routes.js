import expess from 'express';
import { authMiddleware } from "../middelware/auth.middleware.js";
import {sendMessage , getChats  , getMessages , deleteChat } from '../controller/chat.controller.js';

const router = expess.Router();

router.post('/message', authMiddleware, sendMessage); 
router.get('/get', authMiddleware, getChats);
router.get('/messages/:chatId', authMiddleware, getMessages);
router.delete('/chats/:chatId', authMiddleware, deleteChat);

export default router;