import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clinic',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'appointment'
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});
const Notification = mongoose.model('notification', notificationSchema);
export default Notification;
