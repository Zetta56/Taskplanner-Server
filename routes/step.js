const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  mongoose = require("mongoose"),
	  sanitize = require("sanitize-html"),
	  middleware = require("../middleware");
	  Task = require("../models/Task"),
	  Step = require("../models/Step");

router.get("/", middleware.taskAuthorized, async (req, res) => {
	try {
		//Finds and sorts steps according to order
		const foundSteps = await Step.find({task: req.params.taskId}).sort({"order": "ascending"}).exec();
		res.json(foundSteps);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.post("/", middleware.taskAuthorized, async (req, res) => {
	try {
		const newStep = await Step.create({content: "New Step", task: req.params.taskId});
		const foundTask = await Task.findById(req.params.taskId);
		//Adds step to task's references
		await foundTask.steps.push(newStep._id);
		await foundTask.save();
		res.json(newStep);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.post("/reorder", middleware.taskAuthorized, async (req, res) => {
	try {
		const foundSteps = await Step.find({task: req.params.taskId});
		foundSteps.forEach(step => {
			//Sets step's order to reordered step's index
			step.order = req.body.map(el => el._id).indexOf(step._id.toString());
			step.save();
		});
		res.json(foundSteps);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.put("/:stepId", middleware.taskAuthorized, middleware.stepAuthorized, async (req, res) => {
	try {
		const types = ["content", "order", "done"];
		let sanitizedProperty = null;
		for(let i = 0; i < types.length; i++) {
			if(req.body.hasOwnProperty(types[i])) {
				let type = types[i];
				sanitizedProperty = {[type]: sanitize(req.body[type])};
			}
		};
		const updatedStep = await Step.findByIdAndUpdate(req.params.stepId, sanitizedProperty || req.body, {new: true});
		res.json(updatedStep);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.delete("/:stepId", middleware.taskAuthorized, middleware.stepAuthorized, async (req, res) => {
	try {
		const foundTask = await Task.findById(req.params.taskId);
		//Removes step from task's references
		await foundTask.steps.pull(req.params.stepId);
		await foundTask.save();
		await Step.findByIdAndDelete(req.params.stepId);
		res.json(req.params.stepId);
	} catch(err) {
		res.status(500).json(err);
	};
});

router.delete("/", middleware.taskAuthorized, async (req, res) => {
	try {
		await Task.findByIdAndUpdate(req.params.taskId, {steps: []});
		await Step.deleteMany({task: req.params.taskId});
		res.json(true);
	} catch(err) {
		res.status(500).json(err);
	};
});

module.exports = router;