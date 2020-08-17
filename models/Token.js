const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	token: String,
	userId: String,
	createdAt: {type: Date, default: Date.now, expires: 604800} //Expires in 1 week
});

module.exports = mongoose.model("Token", userSchema);