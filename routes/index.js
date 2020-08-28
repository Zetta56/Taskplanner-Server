const express = require("express"),
	  router = express.Router(),
	  passport = require("passport"),
	  jwt = require("jsonwebtoken"),
	  User = require("../models/User"),
	  Token = require("../models/Token");

router.post("/register", (req, res) => {
	let user = {
		email: req.body.email,
		username: req.body.username
	};
	User.register(user, req.body.password, (err, newUser) => {
		if(err) {
			res.json(err);
		};

		res.json(newUser);
	});
});

router.post("/login", (req, res) => {
	passport.authenticate("local", async(err, user) => {
		if(err) {
			return res.json(err);
		};

		if(!user) {
			return res.json({message: "Username or password is incorrect"});
		};

		await req.logIn(user, {session: false});
		//Creates JWT
		const refreshToken = jwt.sign({sub: req.user._id}, process.env.REFRESH_KEY, {expiresIn: "1 week"});
		const accessToken = jwt.sign({sub: req.user._id}, process.env.ACCESS_KEY, {expiresIn: "15min"});
		await Token.create({token: refreshToken, userId: req.user._id});

		//Sends JWT in cookie
		res.cookie("refresh_token", refreshToken, {httpOnly: true, sameSite: true});
		res.cookie("access_token", accessToken, {httpOnly: true, sameSite: true});
		res.json(req.user._id);
	})(req, res);
});

router.get("/logout", (req, res) => {
	//Clears JWT cookies with same options
	res.clearCookie("access_token", {httpOnly: true, sameSite: true, path: "/"});
	res.clearCookie("refresh_token", {httpOnly: true, sameSite: true, path: "/"});
	res.json(true);
});

router.get("/access", (req, res) => {
	res.json(req.user);
});

router.post("/refresh", (req, res) => {
	//Checks if refresh token exists
	if(!req.cookies["refresh_token"]) {
		return res.json(false);
	};
	Token.findOne({token: req.cookies["refresh_token"]}, (err, refreshToken) => {
		//Checks if refresh token matches DB refresh token
		if(!refreshToken) {
			return res.json(false);
		};
		//Checks if refresh token is valid
		jwt.verify(refreshToken.token, process.env.REFRESH_KEY, (err, token) => {
			if(err) {
				return res.json(err);
			};
			//Re-creates access token
			const accessToken = jwt.sign({sub: token.sub}, process.env.ACCESS_KEY, {expiresIn: "15min"});
			res.cookie("access_token", accessToken, {httpOnly: true, sameSite: true});
			res.json(token.sub);
		});
	});
});

module.exports = router;