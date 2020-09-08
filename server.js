require("dotenv").config();

//Packages
const express = require("express"),
	  app = express(),
	  cors = require("cors"),
	  mongoose = require("mongoose"),
	  bodyParser = require("body-parser"),
	  cookieParser = require("cookie-parser"),
	  jwt = require("jsonwebtoken"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  JwtStrategy = require("passport-jwt").Strategy,
	  passportLocalMongoose = require("passport-local-mongoose");

//Models
const User = require("./models/User"),
	  Token = require("./models/Token");

//Routes
const indexRoutes = require("./routes/index"),
	  taskRoutes = require("./routes/task"),
	  stepRoutes = require("./routes/step");

//DB Config
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/taskplanner", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useFindAndModify", false);

//App Config
//Enables cookies in cross-origin request
app.use(cors({credentials: true, origin: true}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Authentication Config
app.use(passport.initialize());
passport.use(new JwtStrategy({
	//Extracts JWT from cookies
	jwtFromRequest: (req) => {
		let token = null;
		if(req && req.cookies) {
			token = req.cookies["access_token"];
		};
		return token;
	},
	secretOrKey: process.env.ACCESS_KEY
}, (payload, done) => {
	//Finds and returns user on successful JWT authentication
    User.findOne({_id: payload.sub}, (err, user) => {
        if(err) {
            return done(err, false);
        };
        if(!user) {
        	return done(null, false);
        };
        return done(null, user);
    });
}));
//Uses passportLocalMongoose's authenticate method
passport.use(new LocalStrategy(User.authenticate()));
app.use((req, res, next) => {
	//Creates req.user on each request
	passport.authenticate("jwt", (err, user) => {
		req.user = user;
		next();
	})(req, res);
});
 
//Run Routes
app.use("/", indexRoutes);
app.use("/tasks", taskRoutes);
app.use("/tasks/:taskId/steps", stepRoutes);

//Start Server
app.listen(process.env.PORT || 3001, () => {
	console.log("Server Started");
});