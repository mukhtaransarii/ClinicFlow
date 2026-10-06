import mongoose from 'mongoose';
const patientSchema = new mongoose.Schema({
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
    required: true,
    trim: true,
    maxlength: 30
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 2000
  }
}, {
  timestamps: true,
  versionKey: false
});
patientSchema.index({
  clinicId: 1,
  phone: 1
}, {
  unique: true
});
const Patient = mongoose.model('patient', patientSchema);
export default Patient;
