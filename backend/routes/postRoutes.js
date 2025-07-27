import express from 'express';
import multer from 'multer';
import path from 'path';
import Post from '../mongodb/models/post.js';
import cloudinary from '../config/cloudinary.js';
import { unlink } from 'fs/promises';

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// GET ALL POSTS
router.route('/').get(async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// CREATE A POST
router.route('/').post(upload.single('photo'), async (req, res) => {
    try {
        const { name, caption } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No photo uploaded.' });
        }

        const photoUrl = await cloudinary.uploader.upload(req.file.path);

        const newPost = await Post.create({
            name,
            caption,
            photo: photoUrl.secure_url,
        });

        await unlink(req.file.path); // Remove file from local uploads folder

        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        // If a file was uploaded but there was an error, try to remove it
        if (req.file) {
            try {
                await unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting uploaded file after failed post creation:', unlinkError);
            }
        }
        res.status(500).json({ success: false, message: 'Failed to create post. ' + error.message });
    }
});

export default router;