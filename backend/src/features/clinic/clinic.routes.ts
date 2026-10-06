import { Router } from 'express';
import { getMyClinic, updateMyClinic } from './clinic.controller';
import { authMiddleware } from '../../middleware/auth';
const router = Router();

router.get('/me', authMiddleware, getMyClinic);
router.patch('/me', authMiddleware, updateMyClinic);

export default router;
