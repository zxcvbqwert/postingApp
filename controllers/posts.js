// /controllers/posts.js

const Post = require('../models/posts');
const { cloudinary } = require('../cloudinary');

module.exports.showAllPosts = async (req, res) => {
	const allPosts = await Post.find({}).populate('creator');
	res.render('posts/index', { allPosts });
};

module.exports.createPost = async (req, res) => {
	const { post } = req.body;
	const newPost = new Post(post);
	newPost.creator = req.user._id;
	newPost.image = { name: req.file.filename, url: req.file.path };
	await newPost.save();
	req.flash('success', 'Succesfully Created New Post');
	res.redirect(`/posts/${newPost._id}`);
};

module.exports.renderNewPostForm = (req, res) => {
	res.render('posts/new');
};

module.exports.showSpecificPost = async (req, res) => {
	const { id } = req.params;
	const foundPost = await Post.findById(id).populate('creator').populate('comments').populate({ path: 'comments', populate: { path: 'creator' } });
	res.render('posts/show', { foundPost });
};

module.exports.editPost = async (req, res) => {
	const { id } = req.params;
	const { title, description, image } = req.body.post;
	const foundPost = await Post.findById(id);
	foundPost.title = title;
	foundPost.description = description;
	if(req.file) {
		cloudinary.uploader.destroy(foundPost.image.name);
		foundPost.image = { name: req.file.filename, url: req.file.path };
	}
	await foundPost.save();
	req.flash('success', 'Successfully Updated Post');
	res.redirect(`/posts/${id}`);
};

module.exports.deletePost = async (req, res) => {
	const { id } = req.params;
	const deletedPost = await Post.findByIdAndDelete(id);
	req.flash('success', 'Successfully Deleted Post');
	res.redirect('/posts');
};

module.exports.renderEditPostForm = async (req, res) => {
	const { id } = req.params;
	const foundPost = await Post.findById(id).populate('creator');
	res.render('posts/edit', { foundPost });
};