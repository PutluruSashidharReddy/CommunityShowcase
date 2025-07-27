import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import postRoutes from './routes/postRoutes.js';
import connectDB from './mongodb/connect.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- CORS CONFIGURATION START ---

// Define the list of allowed origins (your frontend URLs)
const allowedOrigins = [
  'http://localhost:5173', // Your local development URL
  // Add your deployed frontend URL here once you deploy it
  // e.g., 'https://your-frontend-app.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

// Use the configured CORS options
app.use(cors(corsOptions));

// --- CORS CONFIGURATION END ---


// Middleware
app.use(express.json({ limit: '50mb' }));

// Static folder for images (if you still need it for any reason)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1/post', postRoutes);

app.get('/', async (req, res) => {
  res.send('Hello from the Image Sharing App!');
});

const PORT = process.env.PORT || 8080;

// Start the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`🚀 Server started at http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error('❌ Server failed to start:', error);
  }
};

startServer();