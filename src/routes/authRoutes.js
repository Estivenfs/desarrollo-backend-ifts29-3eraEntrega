import express from 'express';
import authController from '../controllers/authController.js';
import { requireAuth, requireRole } from '../middleware/index.js';

const router = express.Router();

router.post('/register', requireAuth, requireRole(['Administrativo']), authController.register);
router.post('/login', authController.login);
router.post('/logout', requireAuth, authController.logout);

export default router;