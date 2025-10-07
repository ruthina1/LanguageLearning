import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import corsOptions from './config/corsConfig.js';


import authRoutes from "./routes/authRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import activitiesRoutes from './routes/activitiesRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/profile', profileRoutes);



const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
