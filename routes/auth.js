const express = require('express');
const router = express.Router();

const { register, login, logout, getMe, refreshToken } = require("../controllers/auth")

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/me', getMe);


module.exports = router;