import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({
      success: false,
      message: 'token is missing'
    });
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    req.user = {
      id: payload.id
    };
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Not Authorized',
      error: error.message
    });
  }
};
// Public routes can continue without a login cookie.
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) return next();
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    req.user = {
      id: payload.id
    };
    next();
  } catch {
    next();
  }
};
