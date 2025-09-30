// backend/server.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import User from './models/User.js'; 
import pool from './config/db.js'

const app = express();
const PORT = 7000;


app.use(cors());
app.use(express.json());

// Use your actual auth routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});