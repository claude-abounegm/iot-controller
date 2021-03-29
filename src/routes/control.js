"use strict";

const express = require("express");
const router = express.Router();
const config = require("../../config.json");

let gpio;
try {
  gpio = require("rpi-gpio");
} catch (e) {
  gpio = {
    setup() {
      console.log(arguments);
    },

    write() {
      console.log(arguments);
    },
  };
}

const OFF = 0;
const ON = 1;

let blindsState = "unknown";
let hvacState = "off";

function initOutputPins(pins) {
  pins.forEach((pin) =>
    gpio.setup(pin, gpio.DIR_OUT, () => setPinState(pin, OFF))
  );
}

// we need to set the pins to be output pins; we also default their state to OFF.
initOutputPins([
  // blinds pins
  config.blinds.UP_PIN,
  config.blinds.STOP_PIN,
  config.blinds.DOWN_PIN,

  // hvac pins
  config.hvac.HEAT_PIN,
  config.hvac.COOL_PIN,
  config.hvac.FAN_PIN,
]);

// sets the pin to ON or OFF
function setPinState(pin, state, callback) {
  gpio.write(pin, state, callback);
}

// sends an ON signal for 80ms then sets it to OFF again.
function sendRemoteSignal(pin) {
  setPinState(pin, ON, () => setTimeout(() => setPinState(pin, OFF), 80));
}

router.get("/blinds", function (req, res) {
  res.json({ state: blindsState });
});

router.put("/blinds", function (req, res, next) {
  switch (req.body["action"]) {
    case "up":
      sendRemoteSignal(config.blinds.UP_PIN);
      blindsState = "open";
      break;

    case "down":
      sendRemoteSignal(config.blinds.DOWN_PIN);
      blindsState = "closed";
      break;

    case "stop":
      sendRemoteSignal(config.blinds.STOP_PIN);
      blindsState = "intermediate";
      break;

    default:
      next();
      return;
  }

  res.end();
});

router.get("/hvac", function (req, res) {
  res.json({ state: hvacState });
});

router.put("/hvac", function (req, res, next) {
  let heat = OFF;
  let cool = OFF;
  let fan = ON;
  let state = req.body.action;

  switch (state) {
    case "heat":
      heat = ON;
      break;

    case "cool":
      cool = ON;
      break;

    case "off":
      fan = OFF;
      break;

    default:
      next();
      return;
  }

  setPinState(config.hvac.HEAT_PIN, heat);
  setPinState(config.hvac.COOL_PIN, cool);
  setPinState(config.hvac.FAN_PIN, fan);

  hvacState = state;
  res.end();
});

module.exports = router;
