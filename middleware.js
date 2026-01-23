const Post = require('./models/posts');
const Comment = require('./models/comments');
const { postSchema } = require('./schemas');

module.exports.isLoggedIn = (req, res, next) => {
	if(!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You need to be logged in first!');
		return res.redirect('/login');
	}
	next();
};

module.exports.isPostCreator = async (req, res, next) => {
	const { id } = req.params;
	const foundPost = await Post.findById(id).populate('creator');
	if(!foundPost.creator._id.equals(req.user._id)) {
		req.flash('error', 'You are not the owner of this post');
		return res.redirect(`/posts/${id}`);
	}
	next();
};

module.exports.validatePostSchema = (req, res, next) => {
	const { post } = req.body;
	const { error } = postSchema.validate(post);
	//if(error) {
	//	req.flash('error', 'Schema Validation error');
	//	return res.redirect('/posts');
	//}
	next();
};

module.exports.isCommentCreator = async (req, res, next) => {
	const { id, commentId } = req.params;
	const foundComment = await Comment.findById(commentId);
	if(!foundComment.creator.equals(req.user._id)) {
		req.flash('error', 'You cannot modify others comments');
		return res.redirect(`/posts/${id}`);
	}
	next();
};