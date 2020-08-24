const express = require("express"),
	  router = express.Router(),
	  mongoose = require("mongoose"),
	  Task = require("../models/Task");
	  Step = require("../models/Step");

router.get("/", async(req, res) => {
	try {
		if(!req.user) {
			const tasks = await Task.find({creator: {$exists: false}});
			res.json(tasks);
		} else {
			const tasks = await Task.find({creator: req.user});
			res.json(tasks);
		};
		
	} catch(err) {
		res.json(err);
	};
});

router.post("/", async (req, res) => {
	try {
		const newTask = await Task.create(req.body);
		if(req.user) {
			newTask.creator = req.user._id;
			newTask.save();
		}
		res.json(newTask);
	} catch(err) {
		res.json(err);
	};
});

router.get("/:taskId", async (req, res) => {
	try {
		if(!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
			return res.json({message: "Task does not exist."});
		};
		const foundTask = await Task.findById(req.params.taskId);
		if(!foundTask) {
			return res.json({message: "Task does not exist."});
		};
		res.json(foundTask);
	} catch(err) {
		res.json(err);
	};
});

router.put("/:taskId", async (req, res) => {
	try {
		if(!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
			return res.json({message: "Task does not exist."});
		};
		const foundTask = await Task.findById(req.params.taskId);
		//New option makes mongoose return updated result
		const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, {new: true});
		if(!updatedTask) {
			return res.json({message: "Task does not exist."});
		};
		res.json(updatedTask);
	} catch(err) {
		res.json(err);
	};
});

router.delete("/:taskId", async (req, res) => {
	try {
		if(!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
			return res.json({message: "Task does not exist."});
		};
		await Step.deleteMany({task: req.params.taskId});
		await Task.findByIdAndDelete(req.params.taskId);
		if(!deletedTask) {
			return res.json({message: "Task does not exist."});
		}
		res.json(req.params.taskId);
	} catch(err) {
		res.json(err);
	};
});

//Accepts post request to ensure that it works with sendBeacon
router.post("/anonymous", async (req, res) => {
	try {
		const anonymousTasks = await Task.find({creator: null});
		anonymousTasks.forEach(async (task) => {
			await Step.deleteMany({task: task._id});
		});
		await Task.deleteMany({creator: null});
		res.json(true);
	} catch(err) {
		res.json(err);
	};
});

module.exports = router;