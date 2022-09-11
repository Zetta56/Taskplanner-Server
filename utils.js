const jwt = require("jsonwebtoken"),
	  Token = require("./models/Token");

exports.regenerateToken = async (req) => {
	try {
		// Checks if refresh token exists
		if(!req.cookies["refresh_token"]) {
			return;
		};
		const result = await Token.findOne({token: req.cookies["refresh_token"]});
		// Checks if refresh token matches DB refresh token
		if(!result) {
			return;
		};
		// Checks if refresh token is valid
		const refreshToken = jwt.verify(result.token, process.env.REFRESH_KEY)
		// Re-creates access token
		const accessToken = jwt.sign({sub: refreshToken.sub}, process.env.ACCESS_KEY, {expiresIn: "15min"});
		return accessToken;
	} catch(err) {
		return;
	}
}