const { Router } = require('express');
const router = Router();

// --( REQUIRES )--
const depositRouter = require('./deposit');

// --( BANK ROUTERS )--
router.use('/deposit', depositRouter);

module.exports = router;
