import type { Request, Response } from 'express';
import Clinic from '../clinic/clinic.model';
import Doctor from '../doctors/doctor.model';
import Schedule from '../schedules/schedule.model';
import Patient from '../patients/patient.model';
import Appointment from '../appointments/appointment.model';
import { appointmentSchema } from '../appointments/appointment.schema';
// Public patient flow: no account or auth cookie is required.
export const getClinicBooking = async (req: Request, res: Response) => {
  try {
    const clinic = await Clinic.findOne({
      slug: req.params.clinicSlug,
      bookingEnabled: true
    }).select('name slug phone email address timezone');
    if (!clinic) return res.status(404).json({
      success: false,
      message: 'Clinic not found'
    });
    const doctors = await Doctor.find({
      clinicId: clinic._id,
      active: true
    }).select('name specialization bio image');
    res.json({
      success: true,
      clinic,
      doctors
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
export const getBookingDoctors = async (req: Request, res: Response) => {
  try {
    const c = await Clinic.findOne({
      slug: req.params.clinicSlug,
      bookingEnabled: true
    });
    if (!c) return res.status(404).json({
      success: false,
      message: 'Clinic not found'
    });
    const doctors = await Doctor.find({
      clinicId: c._id,
      active: true
    }).select('name specialization bio image');
    res.json({
      success: true,
      doctors
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
export const getSlots = async (req: Request, res: Response) => {
  try {
    const c = await Clinic.findOne({
      slug: req.params.clinicSlug,
      bookingEnabled: true
    });
    if (!c) return res.status(404).json({
      success: false,
      message: 'Clinic not found'
    });
    const { doctorId, date } = req.query as {
      doctorId: string;
      date: string;
    };
    if (!doctorId || !date) return res.status(400).json({
      success: false,
      message: 'doctorId and date required'
    });
    const day = new Date(`${date}T00:00:00`).getDay();
    const s = await Schedule.findOne({
      clinicId: c._id,
      doctorId,
      dayOfWeek: day
    });
    if (!s) return res.json({
      success: true,
      slots: []
    });
    const booked = await Appointment.find({
      clinicId: c._id,
      doctorId,
      date,
      status: {
        $nin: ['CANCELLED',
        'NO_SHOW']
      }
    }).select('time');
    const used = new Set(booked.map(x => x.time));
    const slots: string[] = [];
    let[h,
    m] = s.startTime.split(':').map(Number);
    const[eh,
    em] = s.endTime.split(':').map(Number);
    while (h < eh || (h === eh && m < em)) {
      const t = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      if (!used.has(t)) slots.push(t);
      m += s.slotDuration;
      h += Math.floor(m / 60);
      m %= 60;
    }
    res.json({
      success: true,
      slots
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
export const createPublicBooking = async (req: Request, res: Response) => {
  try {
    const r = appointmentSchema.safeParse(req.body);
    if (!r.success) return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors: r.error.issues
    });
    const c = await Clinic.findOne({
      slug: req.params.clinicSlug,
      bookingEnabled: true
    });
    if (!c) return res.status(404).json({
      success: false,
      message: 'Clinic not found'
    });
    const d = await Doctor.findOne({
      _id: r.data.doctorId,
      clinicId: c._id,
      active: true
    });
    if (!d) return res.status(404).json({
      success: false,
      message: 'Doctor not found'
    });
    const day = new Date(`${r.data.date}T00:00:00`).getDay();
    const s = await Schedule.findOne({
      clinicId: c._id,
      doctorId: d._id,
      dayOfWeek: day
    });
    if (!s || r.data.time < s.startTime || r.data.time >= s.endTime) return res.status(400).json({
      success: false,
      message: 'Doctor is not available at this time'
    });
    const exists = await Appointment.findOne({
      clinicId: c._id,
      doctorId: d._id,
      date: r.data.date,
      time: r.data.time,
      status: {
        $nin: ['CANCELLED',
        'NO_SHOW']
      }
    });
    if (exists) return res.status(409).json({
      success: false,
      message: 'Appointment slot is already booked'
    });
    const patientData = {
      name: req.body.patient?.name,
      phone: req.body.patient?.phone,
      email: req.body.patient?.email
    };
    if (!patientData.name || !patientData.phone) return res.status(400).json({
      success: false,
      message: 'Patient name and phone are required'
    });
    let patient = await Patient.findOne({
      clinicId: c._id,
      phone: patientData.phone
    });
    if (patient) patient = await Patient.findByIdAndUpdate(patient._id, patientData, {
      returnDocument: 'after'
    });
    else patient = await Patient.create({
      ...patientData,
      clinicId: c._id
    });
    const appointment = await Appointment.create({
      ...r.data,
      clinicId: c._id,
      patientId: patient._id,
      source: 'PUBLIC'
    });
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (e: any) {
    if (e?.code === 11000) return res.status(409).json({
      success: false,
      message: 'Patient already exists'
    });
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: e.message
    });
  }
};
