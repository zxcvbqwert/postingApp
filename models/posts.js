// /models/posts.js

const mongoose = require('mongoose');
const { cloudinary } = require('../cloudinary');
const Comment = require('./comments');

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		min: 2,
		required: true
	},
	image: {
		name: String,
		url: String
	},
	description: {
		type: String,
		min:2,
		required: true
	},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
	}],
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

postSchema.post('findOneAndDelete', async function (doc) {
	cloudinary.uploader.destroy(doc.image.name);

	await Comment.deleteMany({ _id: { $in: doc.comments } });
});

module.exports = mongoose.model('Post', postSchema);