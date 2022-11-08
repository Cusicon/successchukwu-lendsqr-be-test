const { Router } = require('express');
const router = Router();

// --( REQUIRES )--
const signInRouter = require('./auth/signin');
const signUpRouter = require('./auth/signup');

const bankRouter = require('./bank');

// --( AUTH ROUTERS )--
router.use('/signup', signUpRouter);
router.use('/signin', signInRouter);

// --( USERS ROUTERS )--
router.use('/', bankRouter);

module.exports = router;
