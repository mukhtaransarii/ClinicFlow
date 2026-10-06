import mongoose from 'mongoose';

export const APPOINTMENT_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'CHECKED_IN',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
  'RESCHEDULED'
] as const;

const appointmentSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clinic',
    required: true,
    index: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctor',
    required: true,
    index: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient',
    required: true,
    index: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  status: {
    type: String,
    enum: APPOINTMENT_STATUSES,
    default: 'PENDING',
    index: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  source: {
    type: String,
    enum: ['PUBLIC', 'ADMIN'],
    default: 'PUBLIC'
  }
}, { timestamps: true, versionKey: false });

appointmentSchema.index({
  clinicId: 1,
  doctorId: 1,
  date: 1,
  time: 1,
  status: 1
});

const Appointment = mongoose.model('appointment', appointmentSchema);

export default Appointment;
