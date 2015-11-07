"use strict";

class Display {
  constructor() {
    let pixelWidth = displayContainer.width / 64;
    let pixelHeight = displayContainer.height / 32;

    this.resolution = { width: 64, height: 32 };
    this.pixel = { width: pixelWidth, height: pixelHeight };
    this.context = displayContainer.getContext("2d");

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
  }

  setup() {
    this.context.fillStyle = "#FFFFFF";
  }
}
