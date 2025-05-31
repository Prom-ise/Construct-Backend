const express = require('express');
const { login, sendResetCode, resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/sendResetCode', sendResetCode);
router.post('/resetPassword', resetPassword);

module.exports = router;
