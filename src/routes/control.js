"use strict";

const express = require("express");
const GPIO = require("../lib/GPIO");
const config = require("../../config.json");

const router = express.Router();

const gpio = new GPIO([
  // blinds pins
  config.blinds.UP_PIN,
  config.blinds.STOP_PIN,
  config.blinds.DOWN_PIN,

  // hvac pins
  config.hvac.HEAT_PIN,
  config.hvac.COOL_PIN,
  config.hvac.FAN_PIN,
]);

let blindsState = "unknown";
let hvacState = "off";

router.get("/blinds", function (req, res) {
  res.json({ state: blindsState });
});

router.put("/blinds", function (req, res, next) {
  switch (req.body["action"]) {
    case "up":
      gpio.sendFlashSignal(config.blinds.UP_PIN);
      blindsState = "open";
      break;

    case "down":
      gpio.sendFlashSignal(config.blinds.DOWN_PIN);
      blindsState = "closed";
      break;

    case "stop":
      gpio.sendFlashSignal(config.blinds.STOP_PIN);
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
  let heat = GPIO.OFF;
  let cool = GPIO.OFF;
  let fan = GPIO.ON;
  let state = req.body.action;

  switch (state) {
    case "heat":
      heat = GPIO.ON;
      break;

    case "cool":
      cool = GPIO.ON;
      break;

    case "off":
      fan = GPIO.OFF;
      break;

    default:
      next();
      return;
  }

  gpio.setPinState(config.hvac.HEAT_PIN, heat);
  gpio.setPinState(config.hvac.COOL_PIN, cool);
  gpio.setPinState(config.hvac.FAN_PIN, fan);

  hvacState = state;
  res.end();
});

module.exports = router;
