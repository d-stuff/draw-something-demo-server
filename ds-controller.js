const shortid = require('shortid');
const { getPlayer, getOrderedPlayers, createPlayer } = require('./redis-db');
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

async function gameStatus(req, res) {
	const status = {
		players: await getOrderedPlayers()
	};

	status.round = {
		drawerId: res.round.drawerId
	}

	if (req.player.id === req.round.drawerId) {
		status.round.drawer = req.player;
		status.round.word = req.round.word;
	} else {
		status.round.drawer = await getPlayer(req.round.drawerId);
	}

	return res.json(status).end();
}

function getDrawing(req, res) {

}

function setDrawing(req, res) {

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
