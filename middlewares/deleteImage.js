const cloudinary = require('../config/cloudinary');

const deleteImages = async (req, res, next) => {
    try {
        const { imagesToDelete } = req.body;

        if (!imagesToDelete || !Array.isArray(imagesToDelete)) {
            return res.status(400).json({ message: 'Invalid imagesToDelete format' });
        }

        for (const imageUrl of imagesToDelete) {
            const parts = imageUrl.split('/');
            const filename = parts.pop(); // Extract the last part of the URL (file name)
            const publicId = filename.split('.')[0]; // Remove the file extension (.jpg, .png, etc.)

            // Delete the image from the 'products' folder
            await cloudinary.uploader.destroy(`products/${publicId}`);
        }

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error('Error deleting images from Cloudinary:', error);
        res.status(500).json({ message: 'Failed to delete images' });
    }
};

module.exports = deleteImages;
