"use strict";

class Display {
  constructor(displayDomContainer) {
    let pixelWidth = displayDomContainer.width / 64;
    let pixelHeight = displayDomContainer.height / 32;

    this.resolution = { width: 64, height: 32 };
    this.pixel = { width: pixelWidth, height: pixelHeight };
    this.context = displayDomContainer.getContext("2d");
    this.states = [];
    this.setup();
  }

  draw(states) {
    let pixel = this.pixel;

    for (let x = 0; x < this.resolution.width; x++) {
      for (let y = 0; y < this.resolution.height; y++) {
        if (states[x][y]) {
          this.context.fillRect(x * pixel.width, y * pixel.height, pixel.width, pixel.height);
        } else {
          this.context.clearRect(x * pixel.width, y * pixel.height, pixel.width, pixel.height);
        }
      }
    }

    this.states = states;
  }

  current() {
    return this.states;
  }

  clear() {
    let states = [];

    for (let x = 0; x < this.resolution.width; x++) {
      states[x] = [];

      for (let y = 0; y < this.resolution.height; y++) {
        states[x][y] = false;
      }
    }

    this.draw(states);
  }

  setup() {
    this.context.fillStyle = "#FFFFFF";
  }
}

module.exports = Display;
