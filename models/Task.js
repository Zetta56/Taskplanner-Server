const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
	title: String,
	description: String,
	date: Date,
	editDisabled: Boolean,
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model("Task", taskSchema);