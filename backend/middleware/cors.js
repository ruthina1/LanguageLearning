// backend/middleware/cors.js
import cors from 'cors';

const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // React dev server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export default cors(corsOptions);