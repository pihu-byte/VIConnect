import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

import authRoutes from './routes/auth.js';
import rideRoutes from './routes/rides.js';
import requestRoutes from './routes/requests.js';
import messageRoutes from './routes/messages.js';
import teamRoutes from './routes/teams.js';
import teamRequestRoutes from './routes/teamRequests.js';
import teamMessageRoutes from './routes/teamMessages.js';
import teamGroupMessageRoutes from './routes/teamGroupMessages.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Serve uploaded files (avatars etc.)
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/team-requests', teamRequestRoutes);
app.use('/api/team-messages', teamMessageRoutes);
app.use('/api/team-group-messages', teamGroupMessageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'VIConnect API is running.' });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB:', process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`🚀 VIConnect API server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
