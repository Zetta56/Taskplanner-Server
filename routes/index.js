const express = require("express"),
	  router = express.Router(),
	  passport = require("passport"),
	  jwt = require("jsonwebtoken"),
	  OAuth2Client = require("google-auth-library").OAuth2Client,
		{ regenerateToken } = require("../utils"),
	  middleware = require("../middleware"),
	  User = require("../models/User"),
	  Token = require("../models/Token");

router.post("/register", middleware.isNotLoggedIn, (req, res) => {
	let user = {
		email: req.body.email,
		username: req.body.username
	};
	User.register(user, req.body.password, (err, newUser) => {
		if(err) {
			res.status(409).json(err);
		};

		res.json(newUser);
	});
});

//Uses custom authenticate callback for error handling
router.post("/login", middleware.isNotLoggedIn, (req, res) => {
	let currentUser = null;
	passport.authenticate("local", async(err, user) => {
		if(process.env.GOOGLE_CLIENTID && req.body.googleToken) {
			try {
				//Verifies that google token is valid
				const ticket = await new OAuth2Client(process.env.GOOGLE_CLIENTID).verifyIdToken({
					idToken: req.body.googleToken,
					audience: process.env.GOOGLE_CLIENTID
				});
				//Note: ticket.getPayload().sub represents google id
				const foundUser = await User.findOne({googleId: ticket.getPayload().sub});
				currentUser = foundUser ? foundUser : await User.create({googleId: ticket.getPayload().sub});
			} catch(err) {
				return res.status(500).json(err);
			};
		} else if(err) {
			return res.status(500).json(err);
		} else if(!user) {
			return res.status(401).json({message: "Username or password is incorrect"});
		} else {
			await req.logIn(user, {session: false});
			currentUser = user
		};

		//Creates JWT
		const refreshToken = jwt.sign({sub: currentUser._id}, process.env.REFRESH_KEY, {expiresIn: "3 days"});
		const accessToken = jwt.sign({sub: currentUser._id}, process.env.ACCESS_KEY, {expiresIn: "15min"});
		await Token.create({token: refreshToken, userId: currentUser._id});

		//Sends JWT in cookie
		res.cookie("refresh_token", refreshToken, {httpOnly: true, sameSite: "none", secure: true});
		res.cookie("access_token", accessToken, {httpOnly: true, sameSite: "none", secure: true});
		res.json(currentUser._id);
	})(req, res);
});

router.get("/logout", (req, res) => {
	//Clears JWT cookies with same options
	res.clearCookie("access_token", {httpOnly: true, sameSite: "none", secure: true, path: "/"});
	res.clearCookie("refresh_token", {httpOnly: true, sameSite: "none", secure: true, path: "/"});
	res.json(true);
});

router.get("/user", (req, res) => {
	res.json(req.user);
});

router.post("/refresh", async (req, res) => {
	const accessToken = await regenerateToken(req);
	if(accessToken) {
		res.cookie("access_token", accessToken, {httpOnly: true, sameSite: true, secure: true});
		res.json(true);
	} else {
		res.json(false);
	}
});

module.exports = router;