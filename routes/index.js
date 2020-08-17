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

		await req.logIn(user, {session: false})
		const {_id} = req.user;
		const accessToken = jwt.sign({sub: _id}, process.env.ACCESS_KEY, {expiresIn: "15min"});	//Creates JWT
		const refreshToken = jwt.sign({sub: _id}, process.env.REFRESH_KEY, {expiresIn: "1 week"});
		await Token.create({token: refreshToken, userId: _id});

		res.cookie("access_token", accessToken, {httpOnly: true, sameSite: true});		//Sends JWT in cookie
		res.cookie("refresh_token", refreshToken, {httpOnly: true, sameSite: true});
		res.json(_id);
	})(req, res);
});

router.get("/logout", (req, res) => {
	res.clearCookie("access_token");	//Clears JWT cookies
	res.clearCookie("refresh_token");
	res.json(true);
});

router.post("/access", (req, res) => {
	passport.authenticate("jwt", (err, user) => {
		if(err) {
			return res.json(err);
		};
		if(!user) {
			return res.json(false);
		}
		res.json(user);
	})(req, res);
});

router.post("/refresh", (req, res) => {
	if(!req.cookies["refresh_token"]) {		//Checks if refresh token exists
		return res.json(false);
	};
	Token.findOne({token: req.cookies["refresh_token"]}, (err, refreshToken) => {
		if(!refreshToken) {		//Checks if refresh token matches DB refresh token
			return res.json(false);
		};
		jwt.verify(refreshToken.token, process.env.REFRESH_KEY, (err, token) => {	//Checks if refresh token is valid
			if(err) {
				return res.json(err);
			};
			const accessToken = jwt.sign({sub: token.sub}, process.env.ACCESS_KEY, {expiresIn: "15min"});	//Re-creates access token
			res.cookie("access_token", accessToken, {httpOnly: true, sameSite: true});
			res.json(token.sub);
		});
	});
});

module.exports = router;