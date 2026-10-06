import { Router } from 'express';
import { getClinicBooking, getBookingDoctors, getSlots, createPublicBooking } from './booking.controller';
const router = Router();
router.get('/:clinicSlug', getClinicBooking);
router.get('/:clinicSlug/doctors', getBookingDoctors);
router.get('/:clinicSlug/slots', getSlots);
router.post('/:clinicSlug/appointments', createPublicBooking);
export default router;
