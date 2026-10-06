import type { Request, Response } from 'express';
import User from '../auth/auth.model';
import Patient from './patient.model';
import { patientSchema } from './patient.schema';
const cid = async (id: string) => (await User.findById(id).select('clinicId'))?.clinicId;
export const getPatients = async (req: Request, res: Response) => {
  try {
    const id = await cid(req.user!.id);
    const patients = await Patient.find({
      clinicId: id
    }).sort({
      updatedAt: - 1
    });
    res.json({
      success: true,
      patients
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
export const getPatient = async (req: Request, res: Response) => {
  try {
    const id = await cid(req.user!.id);
    const patient = await Patient.findOne({
      _id: req.params.id,
      clinicId: id
    });
    if (!patient) return res.status(404).json({
      success: false,
      message: 'Patient not found'
    });
    res.json({
      success: true,
      patient
    });
  } catch {
    res.status(404).json({
      success: false,
      message: 'Patient not found'
    });
  }
};
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const r = patientSchema.partial().safeParse(req.body);
    if (!r.success) return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors: r.error.issues
    });
    const id = await cid(req.user!.id);
    const p = await Patient.findOneAndUpdate({
      _id: req.params.id,
      clinicId: id
    }, r.data, {
      returnDocument: 'after',
      runValidators: true
    });
    if (!p) return res.status(404).json({
      success: false,
      message: 'Patient not found'
    });
    res.json({
      success: true,
      message: 'Patient updated',
      patient: p
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
