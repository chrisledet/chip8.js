"use strict";

class Display {
  constructor(displayDomContainer) {
    let pixelWidth = displayDomContainer.width / 64;
    let pixelHeight = displayDomContainer.height / 32;

    this.states = this.clearStates();
    this.resolution = { width: 64, height: 32 };
    this.pixel = { width: pixelWidth, height: pixelHeight };
    this.context = displayDomContainer.getContext("2d");
    this.context.fillStyle = "#FFFFFF";
  }

  draw(newStates) {
    let pixel = this.pixel;

    for (let x = 0; x < this.resolution.width; x++) {
      for (let y = 0; y < this.resolution.height; y++) {
        if (newStates[x][y]) {
          this.context.fillRect(x * pixel.width, y * pixel.height, pixel.width, pixel.height);
        } else {
          this.context.clearRect(x * pixel.width, y * pixel.height, pixel.width, pixel.height);
        }
      }
    }

    this.states = newStates;
  }

  current() {
    return this.states;
  }

  clear() {
    let states = this.clearStates();
    this.draw(states);
  }

  clearStates() {
    let states = [];

    for (var x = 0; x < 64; x++) {
      states[x] = [];
      for (var y = 0; y < 32; y++) {
        states[x][y] = false;
      }
    }

    return states;
  }
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = Display;
} else {
  window.Display = Display;
}
