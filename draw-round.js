const { getCurrentRound, setNewRound } = require('./redis-db');

async function checkDrawRound(req, res, next) {
	try {
		req.round = await getCurrentRound();

		if (Date.now() > req.round.endTime) {
			req.round = await setNewRound();
		}
		next();
	} catch (e) {
		console.log('failed to load current round', e);
		res.status(500).end();
	}
}

module.exports = { checkDrawRound }
