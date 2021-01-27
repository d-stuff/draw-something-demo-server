const jwt = require('jsonwebtoken');
const { getPlayer } = require('./redis-db');

const SECRET = process.env.JWT_SECRET || 'secret';

async function verifyPlayer(req, res, next) {
	if (!req.headers.token) {
		res.status(401).json({ message: 'token is missing' }).end();
		return;
	}
	try {
		const playerId = jwt.verify(req.headers.token || '', SECRET);
		req.player = await getPlayer(playerId);
		return next();
	} catch (err) {
		console.log('verify error', err);
		res.status(401).end();
	}
}

function getPlayerToken(player) {
	return jwt.sign(player.id, SECRET)
}


module.exports = {
	verifyPlayer,
	getPlayerToken
}
