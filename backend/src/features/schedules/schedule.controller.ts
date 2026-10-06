import type { Request, Response } from 'express';
import User from '../auth/auth.model';
import Doctor from '../doctors/doctor.model';
import Schedule from './schedule.model';
import { scheduleSchema } from './schedule.schema';
export const createSchedule = async (req: Request, res: Response) => {
  try {
    const r = scheduleSchema.safeParse(req.body);
    if (!r.success) return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors: r.error.issues
    });
    const u = await User.findById(req.user!.id).select('clinicId');
    const d = await Doctor.findOne({
      _id: r.data.doctorId,
      clinicId: u?.clinicId,
      active: true
    });
    if (!d) return res.status(404).json({
      success: false,
      message: 'Doctor not found'
    });
    if (r.data.startTime >= r.data.endTime) return res.status(400).json({
      success: false,
      message: 'Start time must be before end time'
    });
    const s = await Schedule.create({
      ...r.data,
      clinicId: u!.clinicId
    });
    res.status(201).json({
      success: true,
      message: 'Schedule created',
      schedule: s
    });
  } catch (e: any) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: e.message
    });
  }
};
export const getSchedules = async (req: Request, res: Response) => {
  try {
    const u = await User.findById(req.user!.id).select('clinicId');
    const schedules = await Schedule.find({
      clinicId: u?.clinicId
    }).populate('doctorId', 'name specialization').sort({
      dayOfWeek: 1,
      startTime: 1
    });
    res.json({
      success: true,
      schedules
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const r = scheduleSchema.partial().safeParse(req.body);
    if (!r.success) return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors: r.error.issues
    });
    const u = await User.findById(req.user!.id).select('clinicId');
    const s = await Schedule.findOneAndUpdate({
      _id: req.params.id,
      clinicId: u?.clinicId
    }, r.data, {
      returnDocument: 'after',
      runValidators: true
    });
    if (!s) return res.status(404).json({
      success: false,
      message: 'Schedule not found'
    });
    res.json({
      success: true,
      message: 'Schedule updated',
      schedule: s
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const u = await User.findById(req.user!.id).select('clinicId');
    const s = await Schedule.findOneAndDelete({
      _id: req.params.id,
      clinicId: u?.clinicId
    });
    if (!s) return res.status(404).json({
      success: false,
      message: 'Schedule not found'
    });
    res.json({
      success: true,
      message: 'Schedule deleted'
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
