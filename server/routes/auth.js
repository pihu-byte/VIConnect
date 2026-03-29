import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Helper: generate JWT
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, fullName: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, registrationNumber, email, department, password, confirmPassword } = req.body;

    // Basic validation
    if (!fullName || !registrationNumber || !email || !department || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Check for existing user
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    const existingReg = await User.findOne({ registrationNumber: registrationNumber.toUpperCase() });
    if (existingReg) {
      return res.status(409).json({ message: 'This registration number is already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      fullName,
      registrationNumber: registrationNumber.toUpperCase(),
      email: email.toLowerCase(),
      department,
      password: hashedPassword,
    });
    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        registrationNumber: user.registrationNumber,
        department: user.department,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        registrationNumber: user.registrationNumber,
        department: user.department,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// GET /api/auth/me  (protected — for checking current session)
router.get('/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.status(200).json({ user });
  } catch {
    return res.status(403).json({ message: 'Invalid token.' });
  }
});

export default router;
