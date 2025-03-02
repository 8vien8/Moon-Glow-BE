const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinary');

// Configure Multer storage using Cloudinary Storage plugin
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products',
        resource_type: 'image',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: (req, file) => file.originalname.split('.')[0] + '-' + Date.now()
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
}).array('image', 5);

module.exports = upload;