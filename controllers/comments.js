const Comment = require('../models/comments');
const Post = require('../models/posts');

module.exports.createComment = async (req, res) => {
	const { id } = req.params;
	const { commentText } = req.body;
	const newComment = new Comment({ text: commentText });
	const foundPost = await Post.findById(id);
	foundPost.comments.push(newComment._id);
	await foundPost.save();
	newComment.creator = req.user._id;
	await newComment.save();
	req.flash('success', 'Successfully Made Comment');
	res.redirect(`/posts/${id}`);
};

module.exports.updateComment = async (req, res) => {
	const { id, commentId } = req.params;
	const { commentText } = req.body;
	await Comment.findByIdAndUpdate(commentId, { text: commentText });
	req.flash('success', 'Successfully Updated Comment');
	res.redirect(`/posts/${id}`);
};

module.exports.deleteComment = async (req, res) => {
	const { id, commentId } = req.params;
	await Comment.findByIdAndDelete(commentId);
	const foundPost = await Post.findById(id);
	const indexOfCommentToRemove = foundPost.comments.findIndex(e => e.equals(commentId));
	foundPost.comments.splice(indexOfCommentToRemove, 1);
	req.flash('success', 'Successfully Deleted Comment');
	res.redirect(`/posts/${id}`);
};
