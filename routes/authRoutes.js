const express = require('express');
const router = express.Router();

const {login, logout, register} = require('../controllers/authController');

router.post('/login', login).post('/register', register).get('/logout', logout);

module.exports = router;
