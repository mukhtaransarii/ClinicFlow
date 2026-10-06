import mongoose from 'mongoose';
const scheduleSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clinic',
    required: true,
    index: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctor',
    required: true,
    index: true
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  slotDuration: {
    type: Number,
    required: true,
    min: 5,
    max: 240
  }
}, {
  timestamps: true,
  versionKey: false
});
scheduleSchema.index({
  doctorId: 1,
  dayOfWeek: 1
});
const Schedule = mongoose.model('schedule', scheduleSchema);
export default Schedule;
