const Poster = require('../models/poster')
const deleteImages = require('../middlewares/poster/delete');

exports.getAllPosters = async (req, res) => {
    try {
        const posters = await Poster.find()
        if (posters.length === 0) return res.status(404).json({ message: 'No posters found' })
        res.status(200).json(posters)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.addPosters = async (req, res) => {
    try {
        const imageUrls = req.files.map(file => file.path);
        const poster = new Poster({ ...req.body, image: imageUrls });

        // Check if image is empty
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload at least one image' });
        }

        await poster.save();
        res.status(201).json(poster);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deletePosters = async (req, res) => {
    try {
        const poster = await Poster.findByIdAndDelete(req.params.id);

        if (!poster) return res.status(404).json({ message: 'Poster not found' });

        // Delete images from cloudinary
        req.body.imagesToDelete = poster.image;
        deleteImages(req, res, () => { });

        res.status(200).json({ message: 'Poster deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updatePoster = async (req, res) => {
    try {
        const poster = await Poster.findById(req.params.id);
        if (!poster) return res.status(404).json({ message: 'Poster not found' });

        // 1️⃣ Check if no new files were uploaded → Keep the existing images
        if (!req.files || req.files.length === 0)
            return res.status(200).json({ message: 'No new images uploaded', poster });

        // 2️⃣ Get the list of newly uploaded images
        const newImages = req.files.map(file => file.path);

        // 3️⃣ Identify the images to be deleted (old images not present in newImages list)
        const imagesToDelete = poster.image.filter(url => !newImages.includes(url));

        // 4️⃣ Delete old images from Cloudinary if there are changes
        if (imagesToDelete.length > 0) {
            req.body.imagesToDelete = imagesToDelete;
            await deleteImages(req, res, () => { });
        }

        // 5️⃣ Assign images to upload to Cloudinary
        req.files = newImages.map(file => !poster.image.includes(file));

        // 6️⃣ Update the database (keep old images that were not removed + add new ones)
        poster.image = [...poster.image.filter(img => !req.body.imagesToDelete.includes(img)), ...newImages];

        // 7️⃣ Save the updated product with new images
        await poster.save();

        res.status(200).json({ message: 'Product updated successfully', poster });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: error.message });
    }
};


