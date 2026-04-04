import express from 'express';
import Ride from '../models/Ride.js';
import RideRequest from '../models/RideRequest.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/rides — create a ride
router.post('/', verifyToken, async (req, res) => {
  try {
    const { from, destination, date, time, fare, seatsAvailable, genderCategory } = req.body;
    if (!from || !destination || !date || !time || !fare || !seatsAvailable || !genderCategory) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const ride = new Ride({
      from, destination, date, time,
      fare: Number(fare),
      seatsAvailable: Number(seatsAvailable),
      genderCategory,
      createdBy: req.user.id,
    });
    await ride.save();
    const populated = await Ride.findById(ride._id).populate('createdBy', 'fullName email department gender');
    return res.status(201).json({ message: 'Ride posted!', ride: populated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/rides — all active rides
router.get('/', verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'active' })
      .populate('createdBy', 'fullName email department gender avatar')
      .sort({ createdAt: -1 });
    return res.status(200).json({ rides });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/rides/past — rides I created or joined that are completed
router.get('/past', verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({ createdBy: req.user.id, status: 'completed' })
      .populate('createdBy', 'fullName email department gender avatar')
      .sort({ completedAt: -1 });
    return res.status(200).json({ rides });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/rides/:id — update ride (creator only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found.' });
    if (ride.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized.' });
    
    const fields = ['from', 'destination', 'date', 'time', 'fare', 'seatsAvailable', 'genderCategory'];
    fields.forEach(f => { if (req.body[f] !== undefined) ride[f] = req.body[f]; });
    
    await ride.save();
    return res.status(200).json({ message: 'Ride updated.', ride });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/rides/:id — delete ride (creator only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found.' });
    if (ride.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized.' });
    
    await Ride.deleteOne({ _id: req.params.id });
    // Also delete requests
    await RideRequest.deleteMany({ ride: req.params.id });
    
    return res.status(200).json({ message: 'Ride deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// PATCH /api/rides/:id/complete — mark done (creator only)
router.patch('/:id/complete', verifyToken, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found.' });
    if (ride.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized.' });
    
    ride.status = 'completed';
    ride.completedAt = new Date();
    await ride.save();
    
    // Update approved requests to pending payment
    await RideRequest.updateMany(
      { ride: req.params.id, status: 'approved' },
      { paymentStatus: 'pending' }
    );
    
    return res.status(200).json({ message: 'Ride completed. Payments initiated.', ride });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
