import mongoose from 'mongoose';

const teamRequestSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
}, { timestamps: true });

teamRequestSchema.index({ team: 1, requestedBy: 1 }, { unique: true });

export default mongoose.model('TeamRequest', teamRequestSchema);
