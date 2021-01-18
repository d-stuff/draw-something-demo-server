const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');
const getItem = promisify(client.get).bind(client);
const setItem = promisify(client.set).bind(client);
const removeItem = promisify(client.del).bind(client);
const getKeys = promisify(client.keys).bind(client);

let allPlayers = null;
let orderedPlayers = [];
let currentRound = null;

function clearDatabase() {
	return getKeys('*').then(async keys => {
		for (let key of keys) {
			try {
				await removeItem(key)
			} catch (err) {
				console.log('item not removed: ', key);
				console.log('reason: ', err);
				return null;
			}
		}
	});
}

/**
 *
 * @returns @type {Promise<Object.<string, { id: string, name: string, points: number }>}
 */
function getAllPlayers() {
	if (!allPlayers) {
		return getItem('players')
			.then(json => allPlayers = typeof json === 'string' ? JSON.parse(json) : {})
			.then(() => allPlayers)
			.catch(() => {
				allPlayers = {};
				return allPlayers;
			});
	}
	return Promise.resolve(allPlayers);
}

async function getOrderedPlayers() {
	return orderedPlayers;
}

/**
 *
 * @param playerId: string
 * @returns {Promise<{ id: string, name: string, points: number }>}
 */
function getPlayer(playerId) {
	return getAllPlayers()
		.then(players => ({ ...players[playerId] } || Promise.reject(new Error('Player not found'))));
}

/**
 *
 * @param player: { id: string, name: string, points: number }
 * @returns {Promise<{ id: string, name: string, points: number }>}
 */
function createPlayer(player) {
	return getAllPlayers()
		.then(players => {
			players[player.id] = player;
			orderedPlayers.push({ ...player });
			return setItem('players', JSON.stringify(players));
		})
}

/**
 *
 * @returns {Promise<{drawerId?: string, word?: string}>}
 */
function getCurrentRound() {
	if (currentRound) {
		return Promise.resolve(currentRound);
	}
	return getItem('round')
		.then(JSON.parse)
		.then(round => currentRound = round)
		.catch(() => currentRound = {
			drawerId: null,
			word: null
		})
		.then(() => currentRound);
}


module.exports = {
	clearDatabase,
	getAllPlayers,
	getPlayer,
	createPlayer,
	getCurrentRound,
	getOrderedPlayers
}
