const express = require('express');
const router = express.Router();
const { getAllProducts, addNewProduct, deleteProduct, updateProduct } = require('../controllers/product');

router.route('/').get(getAllProducts).post(addNewProduct);

router.route('/:id').delete(deleteProduct).put(updateProduct);

module.exports = router;

