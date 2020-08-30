const express = require("express"),
	  router = express.Router(),
	  mongoose = require("mongoose"),
	  middleware = require("../middleware"),
	  Task = require("../models/Task"),
	  Step = require("../models/Step");

router.get("/", middleware.isLoggedIn, async(req, res) => {
	try {
		const tasks = await Task.find({creator: req.user});
		res.json(tasks);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.post("/", middleware.isLoggedIn, async (req, res) => {
	try {
		const newTask = await Task.create({...req.body, creator: req.user._id});
		res.json(newTask);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.get("/:taskId", middleware.taskAuthorized, async (req, res) => {
	try {
		const foundTask = await Task.findById(req.params.taskId);
		res.json(foundTask);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.put("/:taskId", middleware.taskAuthorized, async (req, res) => {
	try {
		//New option makes mongoose return updated result
		const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, {new: true});
		res.json(updatedTask);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.delete("/completed", middleware.isLoggedIn, async (req, res) => {
	try {
		const foundTasks = await Task.find({done: true, creator: req.user._id});
		foundTasks.forEach(async (task) => {
			//Removes associated steps
			await Step.deleteMany({task: task._id});
			await Task.findByIdAndDelete(task._id);
		});
		res.json(foundTasks.map(task => task._id));
	} catch(err) {
		res.status(500).json(err);
	};
});

router.delete("/:taskId", middleware.taskAuthorized, async (req, res) => {
	try {
		//Removes associated steps
		await Step.deleteMany({task: req.params.taskId});
		const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
		res.json(req.params.taskId);
	} catch(err) {
		res.status(500).json(err);
	};
});

module.exports = router;