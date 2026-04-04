import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import fs from 'fs';
import User from '../models/User.js';

const router = express.Router();

// --- Multer setup for avatar uploads ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ok = allowed.test(extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype.split('/')[1]);
    cb(ok ? null : new Error('Only image files are allowed'), ok);
  },
});

// --- The list of profile fields we want every user to have filled ---
const PROFILE_FIELDS = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'department', label: 'Department' },
  { key: 'gender', label: 'Gender' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'bio', label: 'Bio' },
];

// Helper to build a safe user object (no password)
const safeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  registrationNumber: user.registrationNumber,
  department: user.department,
  gender: user.gender,
  avatar: user.avatar,
  phoneNumber: user.phoneNumber || '',
  bio: user.bio || '',
});

// Helper: generate JWT
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, fullName: user.fullName, gender: user.gender },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// Helper: decode token from header
const decodeToken = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, registrationNumber, email, department, gender, password, confirmPassword } = req.body;

    if (!fullName || !registrationNumber || !email || !department || !gender || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    const existingReg = await User.findOne({ registrationNumber: registrationNumber.toUpperCase() });
    if (existingReg) {
      return res.status(409).json({ message: 'This registration number is already registered.' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      fullName,
      registrationNumber: registrationNumber.toUpperCase(),
      email: email.toLowerCase(),
      department,
      gender,
      password: hashedPassword,
    });
    await user.save();

    const token = generateToken(user);
    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: safeUser(user),
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

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: safeUser(user),
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  const decoded = decodeToken(req);
  if (!decoded) return res.status(401).json({ message: 'Not authenticated.' });

  try {
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.status(200).json({ user: safeUser(user) });
  } catch {
    return res.status(403).json({ message: 'Invalid token.' });
  }
});

// POST /api/auth/profile — update profile
router.post('/profile', async (req, res) => {
  console.log('--- Profile Update Request Received ---');
  console.log('Body:', req.body);
  const decoded = decodeToken(req);
  if (!decoded) return res.status(401).json({ message: 'Not authenticated.' });

  try {
    const { fullName, department, avatar, phoneNumber, bio } = req.body;
    
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    
    if (fullName) user.fullName = fullName;
    if (department) user.department = department;
    if (avatar !== undefined) user.avatar = avatar;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.bio = bio;
    
    await user.save();
    
    return res.status(200).json({ 
      message: 'Profile updated.', 
      user: safeUser(user),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', async (req, res) => {
  const decoded = decodeToken(req);
  if (!decoded) return res.status(401).json({ message: 'Not authenticated.' });

  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/auth/schema — returns profile fields & which ones the user is missing
router.get('/schema', async (req, res) => {
  const decoded = decodeToken(req);
  if (!decoded) return res.status(401).json({ message: 'Not authenticated.' });

  try {
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const missingFields = PROFILE_FIELDS.filter((f) => {
      const val = user[f.key];
      return val === undefined || val === null || val === '';
    }).map((f) => ({ key: f.key, label: f.label }));

    return res.status(200).json({ fields: PROFILE_FIELDS, missingFields });
  } catch (err) {
    console.error('Schema error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/auth/upload-avatar — upload avatar image from computer
router.post('/upload-avatar', (req, res) => {
  const decoded = decodeToken(req);
  if (!decoded) return res.status(401).json({ message: 'Not authenticated.' });

  upload.single('avatar')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    try {
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: 'User not found.' });

      user.avatar = avatarUrl;
      await user.save();

      return res.status(200).json({
        message: 'Avatar uploaded successfully.',
        user: safeUser(user),
      });
    } catch (e) {
      console.error('Upload avatar error:', e);
      return res.status(500).json({ message: 'Server error.' });
    }
  });
});

export default router;
