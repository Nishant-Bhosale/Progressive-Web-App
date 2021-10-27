const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");

const PORT = 5000 || process.env.PORT;

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
	res.send("HELLO");
});

app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`);
});
