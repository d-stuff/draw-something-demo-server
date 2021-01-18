const shortid = require('shortid');
const { createPlayer } = require('./redis-db');
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

function gameStatus(req, res) {

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
