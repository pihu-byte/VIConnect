import express from 'express';
import Message from '../models/Message.js';
import RideRequest from '../models/RideRequest.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

const canAccess = (request, userId) => {
  const ownerId = request.ride.createdBy.toString();
  const requesterId = request.requestedBy.toString();
  return userId === ownerId || userId === requesterId;
};

// GET /api/messages/:requestId
router.get('/:requestId', verifyToken, async (req, res) => {
  try {
    const request = await RideRequest.findById(req.params.requestId).populate('ride');
    if (!request) return res.status(404).json({ message: 'Not found.' });
    if (request.status !== 'approved') return res.status(403).json({ message: 'Chat not enabled.' });
    if (!canAccess(request, req.user.id)) return res.status(403).json({ message: 'Not authorized.' });

    const messages = await Message.find({ request: req.params.requestId })
      .populate('sender', 'fullName email avatar')
      .sort({ createdAt: 1 });
    return res.status(200).json({ messages });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/messages/:requestId
router.post('/:requestId', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Message is empty.' });

    const request = await RideRequest.findById(req.params.requestId).populate('ride');
    if (!request) return res.status(404).json({ message: 'Not found.' });
    if (request.status !== 'approved') return res.status(403).json({ message: 'Chat not enabled.' });
    if (!canAccess(request, req.user.id)) return res.status(403).json({ message: 'Not authorized.' });

    const message = new Message({ request: req.params.requestId, sender: req.user.id, text: text.trim() });
    await message.save();
    const populated = await Message.findById(message._id).populate('sender', 'fullName email avatar');
    return res.status(201).json({ data: populated });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
