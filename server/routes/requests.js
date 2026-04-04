import express from 'express';
import RideRequest from '../models/RideRequest.js';
import Ride from '../models/Ride.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/requests — request to join a ride
router.post('/', verifyToken, async (req, res) => {
  try {
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found.' });

    if (ride.createdBy.toString() === req.user.id) {
      return res.status(400).json({ message: "You can't join your own ride." });
    }

    // Gender check
    if (ride.genderCategory !== 'both') {
      const user = await User.findById(req.user.id);
      if (!user.gender) {
        return res.status(403).json({ message: 'Your gender is not set. Update your profile.' });
      }
      if (user.gender !== ride.genderCategory) {
        return res.status(403).json({ message: `This ride is for ${ride.genderCategory} passengers only.` });
      }
    }

    const existing = await RideRequest.findOne({ ride: rideId, requestedBy: req.user.id });
    if (existing) return res.status(409).json({ message: 'You already requested this ride.' });

    const request = new RideRequest({ ride: rideId, requestedBy: req.user.id });
    await request.save();
    return res.status(201).json({ message: 'Request sent!', request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/requests/inbox — incoming + outgoing requests
router.get('/inbox', verifyToken, async (req, res) => {
  try {
    const myRides = await Ride.find({ createdBy: req.user.id }).select('_id');
    const myRideIds = myRides.map(r => r._id);

    const incoming = await RideRequest.find({ ride: { $in: myRideIds } })
      .populate('ride', 'from destination date time fare genderCategory')
      .populate('requestedBy', 'fullName email department gender')
      .sort({ createdAt: -1 });

    const outgoing = await RideRequest.find({ requestedBy: req.user.id })
      .populate({ path: 'ride', populate: { path: 'createdBy', select: 'fullName email department' } })
      .sort({ createdAt: -1 });

    return res.status(200).json({ incoming, outgoing });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// PATCH /api/requests/:id — approve or deny
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'denied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const request = await RideRequest.findById(req.params.id).populate('ride');
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.ride.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    // Handle seat counts
    if (status === 'approved' && request.status !== 'approved') {
      if (request.ride.seatsAvailable <= 0) {
        return res.status(400).json({ message: 'Ride is full, cannot approve more passengers.' });
      }
      request.ride.seatsAvailable -= 1;
      await request.ride.save();
    } else if (status === 'denied' && request.status === 'approved') {
      request.ride.seatsAvailable += 1;
      await request.ride.save();
    }

    request.status = status;
    await request.save();
    return res.status(200).json({ message: `Request ${status}.`, request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// PATCH /api/requests/:id/pay — mark as paid (requester only)
router.patch('/:id/pay', verifyToken, async (req, res) => {
  try {
    const request = await RideRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.requestedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    
    request.paymentStatus = 'paid';
    await request.save();
    return res.status(200).json({ message: 'Payment confirmed.', request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
