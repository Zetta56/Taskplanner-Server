const express = require("express"),
	  router = express.Router(),
	  mongoose = require("mongoose"),
	  Task = require("../models/Task");

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

router.post("/new", async (req, res) => {
	try {
		const newTask = await Task.create(req.body);
		if(req.user) {
			newTask.creator = req.user
			newTask.save();
		};
		res.json(newTask);
	} catch(err) {
		res.json(err);
	};
});

router.get("/:id", async (req, res) => {
	try {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.json({message: "Task does not exist."});
		};
		const foundTask = await Task.findById(req.params.id);
		if(!foundTask) {
			return res.json({message: "Task does not exist."});
		};
		res.json(foundTask);
	} catch(err) {
		res.json(err);
	};
});

router.put("/:id", async (req, res) => {
	try {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.json({message: "Task does not exist."});
		};
		//New option makes mongoose return updated result
		const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true});
		if(!updatedTask) {
			return res.json({message: "Task does not exist."});
		};
		res.json(updatedTask);
	} catch(err) {
		res.json(err);
	};
})

router.delete("/:id", async (req, res) => {
	try {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.json({message: "Task does not exist."});
		};
		await Task.findByIdAndDelete(req.params.id);
		res.json(req.params.id);
	} catch(err) {
		res.json(err);
	};
})

module.exports = router;