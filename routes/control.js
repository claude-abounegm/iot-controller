var express = require('express');
var router = express.Router();
var gpio = require('rpi-gpio');
var config = require('../config.json');

const OFF = 0;
const ON = 1;

setupSignal(config.blinds.UP_PIN);
setupSignal(config.blinds.STOP_PIN);
setupSignal(config.blinds.DOWN_PIN);

setupSignal(config.hvac.HEAT_PIN);
setupSignal(config.hvac.COOL_PIN);
setupSignal(config.hvac.FAN_PIN);

function setupSignal(pin) {
	gpio.setup(pin, gpio.DIR_OUT, () => {
		gpio.write(pin, OFF);
	});
}

function sendRemoteSignal(pin) {
	gpio.write(pin, ON, () => {
		setTimeout(() => {
			gpio.write(pin, OFF);
		}, 500);
	});
}

function sendSignal(pin,state) {
	gpio.write(pin, state);
}

router.put('/blinds', function(req, res, next) {
	switch(req.body['action']) {
		case 'up':
			sendRemoteSignal(config.blinds.UP_PIN);
		break;

		case 'down':
			sendRemoteSignal(config.blinds.DOWN_PIN);
		break;

		case 'stop':
			sendRemoteSignal(config.blinds.STOP_PIN);
		break;

		default:
			next();
		return;
	}

	res.end();
});

router.put('/hvac', function(req, res, next) {
	let heat = OFF;
	let cool = OFF;
	let fan = ON;

	switch(req.body['action']) {
		case 'heat':
			heat = ON;
		break;

		case 'cool':
			cool = ON;
		break;
		
		case 'off':
			fan = OFF;
		break;

		default:
			next();
		return;
	}

	sendSignal(config.hvac.HEAT_PIN, heat);
	sendSignal(config.hvac.COOL_PIN, cool);
	sendSignal(config.hvac.FAN_PIN, fan);

	res.end();
});

module.exports = router;
