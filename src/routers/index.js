const express = require('express');

const router = express.Router();
const userRoutes = require('./userRouter');
const transactionRoutes = require('./transactionRoutes');

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/users
 */
router.use('/users', userRoutes);  
/**
 * GET v1/transactions
 */
router.use('/transactions', transactionRoutes);  


module.exports = router;