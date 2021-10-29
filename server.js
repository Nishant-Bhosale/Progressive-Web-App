const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const Post = require("./models/Post");
const connectDB = require("./config/db.js");

const PORT = 5000 || process.env.PORT;

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.post("/post", async (req, res) => {
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

app.get("/posts", async (req, res) => {
	const posts = await Post.find();

	if (posts.length === 0) {
		res.status(400).json({ message: "Posts not found" });
		return;
	}

	res.status(200).json({ posts });
});

app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`);
});
