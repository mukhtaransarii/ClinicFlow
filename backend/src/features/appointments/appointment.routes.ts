import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { createAppointment, getAppointments, getAppointment, updateAppointment, cancelAppointment } from './appointment.controller';
const router = Router();

router.use(authMiddleware);
router.post('/', createAppointment);
router.get('/', getAppointments);
router.get('/:id', getAppointment);
router.patch('/:id', updateAppointment);
router.delete('/:id', cancelAppointment);

export default router;
