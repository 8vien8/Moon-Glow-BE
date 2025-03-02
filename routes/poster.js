const express = require('express');
const router = express.Router();
const upload = require('../middlewares/poster/upload');

const { getAllPosters, addPosters, deletePosters, updatePoster } = require('../controllers/poster')

router.route('/').get(getAllPosters).post(upload, addPosters);
router.route('/:id').delete(deletePosters).put(upload, updatePoster);

module.exports = router;