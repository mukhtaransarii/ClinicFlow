import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { getPatients, getPatient, updatePatient } from './patient.controller';
const router = Router();
router.use(authMiddleware);
router.get('/', getPatients);
router.get('/:id', getPatient);
router.patch('/:id', updatePatient);
export default router;
