import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file provided'
      });
    }

    const file = req.file;

    // Validate file type
    if (!file.mimetype.startsWith('video/')) {
      return res.status(400).json({
        success: false,
        message: 'File must be a video'
      });
    }

    // Upload to Cloudinary using upload_large for videos over 100MB
    const result = await cloudinary.v2.uploader.upload_large(
      `data:video/${file.mimetype.split('/')[1]};base64,${file.buffer.toString('base64')}`,
      {
        resource_type: 'video',
        folder: 'k23dx/reviews',
        chunk_size: 6000000 // 6MB chunks
      }
    );

    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        duration: result.duration
      }
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload video',
      error: error.message
    });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const file = req.file;

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: 'File must be an image'
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'k23dx/uploads',
          quality: 'auto',
          fetch_format: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    const file = req.file;

    // Upload to Cloudinary (raw for documents/archives/etc)
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'k23dx/attachments'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        originalFilename: result.original_filename
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
};
