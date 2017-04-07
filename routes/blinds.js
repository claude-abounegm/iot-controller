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

router.put('/up', function(req, res, next) {
	sendSignal(config.blinds.UP_PIN);
	res.end();
});

router.put('/down', function(req, res, next) {
	sendSignal(config.blinds.DOWN_PIN);
	res.end();
});

router.put('/stop', function(req, res, next) {
	sendSignal(config.blinds.STOP_PIN);
	res.end();
});

module.exports = router;
