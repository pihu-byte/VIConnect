import mongoose from 'mongoose';

const rideRequestSchema = new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
  paymentStatus: { type: String, enum: ['not_required', 'pending', 'paid'], default: 'not_required' },
}, { timestamps: true });

rideRequestSchema.index({ ride: 1, requestedBy: 1 }, { unique: true });

export default mongoose.model('RideRequest', rideRequestSchema);
