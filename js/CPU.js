const rnd = () => Math.floor(Math.random() * (0xFF - 0x0)) + 0x0;

const byteToSwitch = (b) => {
  return [
    (b & 0x80) == 0x80,
    (b & 0x40) == 0x40,
    (b & 0x20) == 0x20,
    (b & 0x10) == 0x10,
    (b & 0x08) == 0x08,
    (b & 0x04) == 0x04,
    (b & 0x02) == 0x02,
    (b & 0x01) == 0x01
  ];
}

export default class CPU {
  constructor(display, audio) {
    // cpu state
    this.v = [];
    this.i = 0;
    this.memory = [];
    this.stack = [];
    this.pixelState = [];
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.pc = 0;

    // emulator state
    this.audio = audio;
    this.display = display;
    this.font = [
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
      0xF0, 0x80, 0xF0, 0x80, 0x80  // F
    ];
    this.awaitInput = false;
    this.currentInput = 0x0;
    this.debugMode = false;
  }

  debug() {
    if (this.debugMode) {
      console.log(arguments);
    }
  }

  loadRom(data) {
    this.debug("Loading ROM");

    this.reset();

    this.copyIntoMemory(0x0, this.font);
    this.copyIntoMemory(0x200, data);
  }

  setInput(input) {
    this.currentInput = input;
  }

  step() {
    if (this.awaitInput) { return; }
    this.cycle();
    this.tick();
  }

  stepTimer() {
    if (this.delayTimer > 0) {
      this.delayTimer -= 1;
    }

    if (this.soundTimer > 0) {
      this.soundTimer -= 1;

      if (this.soundTimer == 0) {
        if (this.audio) this.audio.play();
      }
    }
  }

  reset() {
    for (let x = 0; x < 0xF; x++) {
      this.v[x] = 0x0;
    }

    for (let x = 0; x < 0x1000; x++) {
      this.memory[x] = 0x0;
    }

    this.display.clear();

    this.pc = 0x200;
  }

  /* private */
  cycle() {
    let head = this.memory[this.pc];
    let tail = this.memory[this.pc+1];
    let ops = Math.floor(head / 0x10);
    let x = head & 0xF;
    let y = Math.floor(tail / 0x10);
    let nnn = (x * 0x100) + tail;
    let nn = tail;
    let n = tail & 0xF;
    let result;

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
      this.pc = nnn - 2; // -2 because pc is incremented after each
      break;
    case 0x2:
      this.debug("Call subroutine at",  nnn);
      this.stack.push(this.pc);
      this.pc = nnn - 2; // -2 because pc is incremented after each
      break;
    case 0x3:
      this.debug("EXEC: SKIP IF VX == NN", nn);
      if (this.v[x] == nn) {
        this.pc += 2;
      }
      break;
    case 0x4:
      this.debug("EXEC: SKIP IF VX != NN", x, nn);
      if (this.v[x] != nn) {
        this.pc += 2;
      }
      break;
    case 0x5:
      this.debug("EXEC: SKIP IF VX == VY", x, y);
      if (this.v[x] == this.v[y]) {
        this.pc += 2;
      }
      break;
    case 0x6:
      this.debug("EXEC: SET VX TO NN", x, nn);
      this.v[x] = nn;
      break;
    case 0x7:
      this.debug("EXEC: ADD NN to VX ", nn, x);
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
        result = this.v[x] + this.v[y];

        if (result > 0xFF) {
          this.v[x] = result - 0x100;
          this.v[0xF] = 0x1;
        } else {
          this.v[x] = result;
          this.v[0xF] = 0x0;
        }

        break;
      case 0x5:
        result = this.v[x] - this.v[y];

        if (result < 0x0) {
          this.v[x] = result + 0x100;
          this.v[0xF] = 0x1;
        } else {
          this.v[x] = result;
          this.v[0xF] = 0x0;
        }

        break;
      case 0x6:
        this.v[0xF] = this.v[x] & 0xF;
        this.v[x] = this.v[x] >> 1;
        break;

      case 0x7:
        result = this.v[y] - this.v[x];

        if (result < 0) {
          this.v[x] = result + 0x100;
          this.v[0xF] = 0x0;
        } else {
          this.v[x] = result;
          this.v[0xF] = 0x1;
        }

        break;
      case 0xE:
        result = this.v[x] << 1;

        this.v[0xF] = Math.floor(this.v[x] / 0x10);

        if (result > 0xFF) {
          this.v[x] = result - 0x100;
        } else {
          this.v[x] = result;
        }

        break;
      }
      break;
    case 0x9:
      if (this.v[x] != this.v[y]) {
        this.pc += 2;
      }
      break;
    case 0xA:
      this.i = nnn;
      break;
    case 0xB:
      // Jumps to the address NNN plus V0.
      this.pc = (nnn + this.v[0x0]) - 2;
      break;
    case 0xC:
      // Sets VX to the result of a bitwise and operation on a random number and NN.
      this.v[x] = rnd() & nn;
      break;
    case 0xD:
      // Draw a sprite at position VX, VY with N bytes of sprite data starting at the address stored in I
      // Set VF to 01 if any set pixels are changed to unset, and 00 otherwise
      let position = { x: this.v[x], y: this.v[y] };
      let newPixelStates = this.display.current();

      // N bytes of sprite data starting at the address stored in I
      for (let spriteIndex = 0; spriteIndex < n; spriteIndex++) {
        // what sprite are we looking for
        let sprite = this.memory[this.i + spriteIndex];
        // convert sprite opscode into switches
        let spritePixelStates = byteToSwitch(sprite);

        this.v[0xF] = 0;

        // for the width of 8 pixels
        for (let spriteDrawingIndex = 0; spriteDrawingIndex < 8; spriteDrawingIndex++) {
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

          if (spritePixelStates[spriteDrawingIndex]) {
            let result = true;

            if (newPixelStates[drawPosition.x][drawPosition.y] == spritePixelStates[spriteDrawingIndex]) {
              result = false;
              this.v[0xF] = 0x1;
            }

            newPixelStates[drawPosition.x][drawPosition.y] = result;
          }
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
        // Skips the next instruction if the key stored in VX isn"t pressed.
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
        if (this.awaitInput) {
          this.v[x] = this.currentInput;
        }
        this.awaitInput = true;
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
