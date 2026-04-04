import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  skillsRequired: [{ type: String, trim: true }],
  memberCount: { type: Number, required: true, min: 1, max: 20 },
  projectTitle: { type: String, required: true, trim: true },
  projectDescription: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  completedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);
