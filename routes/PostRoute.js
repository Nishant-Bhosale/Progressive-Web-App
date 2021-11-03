const express = require("express");
const Post = require("../models/Post.js");
const router = express.Router();

router.post("/post", async (req, res) => {
	const { title, location, img, id } = req.body;

	const newPost = new Post({
		title,
		location,
		id,
		image: img,
	});

	await newPost.save();

	res.status(201).json({ id: newPost.id, message: "Post added successfully" });
});

router.get("/posts", async (req, res) => {
	const posts = await Post.find();

	if (posts.length === 0) {
		res.status(400).json({ message: "Posts not found" });
		return;
	}

	res.status(200).json({ posts });
});

module.exports = router;
