import mongoose from 'mongoose';

const teamGroupMessageSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true },
}, { timestamps: true });

export default mongoose.model('TeamGroupMessage', teamGroupMessageSchema);
