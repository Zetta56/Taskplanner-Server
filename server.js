//Packages
const express = require("express"),
	  app = express(),
	  cors = require("cors"),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  methodOverride = require("method-override"),
	  session = require("express-session"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  passportLocalMongoose = require("passport-local-mongoose");

//Models
const User = require("./models/User");

//DB Config
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/taskplanner", {useNewUrlParser: true, useUnifiedTopology: true});

//App Config
require("dotenv").config();
app.use(cors());
app.use(bodyParser.json());

//Authentication Config
app.use(session({
	secret: "how original",
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes
app.get("/task", (req, res) => {
	res.json({name: "hello"});
});

app.post("/users", async (req, res) => {
	try {
		let newUser = await User.create(req.body);
		res.json(newUser);
	} catch(err) {
		console.log(err);
	};
});

//Start Server
app.listen(process.env.PORT || 3001, () => {
	console.log("Server Started");
});