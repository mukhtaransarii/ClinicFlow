import type { Request, Response } from 'express';
import User from '../auth/auth.model';
import Doctor from './doctor.model';
import { doctorSchema } from './doctor.schema';

const clinicId = async (id: string) => (await User.findById(id).select('clinicId'))?.clinicId;

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const result = doctorSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors: result.error.issues
    });
    const id = await clinicId(req.user!.id);
    if (!id) return res.status(404).json({
      success: false,
      message: 'Clinic not found'
    });
    const doctor = await Doctor.create({
      ...result.data,
      clinicId: id
    });
    res.status(201).json({
      success: true,
      message: 'Doctor created',
      doctor
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};
export const getDoctors = async (req: Request, res: Response) => {
  try {
    const id = await clinicId(req.user!.id);
    if (!id) return res.status(404).json({
      success: false,
      message: 'Clinic not found'
    });
    const doctors = await Doctor.find({
      clinicId: id
    }).sort({
      createdAt: - 1
    });
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
export const getDoctor = async (req: Request, res: Response) => {
  try {
    const id = await clinicId(req.user!.id);
    const doctor = await Doctor.findOne({
      _id: req.params.id,
      clinicId: id
    });
    if (!doctor) return res.status(404).json({
      success: false,
      message: 'Doctor not found'
    });
    res.json({
      success: true,
      doctor
    });
  } catch {
    res.status(404).json({
      success: false,
      message: 'Doctor not found'
    });
  }
};
export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const result = doctorSchema.partial().safeParse(req.body);
    if (!result.success) return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors: result.error.issues
    });
    const id = await clinicId(req.user!.id);
    const doctor = await Doctor.findOneAndUpdate({
      _id: req.params.id,
      clinicId: id
    }, result.data, {
      returnDocument: 'after',
      runValidators: true
    });
    if (!doctor) return res.status(404).json({
      success: false,
      message: 'Doctor not found'
    });
    res.json({
      success: true,
      message: 'Doctor updated',
      doctor
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const id = await clinicId(req.user!.id);
    const doctor = await Doctor.findOneAndUpdate({
      _id: req.params.id,
      clinicId: id
    }, {
      active: false
    }, {
      returnDocument: 'after'
    });
    if (!doctor) return res.status(404).json({
      success: false,
      message: 'Doctor not found'
    });
    res.json({
      success: true,
      message: 'Doctor disabled'
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
