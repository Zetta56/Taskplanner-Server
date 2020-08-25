const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  mongoose = require("mongoose"),
	  Task = require("../models/Task"),
	  Step = require("../models/Step");

router.get("/", async (req, res) => {
	try {
		//Finds and sorts steps according to order
		const foundSteps = await Step.find({task: req.params.taskId}).sort({"order": "ascending"}).exec();
		res.json(foundSteps);
	} catch(err) {
		res.json(err);
	};
});

router.post("/", async (req, res) => {
	try {
		const newStep = await Step.create({...req.body, task: req.params.taskId});
		const foundTask = await Task.findById(req.params.taskId);
		//Adds step to task's references
		await foundTask.steps.push(newStep._id);
		await foundTask.save();
		res.json(newStep);
	} catch(err) {
		res.json(err);
	};
});

router.put("/:stepId", async (req, res) => {
	try {
		if(!mongoose.Types.ObjectId.isValid(req.params.stepId)) {
			return res.json({message: "Step does not exist."});
		};
		const updatedStep = await Step.findByIdAndUpdate(req.params.stepId, req.body, {new: true});
		if(!updatedStep) {
			return res.json({message: "Step does not exist."});
		};
		res.json(updatedStep);
	} catch(err) {
		res.json(err);
	};
});

router.delete("/:stepId", async (req, res) => {
	try {
		if(!mongoose.Types.ObjectId.isValid(req.params.stepId) || !mongoose.Types.ObjectId.isValid(req.params.taskId)) {
			return res.json({message: "Step or task does not exist."});
		};
		const foundTask = await Task.findById(req.params.taskId);
		//Removes step from task's references
		await foundTask.steps.pull(req.params.stepId);
		await foundTask.save();
		const deletedStep = await Step.findByIdAndDelete(req.params.stepId);
		if(!foundTask || !deletedStep) {
			return res.json({message: "Step or task does not exist."});
		}
		res.json(req.params.stepId);
	} catch(err) {
		res.json(err);
	};
});

router.post("/reorder", async (req, res) => {
	try {
		const foundSteps = await Step.find({task: req.params.taskId});
		foundSteps.forEach(step => {
			//Sets step's order to reordered step's index
			step.order = req.body.map(el => el._id).indexOf(step._id.toString());
			step.save();
		});
		res.json(foundSteps);
	} catch(err) {
		res.json(err);
	};
});

module.exports = router;