const express = require("express"),
	  router = express.Router(),
	  sanitize = require("sanitize-html"),
	  middleware = require("../middleware"),
	  Task = require("../models/Task"),
	  Step = require("../models/Step");

router.use(middleware.isLoggedIn)

router.get("/", async(req, res) => {
	try {
		let tasks = null
		switch(req.query.filter) {
			case "Alphabetical":
				tasks = await Task.find({creator: req.user}).sort({"title": "asc"}).exec();
				break;
			case "Newest":
				tasks = await Task.find({creator: req.user}).sort({"date": "asc"}).exec();
				break;
			case "Oldest":
				tasks = await Task.find({creator: req.user}).sort({"date": "desc"}).exec();
				break;
			default:
				tasks = await Task.find({creator: req.user});
				break;
		};
		res.json(tasks);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.post("/", async (req, res) => {
	try {
		const taskBody = {
			title: "New Task",
			description: "Enter a description here...",
			date: Date.now()
		};
		const newTask = await Task.create({...taskBody, creator: req.user._id});
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
		const types = ["title", "description", "date", "editDisables", "done"];
		let sanitizedProperty = null;
		for(let i = 0; i < types.length; i++) {
			if(req.body.hasOwnProperty(types[i])) {
				let type = types[i];
				sanitizedProperty = {[type]: sanitize(req.body[type])};
			}
		};
		//New option makes mongoose return updated result
		const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, sanitizedProperty || req.body, {new: true});
		res.json(updatedTask);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.delete("/completed", async (req, res) => {
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