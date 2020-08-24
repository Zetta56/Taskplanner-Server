const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  mongoose = require("mongoose"),
	  Task = require("../models/Task"),
	  Step = require("../models/Step");

router.get("/", async (req, res) => {
	try {
		const foundSteps = await Step.find({task: req.params.taskId})
		res.json(foundSteps);
	} catch(err) {
		res.json(err);
	};
});

router.post("/", async (req, res) => {
	try {
		const newStep = await Step.create({...req.body, task: req.params.taskId});
		res.json(newStep)
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
		if(!mongoose.Types.ObjectId.isValid(req.params.stepId)) {
			return res.json({message: "Step does not exist."});
		};
		const deletedStep = await Step.findByIdAndDelete(req.params.stepId);
		if(!deletedStep) {
			return res.json({message: "Step does not exist."});
		}
		res.json(req.params.stepId);
	} catch(err) {
		res.json(err);
	};
});

module.exports = router;