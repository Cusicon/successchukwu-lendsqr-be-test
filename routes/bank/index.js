const { Router } = require('express');
const router = Router();

// --( REQUIRES )--
const depositRouter = require('./deposit');
const withdrawRouter = require('./withdraw');
const transactionRouter = require('./transaction');

// --( BANK ROUTERS )--
router.use('/deposit', depositRouter);
router.use('/withdraw', withdrawRouter);
router.use('/transactions', transactionRouter);

module.exports = router;
