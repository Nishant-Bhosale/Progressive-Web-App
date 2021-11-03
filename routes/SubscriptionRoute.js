const express = require("express");
const Subscription = require("./models/Subscription.js");

const router = express.Router();

router.post("/sub", async (req, res) => {
	const { endpoint, keys } = req.body;

	const subscription = new Subscription({
		endpoint,
		auth: keys.auth,
		p256dh: keys.p256dh,
	});

	console.log(subscription);
});
module.exports = router;
