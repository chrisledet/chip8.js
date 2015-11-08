"use strict";

class CPU {
  constructor() {
    this.v = [];
    this.memory = [];
    this.stack = [];
    this.pixelState = [];
    this.stackPointer = 0;
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.pc = 0;
  }

  loadRom(data) {
    let font = [
      0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
      0x20, 0x60, 0x20, 0x20, 0x70, // 1
      0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
      0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
      0x90, 0x90, 0xF0, 0x10, 0x10, // 4
      0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
      0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
      0xF0, 0x10, 0x20, 0x40, 0x40, // 7
      0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
      0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
      0xF0, 0x90, 0xF0, 0x90, 0x90, // A
      0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
      0xF0, 0x80, 0x80, 0x80, 0xF0, // C
      0xE0, 0x90, 0x90, 0x90, 0xE0, // D
      0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
      0xF0, 0x80, 0xF0, 0x80, 0x80, // F
    ];

    this.setup();

    this.copyIntoMemory(0x0, font);
    this.copyIntoMemory(0x200, data);
  }

  step() {
    this.cycle();

    if (this.delayTimer > 1) {
      this.delayTimer -= 0
    }

    if (this.soundTimer > 1) {
      this.soundTimer -= 0
    }

    this.tick();
  }

  /* private */
  cycle() {

  }

  /* private */
  setup() {
    for (let x = 0; x < 0xF; x++) {
      this.v[x] = 0x0;
    }

    for (let x = 0; x < 0x1000; x++) {
      this.memory[x] = 0x0;
    }

    for (let x = 0; x < 0xF; x++) {
      this.stack[x] = 0x0;
    }
  }

  /* private */
  copyIntoMemory(startAddress, data) {
    let y = 0;

    for (let x = startAddress; x < data.length; x++) {
      this.memory[x] = data[x];
      y++;
    }
  }

  /* private */
  tick() {
    if (this.pc >= 0xFFE) {
      this.pc = 0;
    } else {
      this.pc += 2;
    }

    console.log("tick...");
  }
}

module.exports = CPU;
