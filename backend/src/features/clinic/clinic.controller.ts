import type { Request, Response } from 'express';
import Clinic from './clinic.model';
import { updateClinicSchema } from './clinic.schema';
import User from '../auth/auth.model';

export const getMyClinic = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select('clinicId');
    if (!user) return res.status(404).json({
      success: false,
      message: 'User not found'
    });
    
    const clinic = await Clinic.findById(user.clinicId);
    if (!clinic) return res.status(404).json({
      success: false,
      message: 'Clinic not found'
    });
    res.json({
      success: true,
      clinic
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};

export const updateMyClinic = async (req: Request, res: Response) => {
  try {
    const result = updateClinicSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors: result.error.issues
    });
    const user = await User.findById(req.user!.id).select('clinicId');
    if (!user) return res.status(404).json({
      success: false,
      message: 'User not found'
    });
    const clinic = await Clinic.findByIdAndUpdate(user.clinicId, result.data, {
      returnDocument: 'after',
      runValidators: true
    });
    if (!clinic) return res.status(404).json({
      success: false,
      message: 'Clinic not found'
    });
    res.json({
      success: true,
      message: 'Clinic updated',
      clinic
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};
