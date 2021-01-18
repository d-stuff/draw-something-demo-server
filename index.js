const ApiKit = require('@greenpress/api-kit');
const cookieParser = require('cookie-parser')

const dsController = require('./ds-controller');
const { checkDrawRound } = require('./draw-round');
const { verifyPlayer } = require('./verify-user');
const app = ApiKit.app();

app.use(cookieParser());

app.use(checkDrawRound);

app
	.post('/api/start', dsController.startGame)
	.get('/api/status', verifyPlayer, dsController.gameStatus)
	.get('/api/drawing', verifyPlayer, dsController.getDrawing)
	.put('/api/drawing', verifyPlayer, dsController.setDrawing)
	.post('/api/word', verifyPlayer, dsController.sendWord);


app.use((err, req, res, next) => {
	console.log('some error happened', err);
	res.status(500).end();
})


ApiKit.start('Draw something workshop demo server is up', process.env.PORT || 3000);
