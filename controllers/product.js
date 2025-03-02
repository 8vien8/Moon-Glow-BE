const Product = require('../models/product')
const deleteImages = require('../middlewares/product/delete');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        if (products.length === 0) return res.status(404).json({ message: 'No products found' })
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({ message: 'Product not found' })
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.addNewProduct = async (req, res) => {
    try {
        const imageUrls = req.files.map(file => file.path)
        const product = new Product({ ...req.body, image: imageUrls })

        // Check if image is empty
        if (!req.files || req.files.length === 0)
            return res.status(400).json({ message: 'Please upload at least one image' });

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
        const newImages = req.files.map(file => file.path);

        // 3️⃣ Identify images to be deleted (old images not present in newImages)
        const imagesToDelete = product.image.filter(file => !newImages.includes(file));

        // 4️⃣ Delete old images from Cloudinary if there are changes
        if (imagesToDelete.length > 0) {
            req.body.imagesToDelete = imagesToDelete;
            await deleteImages(req, res, () => { });
        }

        // 5️⃣ Upload new images to Cloudinary
        req.files = newImages.map(file => !product.image.includes(file));

        // 6️⃣ Update the database (keep old images that were not removed + add new ones)
        product.image = [...product.image.filter(img => !imagesToDelete.includes(img)), ...newImages];

        // 7️⃣ Save the updated product with new images
        await product.save();

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: error.message });
    }
};

