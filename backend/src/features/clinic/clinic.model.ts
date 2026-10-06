import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    trim: true
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  bookingEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});
const Clinic = mongoose.model('clinic', clinicSchema);
export default Clinic;
