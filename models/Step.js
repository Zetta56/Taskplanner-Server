const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
	content: String,
	order: {type: Number, default: 0},
	task: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Task"
	}
});

module.exports = mongoose.model("Step", stepSchema);