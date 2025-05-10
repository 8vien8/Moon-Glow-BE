const express = require('express');
const router = express.Router();
const upload = require('../middlewares/product/upload');
const adminMiddleware = require('../middlewares/adminMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const { getAllProducts, getProductById, addNewProduct, deleteProduct, updateProduct } = require('../controllers/product');

router.route('/').get(getAllProducts).post(upload, addNewProduct);

router.route('/:id').delete(deleteProduct).put(upload, updateProduct).get(getProductById);

module.exports = router;

