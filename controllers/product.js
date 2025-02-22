const Product = require('../models/product')
const deleteImages = require('../middlewares/deleteImage');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.addNewProduct = async (req, res) => {
    const imageUrls = req.files.map(file => file.path)
    const product = new Product({ ...req.body, image: imageUrls })
    try {
        // Check if image is empty
        if (imageUrls.length === 0) return res.status(400).json({ message: 'Please upload an image' })

        await product.save()
        res.status(201).json(product)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) return res.status(404).send({ message: 'Product not found' })

        // Delete images from cloudinary
        req.body.imagesToDelete = product.image;
        deleteImages(req, res, () => { });

        res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // 1️⃣ Check if no new files were uploaded → Keep the existing images
        if (!req.files || req.files.length === 0) {
            return res.status(200).json({ message: 'No image changes, product updated successfully', product });
        }

        // 2️⃣ Get the list of newly uploaded images
        const newImageUrls = req.files.map(file => file.path);

        // 3️⃣ Identify images to be deleted (old images not present in newImageUrls)
        const imagesToDelete = product.image.filter(url => !newImageUrls.includes(url));

        // 4️⃣ Delete old images from Cloudinary if there are changes
        if (imagesToDelete.length > 0) {
            req.body.imagesToDelete = imagesToDelete;
            await deleteImages(req, res, () => { });
        }

        // 5️⃣ Update the database (keep old images that were not removed + add new ones)
        product.image = [...product.image.filter(img => !imagesToDelete.includes(img)), ...newImageUrls];

        // 6️⃣ Save the updated product with new images
        await product.save();

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: error.message });
    }
};

