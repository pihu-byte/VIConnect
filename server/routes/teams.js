import express from 'express';
import Team from '../models/Team.js';
import TeamRequest from '../models/TeamRequest.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/teams — create
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, skillsRequired, memberCount, projectTitle, projectDescription } = req.body;
    if (!name || !description || !memberCount || !projectTitle) {
      return res.status(400).json({ message: 'Name, description, member count and project title are required.' });
    }
    const team = new Team({ name, description, skillsRequired: skillsRequired || [], memberCount: Number(memberCount), projectTitle, projectDescription, createdBy: req.user.id });
    await team.save();
    const populated = await Team.findById(team._id).populate('createdBy', 'fullName email department avatar');
    return res.status(201).json({ message: 'Team created!', team: populated });
  } catch (err) { console.error(err); return res.status(500).json({ message: 'Server error.' }); }
});

// GET /api/teams — all active teams
router.get('/', verifyToken, async (req, res) => {
  try {
    const teams = await Team.find().populate('createdBy', 'fullName email department avatar').sort({ createdAt: -1 });
    return res.status(200).json({ teams });
  } catch (err) { return res.status(500).json({ message: 'Server error.' }); }
});

// PUT /api/teams/:id — update (creator only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found.' });
    if (team.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized.' });
    const fields = ['name', 'description', 'skillsRequired', 'memberCount', 'projectTitle', 'projectDescription'];
    fields.forEach(f => { if (req.body[f] !== undefined) team[f] = req.body[f]; });
    await team.save();
    const populated = await Team.findById(team._id).populate('createdBy', 'fullName email department avatar');
    return res.status(200).json({ message: 'Team updated.', team: populated });
  } catch (err) { return res.status(500).json({ message: 'Server error.' }); }
});

// DELETE /api/teams/:id — delete (creator only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found.' });
    if (team.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized.' });
    await Team.deleteOne({ _id: req.params.id });
    await TeamRequest.deleteMany({ team: req.params.id });
    return res.status(200).json({ message: 'Team deleted.' });
  } catch (err) { return res.status(500).json({ message: 'Server error.' }); }
});

// PATCH /api/teams/:id/complete — mark done (creator only)
router.patch('/:id/complete', verifyToken, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found.' });
    if (team.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized.' });
    team.status = 'completed';
    team.completedAt = new Date();
    await team.save();
    return res.status(200).json({ message: 'Team marked as completed.', team });
  } catch (err) { return res.status(500).json({ message: 'Server error.' }); }
});

export default router;
