import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import postRoutes from './routes/postRoutes.js';
import connectDB from './mongodb/connect.js'; 

dotenv.config(); // Load .env file

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
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
        await connectDB(); // Connect to MongoDB using .env
        app.listen(PORT, () =>
            console.log(`🚀 Server started at http://localhost:${PORT}`)
        );
    } catch (error) {
        console.error('❌ Server failed to start:', error);
    }
};

startServer();
