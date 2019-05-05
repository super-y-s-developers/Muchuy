const express = require('express');

const router = express.Router();
const userRoutes = require('./userRouter');

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/users
 */
router.use('/users', userRoutes);  

module.exports = router;