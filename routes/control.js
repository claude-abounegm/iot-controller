var express = require('express');
var router = express.Router();
var gpio = require('rpi-gpio');
var config = require('../config.json');

setupSignal(config.blinds.UP_PIN);
setupSignal(config.blinds.STOP_PIN);
setupSignal(config.blinds.DOWN_PIN);
setupSignal(config.hvac.FAN_PIN);
setupSignal(config.hvac.AIR_PIN);
setupSignal(config.hvac.HEAT_PIN);

function setupSignal(pin) {
	gpio.setup(pin, gpio.DIR_OUT, () => {
		gpio.write(pin, 0);
	});
}

function sendRemoteSignal(pin) {
	gpio.write(pin, 1, () => {
		setTimeout(() => {
			gpio.write(pin, 0);
		}, 500);
	});
}

function sendSignalOn(pin) {
	gpio.write(pin, 1, () => {});
}

function sendSignalOff(pin) {
	gpio.write(pin, 0, () => {});
}


router.put('/', function(req, res, next) {
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
	
		case 'fan':
			sendSignalOn(config.hvac.FAN_PIN);
			sendSignalOff(config.hvac.AIR_PIN);
			sendSignalOff(config.hvac.HEAT_PIN);
		break;
		
		case 'air':
			sendSignalOn(config.hvac.FAN_PIN);
			sendSignalOn(config.hvac.AIR_PIN);
			sendSignalOn(config.hvac.HEAT_PIN);
		break;

		case 'heat':
			sendSignalOn(config.hvac.FAN_PIN);
			sendSignalOff(config.hvac.AIR_PIN);
			sendSignalOn(config.hvac.HEAT_PIN);
		break;
		
		case 'hvacOff':
			sendSignalOff(config.hvac.FAN_PIN);
			sendSignalOff(config.hvac.AIR_PIN);
			sendSignalOff(config.hvac.HEAT_PIN);
		break;

		default:
			next();
		return;
	}

	res.end();
});

module.exports = router;
