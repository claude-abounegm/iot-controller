"use strict";

let gpio;
try {
  gpio = require("rpi-gpio");
} catch (e) {
  console.log("using dummy gpio");

  gpio = {
    setup(pin, direction) {
      console.log(`setup pin ${pin}, direction: ${direction}`);
    },
    write(pin, state, callback) {
      console.log(`set pin ${pin} to ${state}`);

      callback && callback();
    },
    DIR_IN: "in",
    DIR_OUT: "out",
    DIR_LOW: "low",
    DIR_HIGH: "high",
  };
}

const OFF = 0;
const ON = 1;

class GPIO {
  static OFF = OFF;
  static ON = ON;

  constructor(pins) {
    if (pins) {
      // we need to set the pins to be output pins; we also default their state to OFF.
      this.initOutputPins(pins);
    }
  }

  initOutputPins(pins) {
    pins.forEach((pin) =>
      gpio.setup(pin, gpio.DIR_OUT, () => setPinState(pin, OFF))
    );
  }

  /**
   * Sets the pin to ON or OFF
   * @param {*} pin
   * @param {*} state
   * @param {*} callback
   */
  setPinState(pin, state, callback) {
    gpio.write(pin, state, callback);
  }

  /**
   * Sends an ON signal for 80ms then sets it to OFF again.
   * @param {*} pin
   * @param {*} timeout
   */
  sendFlashSignal(pin, timeout = 80) {
    this.setPinState(pin, ON, () =>
      setTimeout(() => this.setPinState(pin, OFF), timeout)
    );
  }
}

module.exports = GPIO;
