import express from 'express';
import TeamMessage from '../models/TeamMessage.js';
import TeamRequest from '../models/TeamRequest.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

const canAccess = async (request, userId) => {
  if (!request.team) return false;
  const ownerId = request.team.createdBy?.toString() ?? request.team.toString();
  const requesterId = request.requestedBy.toString();
  return userId === ownerId || userId === requesterId;
};

router.get('/:requestId', verifyToken, async (req, res) => {
  try {
    const request = await TeamRequest.findById(req.params.requestId).populate('team');
    if (!request) return res.status(404).json({ message: 'Not found.' });
    if (request.status !== 'approved') return res.status(403).json({ message: 'Chat not enabled.' });
    if (!(await canAccess(request, req.user.id))) return res.status(403).json({ message: 'Not authorized.' });
    const messages = await TeamMessage.find({ request: req.params.requestId }).populate('sender', 'fullName email avatar').sort({ createdAt: 1 });
    return res.status(200).json({ messages });
  } catch (err) { return res.status(500).json({ message: 'Server error.' }); }
});

router.post('/:requestId', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Message is empty.' });
    const request = await TeamRequest.findById(req.params.requestId).populate('team');
    if (!request) return res.status(404).json({ message: 'Not found.' });
    if (request.status !== 'approved') return res.status(403).json({ message: 'Chat not enabled.' });
    if (!(await canAccess(request, req.user.id))) return res.status(403).json({ message: 'Not authorized.' });
    const message = new TeamMessage({ request: req.params.requestId, sender: req.user.id, text: text.trim() });
    await message.save();
    const populated = await TeamMessage.findById(message._id).populate('sender', 'fullName email avatar');
    return res.status(201).json({ data: populated });
  } catch (err) { return res.status(500).json({ message: 'Server error.' }); }
});

export default router;
