const mongoose = require("mongoose"),
	  passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	googleId: String,
	email: String,
	username: String,
	password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);