const ApiKit = require('@greenpress/api-kit');
const cookieParser = require('cookie-parser')

const dsController = require('./ds-controller');
const { verifyPlayer } = require('./verify-user');
const app = ApiKit.app();

app.use(cookieParser());

app
	.post('/api/start', dsController.startGame)
	.get('/api/status', verifyPlayer, dsController.gameStatus)
	.get('/api/drawing', verifyPlayer, dsController.getDrawing)
	.put('/api/drawing', verifyPlayer, dsController.setDrawing)
	.post('/api/word', verifyPlayer, dsController.sendWord);


ApiKit.start('Draw something workshop demo server is up', process.env.PORT);
