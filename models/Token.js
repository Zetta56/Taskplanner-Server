const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	token: String,
	userId: String,
	createdAt: {type: Date, expires: 604800, default: Date.now} //Expires in 1 week
});

module.exports = mongoose.model("Token", userSchema);