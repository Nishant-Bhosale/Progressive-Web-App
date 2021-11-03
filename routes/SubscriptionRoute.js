const express = require("express");
const Subscription = require("../models/Subscription.js");

const router = express.Router();

router.post("/sub", async (req, res) => {
	const { endpoint, keys } = req.body;

	const subscription = new Subscription({
		endpoint,
		auth: keys.auth,
		p256dh: keys.p256dh,
	});

	await subscription.save();
	res.status(201).json({ subscription });
});

router.get("/sub/:auth", async (req, res) => {
	console.log(req.params.auth);
	const auth = req.params.auth;
	const subscription = await Subscription.findOne({ auth: auth });

	if (!subscription) {
		return res.status(404).json({ message: "Not Authenticated" });
	}

	res.status(200).json(subscription);
});

module.exports = router;
