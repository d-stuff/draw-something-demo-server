const { getCurrentRound } = require('./redis-db');

async function checkDrawRound(req, res, next) {
	try {
		req.round = await getCurrentRound();
		next();
	} catch (e) {
		console.log('failed to load current round');
		res.status(500).end(0);
	}
}

module.exports = { checkDrawRound }
