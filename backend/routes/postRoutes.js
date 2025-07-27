import express from 'express';
import multer from 'multer';
import path from 'path';
import Post from '../mongodb/models/post.js';
import cloudinary from '../config/cloudinary.js';
import { unlink } from 'fs/promises';

const router = express.Router();

// Configure multer for file storage in the /tmp directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp');
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

        await unlink(req.file.path); // Remove file from temp folder

        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        if (req.file) {
            try {
                await unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting temp file after failed post creation:', unlinkError);
            }
        }
        res.status(500).json({ success: false, message: 'Failed to create post. ' + error.message });
    }
});

// **NEW** - UPDATE A POST
router.route('/:id').put(async (req, res) => {
    try {
        const { id } = req.params;
        const { name, caption } = req.body;

        if (!name || !caption) {
            return res.status(400).json({ success: false, message: 'Name and caption are required.' });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { name, caption },
            { new: true } // Return the updated document
        );

        if (!updatedPost) {
            return res.status(404).json({ success: false, message: 'Post not found.' });
        }

        res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ success: false, message: 'Failed to update post. ' + error.message });
    }
});

// **NEW** - DELETE A POST
router.route('/:id').delete(async (req, res) => {
    try {
        const { id } = req.params;
        const postToDelete = await Post.findByIdAndDelete(id);

        if (!postToDelete) {
            return res.status(404).json({ success: false, message: 'Post not found.' });
        }

        // Optional: Delete the image from Cloudinary as well
        const publicId = postToDelete.photo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        res.status(200).json({ success: true, message: 'Post deleted successfully.' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ success: false, message: 'Failed to delete post. ' + error.message });
    }
});

export default router;