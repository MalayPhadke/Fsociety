const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const user = require('../controllers/users');
const {isLoggedIn} = require('../middleware');

router.get('/', user.login);

router.route('/register')
    .get(user.showRegister)
    .post(catchAsync(user.registerUser));

router.route('/login')
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/'}),  user.loginUser);

router.get('/logout', user.logoutUser);

router.get('/customFeed', isLoggedIn, catchAsync(user.customFeed));

router.get('/profile', isLoggedIn, catchAsync(user.profile))
router.get('/profile/:id', isLoggedIn, catchAsync(user.showUser));
router.put('/profile/:id/accept', isLoggedIn, catchAsync(user.acceptRequest))
router.put('/profile/:id/send', isLoggedIn, catchAsync(user.sendRequest))


module.exports = router;