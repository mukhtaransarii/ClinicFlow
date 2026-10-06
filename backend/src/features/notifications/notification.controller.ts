import type { Request, Response } from 'express';
import User from '../auth/auth.model';
import Notification from './notification.model';
const cid = async (id: string) => (await User.findById(id).select('clinicId'))?.clinicId;
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const id = await cid(req.user!.id);
    const notifications = await Notification.find({
      clinicId: id
    }).sort({
      createdAt: - 1
    }).limit(100);
    res.json({
      success: true,
      notifications
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const id = await cid(req.user!.id);
    const n = await Notification.findOneAndUpdate({
      _id: req.params.id,
      clinicId: id
    }, {
      read: true
    }, {
      returnDocument: 'after'
    });
    if (!n) return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
    res.json({
      success: true,
      notification: n
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
