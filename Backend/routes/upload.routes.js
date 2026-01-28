import express from 'express';
import multer from 'multer';
import { uploadVideo, uploadImage, uploadFile } from '../controllers/upload.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for reliable Cloudinary uploads
  }
});

// Upload video endpoint
router.post('/video', authenticateToken, upload.single('video'), uploadVideo);

// Upload image endpoint
router.post('/image', authenticateToken, upload.single('image'), uploadImage);

// Upload generic file endpoint (pdf/doc/etc)
router.post('/file', authenticateToken, upload.single('file'), uploadFile);

export default router;
