const jwt = require('jsonwebtoken');
const { getPlayer } = require('./redis-db');

const SECRET = process.env.JWT_SECRET || 'secret';

async function verifyPlayer(req, res, next) {
	try {
		const playerId = jwt.verify(req.cookies.token, SECRET);
		req.player = await getPlayer(playerId);
		return next();
	} catch (err) {
		console.log('verify error', err);
		res.status(401).end();
	}
}

function setPlayerToken(req, player) {
	req.cookie('token', jwt.sign(player.id, SECRET));
}


module.exports = {
	verifyPlayer,
	setPlayerToken
}