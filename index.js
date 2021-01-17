const ApiKit = require('@greenpress/api-kit');
const dsController = require('./ds-controller');
const app = ApiKit.app()

app
	.post('/api/start', dsController.startGame)
	.get('/api/status', dsController.gameStatus)
	.get('/api/drawing', dsController.getDrawing)
	.put('/api/drawing', dsController.setDrawing)
	.post('/api/word', dsController.sendWord);


ApiKit.start('Draw something workshop demo server is up', process.env.PORT);
