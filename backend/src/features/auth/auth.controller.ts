import type { Request, Response } from 'express';
import { loginSchema, singupSchema } from './auth.schema';
import User from './auth.model';
import Clinic from '../clinic/clinic.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Keep the JWT in an httpOnly cookie so frontend JavaScript cannot read it.
const setToken = (res: Response, id: string) => {
  const token = jwt.sign({id}, process.env.JWT_SECRET!, {expiresIn: '7d'});
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

// Signup creates the clinic owner and their clinic together at the app level.
export const signup = async (req: Request, res: Response) => {
  try {
    const result = singupSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({
      success: false,
      message: "Invalid data",
      errors: result.error.issues
    });

    const { name, email, password } = result.data;
    const exists = await User.findOne({email});
    if (exists) return res.status(409).json({
      success: false,
      message: 'Email already exists'
    });

    const baseSlug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'clinic';
    let slug = baseSlug;
    let count = 1;

    while (await Clinic.exists({
      slug
    })) slug = `${baseSlug}-${count++}`;
    const clinic = await Clinic.create({
      name: `${name}'s Clinic`,
      slug
    });

    try {
      const user = await User.create({
        name,
        email,
        password,
        clinicId: clinic._id
      });

      setToken(res, user._id.toString());

      return res.status(201).json({
        success: true,
        message: 'user creates successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          clinicId: user.clinicId
        },
        clinic
      });
    } catch (error) {
      await Clinic.findByIdAndDelete(clinic._id);
      throw error;
    }
  } catch (error: any) {
    if (error?.code === 11000) return res.status(409).json({
      success: false,
      message: 'Email or clinic slug already exists'
    });
    return res.status(500).json({
      success: false,
      message: 'something went wrong',
      error: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({
      success: false,
      message: "Invalid data",
      errors: result.error.issues
    });

    const { email, password } = result.data;
    const user = await User.findOne({email});
    if (!user) return res.status(400).json({
      success: false,
      message: 'User not exist'
    });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({
      success: false,
      message: 'user password is incorrect'
    });

    setToken(res, user._id.toString());

    const clinic = await Clinic.findById(user.clinicId);
    res.status(200).json({
      success: true,
      message: 'user logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        clinicId: user.clinicId
      },
      clinic
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'something went wrong',
      error: error.message
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  }).json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const isAuthme = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({
      success: false,
      message: 'token is missing',
      loggedIn: false
    });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {id: string};
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({
      success: false,
      message: 'user not found',
      loggedIn: false
    });
    res.status(200).json({
      success: true,
      message: 'token is valid',
      loggedIn: true,
      user
    });
  } catch {
    res.status(401).json({
      success: false,
      message: 'token is invalid',
      loggedIn: false
    });
  }
};
