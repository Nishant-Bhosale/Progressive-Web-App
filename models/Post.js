const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	image: {
		type: String,
	},
});

const post = mongoose.model("Post", PostSchema);

module.exports = post;
