import CPU from "./CPU.js";
import Display from "./Display.js";
import Util from "./Util.js";

export default class System {
  constructor(displaySource, audioSource) {
    this.clockRate = 500;
    this.keybindings = {
      49: 0x1,  // 1
      50: 0x2,  // 2
      51: 0x3,  // 3
      52: 0x4,  // 4
      81: 0x5,  // Q
      87: 0x6,  // W
      69: 0x7,  // E
      82: 0x8,  // R
      65: 0x9,  // A
      83: 0xA,  // S
      68: 0xB,  // D
      70: 0xC,  // F
      90: 0xD,  // Z
      88: 0xE,  // X
      67: 0xF,  // C
      86: 0x10  // V
    };

    const display = new Display(displaySource);
    const audio = audioSource ? new Audio(audioSource) : null;

    this._pid = null;
    this._cpu = new CPU(display, audio);
  }

  boot(rom) {
    this.stop();

    this._cpu.reset();
    this._cpu.loadRom(rom);

    this.start();
  }

  start() {
    if (this._pid) { return; }
    let interval = Util.clockRateInMS(this.clockRate);
    this._pid = window.setInterval(this._cpu.step.bind(this._cpu), interval);
  }

  stop() {
    if (!this._pid) { return; }

    window.clearInterval(this._pid);
    this._pid = null;
  }

  setInput(input) {
    if (this._cpu) {
      this._cpu.setInput(input);
    }
  }
}

