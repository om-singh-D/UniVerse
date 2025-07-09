// Upload configuration
const uploadConfig = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  cloudinaryUrl: process.env.CLOUDINARY_URL,
  useCloudinary: process.env.USE_CLOUDINARY === 'true'
};

export default uploadConfig;
