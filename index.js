const ApiKit = require('@greenpress/api-kit');
const cookieParser = require('cookie-parser')

const dsController = require('./ds-controller');
const { checkDrawRound } = require('./draw-round');
const { verifyPlayer } = require('./verify-user');
const app = ApiKit.app();

app.get('/api', (_, res) => res.json({message: 'welcome to draw something demo game API'}).end());

app.use(cookieParser());

app.post('/api/start', dsController.startGame)

app.use(checkDrawRound);
app
	.get('/api/status', verifyPlayer, dsController.gameStatus)
	.get('/api/drawing', verifyPlayer, dsController.getDrawing)
	.put('/api/drawing', verifyPlayer, dsController.setDrawing)
	.post('/api/word', verifyPlayer, dsController.sendWord);


app.use((err, req, res, next) => {
	console.log('some error happened', err);
	res.status(500).end();
})


ApiKit.start('Draw something workshop demo server is up', process.env.PORT || 3000, '0.0.0.0');
