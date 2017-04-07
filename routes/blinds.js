var express = require('express');
var router = express.Router();
var gpio = require('rpi-gpio');
var config = require('../config.json');

setupSignal(config.blinds.UP_PIN);
setupSignal(config.blinds.STOP_PIN);
setupSignal(config.blinds.DOWN_PIN);

function setupSignal(pin) {
	gpio.setup(pin, gpio.DIR_OUT, () => {
		gpio.write(pin, 0);
	});
}

function sendSignal(pin) {
	gpio.write(pin, 1, () => {
		setTimeout(() => {
			gpio.write(pin, 0);
		}, 500);
	});
}

router.put('/', function(req, res, next) {
	switch(req.body['action']) {
		case 'up':
			sendSignal(config.blinds.UP_PIN);
		break;

		case 'down':
			sendSignal(config.blinds.DOWN_PIN);
		break;

		case 'stop':
			sendSignal(config.blinds.STOP_PIN);
		break;

		default:
			next();
		return;
	}

	res.end();
});

module.exports = router;
