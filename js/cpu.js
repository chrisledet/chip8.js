"use strict";

class CPU {
  constructor(display) {
    this.v = [];
    this.i = 0;
    this.memory = [];
    this.stack = [];
    this.pixelState = [];
    this.stackPointer = 0;
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.pc = 0;
    this.awaitInput = false;

    this.display = display;
    this.currentInput = 0x0;
    this.isReady = false;
    this.debugMode = false;
  }

  debug() {
    if (this.debugMode) {
      console.log(arguments);
    }
  }

  loadRom(data) {
    this.debug("Loading ROM");

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

  setInput(input) {
    this.currentInput = input;
  }

  step() {
    if (!this.isReady) { return; }
    if (this.awaitInput) { return; }

    this.cycle();

    if (this.delayTimer > 0) {
      this.delayTimer -= 0
    }

    if (this.soundTimer > 0) {
      this.soundTimer -= 0
    }

    this.tick();
  }

  /* private */
  cycle() {
    let self = this;
    let head = this.memory[this.pc];
    let tail = this.memory[this.pc+1];
    let ops = Math.floor(head / 0x10);
    let x = head & 0xF;
    let y = Math.floor(tail / 0x10);
    let nnn = (x * 0x100) + tail;
    let nn = tail;
    let n = tail & 0xF;

    this.debug("Executing 0x" + head.toString(16), "0x" + tail.toString(16));

    switch (ops) {
      case 0x0:
        switch(tail) {
          case 0xE0:
            this.debug("EXEC: Display cleared");
            this.display.clear();
            break;
          case 0xEE:
            // return from subroutine
            this.debug("EXEC: return from subroutine");
            this.pc = this.stack.pop();
            break;
        }
        break;
      case 0x1:
        // Jumps to address NNN.
        this.pc = nnn - 2; // -2 because pc is incremented after each
        break;
      case 0x2:
        this.debug("Call subroutine at",  nnn);
        this.stack.push(this.pc);
        this.pc = nnn - 2; // -2 because pc is incremented after each
        break;
      case 0x3:
        // Skips the next instruction if VX equals NN.
        this.debug("EXEC: SKIP IF VX == NN");
        if (this.v[x] == nn) {
          this.pc += 2;
        }
        break;
      case 0x4:
        // Skips the next instruction if VX doesn't equal NN.
        this.debug("EXEC: SKIP IF VX != NN");
        if (this.v[x] != nn) {
          this.pc += 2;
        }
        break;
      case 0x5:
        // Skips the next instruction if VX equals VY.
        if (this.v[x] == this.v[y]) {
          this.pc += 2;
        }
        break;
      case 0x6:
        // Sets VX to NN.
        this.v[x] = nn;
        break;
      case 0x7:
        // Adds NN to VX.
        let resultOf7XNN = this.v[x] + nn;
        if (resultOf7XNN > 0xFF) {
          this.v[x] = resultOf7XNN - 0x100;
        } else {
          this.v[x] = resultOf7XNN;
        }
        break;
      case 0x8:
        switch (n) {
          case 0x0:
            // Sets VX to the value of VY.
            this.v[x] = this.v[y];
            break;

          case 0x1:
            // Sets VX to VX or VY.
            this.v[x] = this.v[x] | this.v[y];
            break;

          case 0x2:
            // Sets VX to VX and VY.
            this.v[x] = this.v[x] & this.v[y];
            break;

          case 0x3:
            // Sets VX to VX xor VY.
            if (this.v[x] == this.v[y]) {
              this.v[x] = 0x0;
            } else {
              this.v[x] = 0x1;
            }
            break;

          case 0x4:
            // Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.
            var result = this.v[x] + this.v[y];

            if (result > 0xFF) {
              this.v[x] = result - 0x100;
              this.v[0xF] = 0x1;
            } else {
              this.v[x] = result;
              this.v[0xF] = 0x0;
            }

            break;
          case 0x5:
            // VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
            if (this.v[y] > this.v[x]) {
              this.v[x] = -(this.v[x] - this.v[y]);
              this.v[0xF] = 0x1;
            } else {
              this.v[x] -= this.v[y];
              this.v[0xF] = 0x0;
            }

            break;

          case 0x6:
            // Shifts VX right by one.
            // VF is set to the value of the least significant bit of VX before the shift.
            this.v[0xF] = this.v[x] & 0xF;
            this.v[x] = this.v[x] >> 1;
            break;

          case 0x7:
            // Sets VX to VY minus VX.
            // VF is set to 0 when there's a borrow, and 1 when there isn't.
            var result = this.v[y] - this.v[x];

            if (result < 0) {
              this.v[x] = -(result);
              this.v[0xF] = 0x0;
            } else {
              this.v[x] = result;
              this.v[0xF] = 0x1;
            }
            break;

          case 0xE:
            // Shifts VX left by one.
            // VF is set to the value of the most significant bit of VX before the shift.
            this.v[0xF] = this.v[x] / 10;
            this.v[x] = this.v[x] << 1;
            break;
        }
        break;
      case 0x9:
        // Skips the next instruction if VX doesn't equal VY.
        if (this.v[x] != this.v[y]) {
          this.pc += 2;
        }
        break;
      case 0xA:
        // Sets I to the address NNN.
        this.i = nnn;
        break;
      case 0xB:
        // Jumps to the address NNN plus V0.
        this.pc = (nnn + this.v[0x0]) - 2;
        break;
      case 0xC:
        // Sets VX to the result of a bitwise and operation on a random number and NN.
        this.v[x] = Util.rnd() & nn;
        break;
      case 0xD:
        // Draw a sprite at position VX, VY with N bytes of sprite data starting at the address stored in I
        // Set VF to 01 if any set pixels are changed to unset, and 00 otherwise
        let position = { x: this.v[x], y: this.v[y] };
        let newPixelStates = this.display.current();

        // N bytes of sprite data starting at the address stored in I
        for (var spriteIndex = 0; spriteIndex < n; spriteIndex++) {
          // what sprite are we looking for
          let sprite = this.memory[this.i + spriteIndex];
          // convert sprite opscode into switches
          let spritePixelStates = Util.byteToSwitch(sprite);

          // for the width of 8 pixels
          for (var spriteDrawingIndex = 0; spriteDrawingIndex < 8; spriteDrawingIndex++) {
            let drawPosition = {
              x: (position.x + spriteDrawingIndex),
              y: (position.y + spriteIndex)
            };

            if (drawPosition.x > 63) {
              drawPosition.x -= 64;
            }

            if (drawPosition.y > 31) {
              drawPosition.y -= 32;
            }

            newPixelStates[drawPosition.x][drawPosition.y] = spritePixelStates[spriteDrawingIndex];
          }
        }

        this.display.draw(newPixelStates);
        break;
      case 0xE:
        switch (tail) {
          case 0x9E:
            // Skips the next instruction if the key stored in VX is pressed.
            if (this.v[x] == this.currentInput) {
              this.pc += 2;
            }
            break;
          case 0xA1:
            // Skips the next instruction if the key stored in VX isn't pressed.
            if (this.v[x] != this.currentInput) {
              this.pc += 2;
            }
            break;
        }
        break;
      case 0xF:
        switch (tail) {
          case 0x07:
            // Sets VX to the value of the delay timer.
            this.v[x] = this.delayTimer;
            break;
          case 0x0A:
            // A key press is awaited, and then stored in VX.
            if (this.awaitInput) {
              this.v[x] = this.currentInput;
              this.awaitInput = false;
            } else {
              this.awaitInput = true;
            }
            break;
          case 0x15:
            // Set the delay timer to the value of register VX
            this.delayTimer = this.v[x];
            break;
          case 0x18:
            // Set the sound timer to the value of register VX
            this.soundTimer = this.v[x];
            break;
          case 0x1E:
            // Adds VX to I.
            this.i += this.v[x];
            break;
          case 0x29:
            // Sets I to the location of the sprite for the character in VX.
            this.i = this.v[x] * 5;
            break;
          case 0x33:
            //  When this instruction is executed by the interpreter, the value stored in register VX is converted to its decimal equivalent.
            // Because each register is only eight bits in length, there will be three decimal digits (including any leading zeros).
            // The most significant decimal digit is then stored in at the address found in I, the next in I + 1, and the least significant digit in I + 2.
            // These values might then be used along with the font utility to output a decimal number to the screen.
            // TODO!

            break;
          case 0x55:
            // Write V0 to VX to memory starting at address I.
            for (let c = 0; c < (x + 1); c++) {
              this.memory[this.i + c] = this.v[c];
            }
            break;
          case 0x65:
            // Set V0 to VX with values from memory starting at address I.
            for (let c = 0; c < (x + 1); c++) {
              this.v[c] = this.memory[this.i + c]; // maybe +1?
            }
            break;
        }
        break;
    }
  }

  /* private */
  setup() {
    for (let x = 0; x < 0xF; x++) {
      this.v[x] = 0x0;
    }

    for (let x = 0; x < 0x1000; x++) {
      this.memory[x] = 0x0;
    }

    this.display.clear();

    this.pc = 0x200;
    this.isReady = true;
  }

  /* private */
  copyIntoMemory(startAddress, data) {
    for (let x = 0; x < data.length; x++) {
      this.debug("Loading ", data[x].toString(16), " in address " + (startAddress + x).toString(16));
      this.memory[startAddress + x] = data[x];
    }
  }

  /* private */
  tick() {
    if (this.pc >= 0xFFE) {
      this.debug("Finished...");
      this.pc = 0;
    } else {
      this.pc += 2;
    }
  }
}

module.exports = CPU;
