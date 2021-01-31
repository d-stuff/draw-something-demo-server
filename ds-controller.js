const shortid = require('shortid');
const {
	getPlayer,
	getOrderedPlayers,
	createPlayer,
	getLatestDrawing,
	setLatestDrawing,
	setWinners,
	setNewRound
} = require('./redis-db');
const { getPlayerToken } = require('./verify-user');

async function startGame(req, res) {
	const playerName = req.body.player;

	const player = { name: playerName, id: shortid.generate(), points: 0 };

	const token = getPlayerToken(player);

	try {
		await createPlayer(player);
	} catch (e) {
		return res.status(500).json({ message: 'error creating player' }).end();
	}

	return res.json({ player, token }).end();
}

async function gameStatus(req, res, next) {
	try {
		const status = {
			me: req.player,
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
		res.json({ draw });
	} catch (e) {
		next(e);
	}
}

function setDrawing(req, res) {
	if (req.player.id === req.round.drawerId) {
		setLatestDrawing(req.body && req.body.draw);
		res.status(200).end();
	} else {
		res.status(401).end();
	}
}

async function sendWord(req, res) {
	if (req.body.word && req.body.word === req.round.word) {
		await setWinners([ req.player.id, req.round.drawerId ]);
		await setNewRound();
		res.status(200).json({
			message: 'You did it!'
		})
	} else {
		res.status(400).end();
	}
}

module.exports = {
	startGame,
	gameStatus,
	getDrawing,
	setDrawing,
	sendWord
};
