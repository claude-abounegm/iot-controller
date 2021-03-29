"use strict";

const express = require("express");
const router = express.Router();
const GPIO = require("../lib/GPIO");
const config = require("../../config.json");

// we need to set the pins to be output pins; we also default their state to OFF.
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

  gpio.setPinState(config.hvac.HEAT_PIN, heat);
  gpio.setPinState(config.hvac.COOL_PIN, cool);
  gpio.setPinState(config.hvac.FAN_PIN, fan);

  hvacState = state;
  res.end();
});

module.exports = router;
