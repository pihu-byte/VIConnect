import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '.env') });

import authRoutes from './routes/auth.js';
import rideRoutes from './routes/rides.js';
import requestRoutes from './routes/requests.js';
import messageRoutes from './routes/messages.js';
import teamRoutes from './routes/teams.js';
import teamRequestRoutes from './routes/teamRequests.js';
import teamMessageRoutes from './routes/teamMessages.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/team-requests', teamRequestRoutes);
app.use('/api/team-messages', teamMessageRoutes);

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
