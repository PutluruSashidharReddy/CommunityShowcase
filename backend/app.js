import express from 'express';
import cors from 'cors'; // Keep cors imported, but we won't configure it as strictly
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

// Use a simple, default cors() here. vercel.json will handle the specific headers.
app.use(cors("http://localhost:5173"));

// Middleware
app.use(express.json({ limit: '50mb' }));

// Static folder for images
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