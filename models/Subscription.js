const mongoose = require("mongoose");

const { Schema } = mongoose;

const SubscriptionSchema = new Schema({
	endpoint: {
		type: String,
		required: true,
	},
	auth: {
		type: String,
		required: true,
	},
	p256dh: {
		type: String,
		required: true,
	},
});

const subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = subscription;
