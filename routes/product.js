const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

const { getAllProducts, addNewProduct, deleteProduct, updateProduct } = require('../controllers/product');

router.route('/').get(getAllProducts).post(upload, addNewProduct);

router.route('/:id').delete(deleteProduct).put(upload, updateProduct);

module.exports = router;

