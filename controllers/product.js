const Product = require('../models/product')

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.addNewProduct = async (req, res) => {
    const product = new Product(req.body)
    try {
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
        res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id
            , req.body
            , { new: true, runValidators: true }
        )
        if (!product) return res.status(404).send({ message: 'Product not found' })
        res.status(200).json(product)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}