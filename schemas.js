const Joi = require('joi');

module.exports.postSchema = Joi.object({
	title: Joi.string().min(2).required(),
	description: Joi.string().min(2).required()
});

module.exports.commentSchema = Joi.object({
	text: Joi.string().min(1).required()
});