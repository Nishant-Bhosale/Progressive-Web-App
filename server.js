const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const Post = require("./models/Post");
const connectDB = require("./config/db.js");
const postRouter = require("./routes/PostRoute.js");
const PORT = 5000 || process.env.PORT;

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(cors());
app.use(postRouter);

app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`);
});
