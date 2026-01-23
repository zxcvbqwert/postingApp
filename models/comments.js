const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true,
		min: 1
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Comment', commentSchema);