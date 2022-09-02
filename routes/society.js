const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware');
const society = require('../controllers/society');

router.get('/', catchAsync(society.all));
router.route('/new')
    .get(society.renderNewForm)
    .post(isLoggedIn, catchAsync(society.createNewSociety))

router.route('/:id')
    .get(isLoggedIn, catchAsync(society.showSociety))
    .put()

router.get('/:id/trending', isLoggedIn, catchAsync(society.trendingPosts));
router.get('/:id/recent', isLoggedIn, catchAsync(society.recentPosts));

router.put('/:id/join', isLoggedIn, catchAsync(society.joinSociety));
router.put('/:id/leave', isLoggedIn, catchAsync(society.leaveSociety));

module.exports = router;