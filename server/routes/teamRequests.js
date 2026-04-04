import express from 'express';
import TeamRequest from '../models/TeamRequest.js';
import Team from '../models/Team.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/team-requests — request to join
router.post('/', verifyToken, async (req, res) => {
  try {
    const { teamId } = req.body;
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found.' });
    if (team.createdBy.toString() === req.user.id) return res.status(400).json({ message: "You can't join your own team." });
    const existing = await TeamRequest.findOne({ team: teamId, requestedBy: req.user.id });
    if (existing) return res.status(409).json({ message: 'You already requested to join this team.' });
    const request = new TeamRequest({ team: teamId, requestedBy: req.user.id });
    await request.save();
    return res.status(201).json({ message: 'Request sent!', request });
  } catch (err) { console.error(err); return res.status(500).json({ message: 'Server error.' }); }
});

// GET /api/team-requests/inbox
router.get('/inbox', verifyToken, async (req, res) => {
  try {
    const myTeams = await Team.find({ createdBy: req.user.id }).select('_id');
    const myTeamIds = myTeams.map(t => t._id);

    const incoming = await TeamRequest.find({ team: { $in: myTeamIds } })
      .populate('team', 'name projectTitle skillsRequired memberCount')
      .populate('requestedBy', 'fullName email department gender avatar')
      .sort({ createdAt: -1 });

    const outgoing = await TeamRequest.find({ requestedBy: req.user.id })
      .populate({ path: 'team', populate: { path: 'createdBy', select: 'fullName email avatar' } })
      .sort({ createdAt: -1 });

    return res.status(200).json({ incoming, outgoing });
  } catch (err) { console.error(err); return res.status(500).json({ message: 'Server error.' }); }
});

// GET /api/team-requests/my-teams — requests I'm approved in (my team memberships)
router.get('/my-teams', verifyToken, async (req, res) => {
  try {
    const approved = await TeamRequest.find({ requestedBy: req.user.id, status: 'approved' })
      .populate({ path: 'team', populate: { path: 'createdBy', select: 'fullName email avatar' } });
    return res.status(200).json({ memberships: approved });
  } catch (err) { return res.status(500).json({ message: 'Server error.' }); }
});

// PATCH /api/team-requests/:id
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'denied'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });
    const request = await TeamRequest.findById(req.params.id).populate('team');
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.team.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized.' });
    request.status = status;
    await request.save();
    return res.status(200).json({ message: `Request ${status}.`, request });
  } catch (err) { return res.status(500).json({ message: 'Server error.' }); }
});

export default router;
