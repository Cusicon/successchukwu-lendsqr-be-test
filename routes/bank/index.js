const { Router } = require('express');
const router = Router();

// --( REQUIRES )--
const depositRouter = require('./deposit');
const withdrawRouter = require('./withdraw');

// --( BANK ROUTERS )--
router.use('/deposit', depositRouter);
router.use('/withdraw', withdrawRouter);

module.exports = router;
