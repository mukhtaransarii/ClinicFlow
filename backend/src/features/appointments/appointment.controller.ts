import type { Request, Response } from 'express';
import User from '../auth/auth.model';
import Appointment from './appointment.model';
import Doctor from '../doctors/doctor.model';
import Patient from '../patients/patient.model';
import Schedule from '../schedules/schedule.model';
import { appointmentSchema, statusSchema } from './appointment.schema';
// Every clinic query is scoped through the logged-in admin's clinicId.
const cid = async (id: string) => (await User.findById(id).select('clinicId'))?.clinicId;
// Check the doctor's weekly schedule before allowing a booking.
const validSlot = async (clinicId: any, doctorId: string, date: string, time: string) => {
  const day = new Date(`${date}T00:00:00`).getDay();
  const s = await Schedule.findOne({
    clinicId,
    doctorId,
    dayOfWeek: day
  });
  return!!s && time >= s.startTime && time < s.endTime;
};
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const r = appointmentSchema.safeParse(req.body);
    if (!r.success) return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors: r.error.issues
    });
    const id = await cid(req.user!.id);
    const d = await Doctor.findOne({
      _id: r.data.doctorId,
      clinicId: id,
      active: true
    });
    if (!d) return res.status(404).json({
      success: false,
      message: 'Doctor not found'
    });
    if (!await validSlot(id, r.data.doctorId, r.data.date, r.data.time)) return res.status(400).json({
      success: false,
      message: 'Doctor is not available at this time'
    });
    const a = await Appointment.findOne({
      clinicId: id,
      doctorId: r.data.doctorId,
      date: r.data.date,
      time: r.data.time,
      status: {
        $nin: ['CANCELLED',
        'NO_SHOW']
      }
    });
    if (a) return res.status(409).json({
      success: false,
      message: 'Appointment slot is already booked'
    });
    const patientId = req.body.patientId;
    const p = await Patient.findOne({
      _id: patientId,
      clinicId: id
    });
    if (!p) return res.status(404).json({
      success: false,
      message: 'Patient not found'
    });
    const ap = await Appointment.create({
      ...r.data,
      clinicId: id,
      patientId,
      source: 'ADMIN'
    });
    res.status(201).json({
      success: true,
      message: 'Appointment created',
      appointment: ap
    });
  } catch (e: any) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: e.message
    });
  }
};
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const id = await cid(req.user!.id);
    const filter: any = {
      clinicId: id
    };
    if (req.query.doctorId) filter.doctorId = req.query.doctorId;
    if (req.query.date) filter.date = req.query.date;
    if (req.query.status) filter.status = req.query.status;
    const appointments = await Appointment.find(filter).populate('doctorId', 'name specialization').populate('patientId', 'name phone email').sort({
      date: 1,
      time: 1
    });
    res.json({
      success: true,
      appointments
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
export const getAppointment = async (req: Request, res: Response) => {
  try {
    const id = await cid(req.user!.id);
    const a = await Appointment.findOne({
      _id: req.params.id,
      clinicId: id
    }).populate('doctorId', 'name specialization').populate('patientId', 'name phone email');
    if (!a) return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
    res.json({
      success: true,
      appointment: a
    });
  } catch {
    res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }
};
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const r = statusSchema.safeParse(req.body);
    if (!r.success) return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors: r.error.issues
    });
    const id = await cid(req.user!.id);
    const a = await Appointment.findOneAndUpdate({
      _id: req.params.id,
      clinicId: id
    }, r.data, {
      returnDocument: 'after',
      runValidators: true
    });
    if (!a) return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
    res.json({
      success: true,
      message: 'Appointment updated',
      appointment: a
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
export const cancelAppointment = async (req: Request, res: Response) => {
  req.body.status = 'CANCELLED';
  return updateAppointment(req, res);
};
