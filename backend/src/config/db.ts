import mongoose from 'mongoose';

export const connectDd = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Mongodb Connected ✅');
  } catch (e) {
    console.log('Mongodb Connection Failed ❌', e);
    process.exit(1);
  }
};
