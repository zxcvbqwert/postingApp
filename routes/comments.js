const express = require('express')
const { isLoggedIn, isCommentCreator } = require('../middleware');
const comments = require('../controllers/comments');

const router = express.Router({ mergeParams: true });

// index comments - show posts - GET /posts/:id
// new form comments - show posts - GET /posts/:id
// create comments - POST /posts/:id/comments
// show NA
// update comments - PUT /posts/:id/comments/:commentId
// delete comments - DELETE /posts/:id/comments/:commentId


// isLoggedIn, isCommentCreator

router.route('/')
	.post(isLoggedIn, comments.createComment);

router.route('/:commentId')
	.put(isLoggedIn, isCommentCreator, comments.updateComment)
	.delete(isLoggedIn, isCommentCreator, comments.deleteComment);

module.exports = router;