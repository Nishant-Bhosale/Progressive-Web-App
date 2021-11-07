const express = require("express");
const webPush = require("web-push");
const Post = require("../models/Post.js");
const Subscription = require("../models/Subscription");
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

	webPush.setVapidDetails(
		"mailto: nishantbhosale244@gmail.com",
		"BCxZO8ISa0u3tzEWENPwSmKHeTzCT718J82s_j2Zn2WcGvtW2i6jYskdtpL_0WGT3-kmOSSTuWkMGKkB1xo09Tw",
		process.env.PrivateKey,
	);

	const subscriptions = await Subscription.find();

	subscriptions.forEach((sub) => {
		const pushConfig = {
			endpoint: sub.endpoint,
			keys: {
				auth: sub.auth,
				p256dh: sub.p256dh,
			},
		};

		webPush
			.sendNotification(
				pushConfig,
				JSON.stringify({ title: "New Post", content: "New Post Added" }),
			)
			.catch((err) => {
				console.log(err);
			});
	});

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
