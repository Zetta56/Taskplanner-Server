const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
	title: String,
	description: String,
	date: Date,
	editDisabled: {type: Boolean, default: false},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	steps: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Step"
		}
	]
});

module.exports = mongoose.model("Task", taskSchema);