//Packages
const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  methodOverride = require("method-override");

//App Config
require("dotenv").config();

//Start Server
app.listen(process.env.PORT || 3000, () => {
	console.log("Server Started");
});