import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  from: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  fare: { type: Number, required: true, min: 0 },
  seatsAvailable: { type: Number, required: true, min: 1, max: 8 },
  genderCategory: { type: String, enum: ['male', 'female', 'both'], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Ride', rideSchema);
