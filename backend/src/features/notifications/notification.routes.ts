import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { getNotifications, markNotificationRead } from './notification.controller';
const router = Router();
router.use(authMiddleware);
router.get('/', getNotifications);
router.patch('/:id/read', markNotificationRead);
export default router;
