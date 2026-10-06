import "dotenv/config";
import express from "express";
import cookieParse from 'cookie-parser';
import cors from 'cors';
import { connectDd } from './config/db';
import authRoutes from './features/auth/auth.routes';
import clinicRoutes from './features/clinic/clinic.routes';
import doctorRoutes from './features/doctors/doctor.routes';
import patientRoutes from './features/patients/patient.routes';
import appointmentRoutes from './features/appointments/appointment.routes';
import scheduleRoutes from './features/schedules/schedule.routes';
import bookingRoutes from './features/booking/booking.routes';
import notificationRoutes from './features/notifications/notification.routes';

const app = express();
connectDd();
app.use(express.json());
app.use(cookieParse());

const allowed = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(url => url.trim()).filter(Boolean);

app.use(cors({
  origin: (o, cb) => cb(null, !o || allowed.includes(o)),
  credentials: true,
}));

app.get("/", (_, res) => res.json({
  msg: "Clinic server is active"
}));

app.use('/auth', authRoutes);
app.use('/clinics', clinicRoutes);
app.use('/doctors', doctorRoutes);
app.use('/patients', patientRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/schedules', scheduleRoutes);
app.use('/booking', bookingRoutes);
app.use('/notifications', notificationRoutes);

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 3000, () => console.log(`Running on port ${process.env.PORT || 3000}`));
}
