const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
	content: String,
	task: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Task"
	}
});

module.exports = mongoose.model("Step", stepSchema);