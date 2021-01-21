const shortid = require('shortid');
const { getPlayer, getOrderedPlayers, createPlayer, getLatestDrawing } = require('./redis-db');
const { setPlayerToken } = require('./verify-user');

async function startGame(req, res) {
	const playerName = req.body.player;

	const player = { name: playerName, id: shortid.generate(), points: 0 };

	setPlayerToken(req, player);

	try {
		await createPlayer(player);
	} catch (e) {
		return res.status(500).json({ message: 'error creating player' }).end();
	}

	return res.json(player).end();
}

async function gameStatus(req, res, next) {
	try {
		const status = {
			players: await getOrderedPlayers(),
			round: {
				drawerId: req.round.drawerId
			}
		};

		if (req.player.id === req.round.drawerId) {
			status.round.drawer = req.player;
			status.round.word = req.round.word;
		} else {
			status.round.drawer = await getPlayer(req.round.drawerId);
		}
		return res.json(status).end();
	} catch (e) {
		return next(e);
	}
}

async function getDrawing(req, res, next) {
	try {
		const draw = await getLatestDrawing();
		res.send(draw);
	} catch (e) {
		next(e);
	}
}

function setDrawing(req, res) {
	if (req.player.id === req.round.drawerId) {
		setDrawing(req.body);
		res.status(200).end();
	} else {
		res.status(401).end();
	}
}

function sendWord(req, res) {

}

module.exports = {
	startGame,
	gameStatus,
	getDrawing,
	setDrawing,
	sendWord
};
