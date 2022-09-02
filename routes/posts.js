const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware');
const post = require('../controllers/posts');

router.route('/new')
    .get(isLoggedIn, post.renderNewPostForm)
    .post(isLoggedIn, catchAsync(post.createNewPost));

router.put('/:postId/like', isLoggedIn, catchAsync(post.likePost));
router.delete('/:postId/delete', isLoggedIn, catchAsync(post.deletePost));

module.exports = router;