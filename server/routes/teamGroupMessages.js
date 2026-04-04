import express from 'express';
import TeamGroupMessage from '../models/TeamGroupMessage.js';
import TeamRequest from '../models/TeamRequest.js';
import Team from '../models/Team.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

const canAccessTeamChat = async (teamId, userId) => {
  const team = await Team.findById(teamId);
  if (!team) return false;
  
  if (team.createdBy.toString() === userId) return true;
  
  const approvedRequest = await TeamRequest.findOne({
    team: teamId,
    requestedBy: userId,
    status: 'approved'
  });
  
  return !!approvedRequest;
};

// GET /api/team-group-messages/:teamId
router.get('/:teamId', verifyToken, async (req, res) => {
  try {
    const { teamId } = req.params;
    if (!(await canAccessTeamChat(teamId, req.user.id))) {
      return res.status(403).json({ message: 'Not authorized or not an approved member.' });
    }
    const messages = await TeamGroupMessage.find({ team: teamId })
      .populate('sender', 'fullName email avatar')
      .sort({ createdAt: 1 });
    return res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/team-group-messages/:teamId
router.post('/:teamId', verifyToken, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { text } = req.body;
    
    if (!text?.trim()) return res.status(400).json({ message: 'Message is empty.' });
    if (!(await canAccessTeamChat(teamId, req.user.id))) {
      return res.status(403).json({ message: 'Not authorized or not an approved member.' });
    }
    
    const message = new TeamGroupMessage({ team: teamId, sender: req.user.id, text: text.trim() });
    await message.save();
    
    const populated = await TeamGroupMessage.findById(message._id).populate('sender', 'fullName email avatar');
    return res.status(201).json({ data: populated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
