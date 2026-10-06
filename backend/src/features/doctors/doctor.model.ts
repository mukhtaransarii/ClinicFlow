import mongoose from 'mongoose';
const doctorSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clinic',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 30
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  specialization: {
    type: String,
    trim: true,
    maxlength: 100
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  image: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});
doctorSchema.index({
  clinicId: 1,
  active: 1
});
const Doctor = mongoose.model('doctor', doctorSchema);
export default Doctor;
