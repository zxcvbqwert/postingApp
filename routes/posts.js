// /routes/posts.js

const express = require('express');
const { isLoggedIn, isPostCreator, validatePostSchema } = require('../middleware');
const posts = require('../controllers/posts');
const multer = require('multer');
const { storage } = require('../cloudinary');

const upload = multer({ storage });

const router = express.Router();

// basePath = '/posts'
router.route('/')
	.get(posts.showAllPosts) // index route
	.post( isLoggedIn, upload.single('image'), validatePostSchema, posts.createPost); // create route

router.route('/new')
	.get(isLoggedIn, posts.renderNewPostForm); // render create new post form

router.route('/:id')
	.get(posts.showSpecificPost) // show route
	.patch(isLoggedIn, isPostCreator, upload.single('image'), validatePostSchema, posts.editPost) // update route
	.delete(isLoggedIn, isPostCreator, posts.deletePost); // delete route
router.route('/:id/edit')
	.get(isLoggedIn, isPostCreator, posts.renderEditPostForm); // render edit post form

module.exports = router;