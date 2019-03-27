import CPU from "./CPU.js";
import Display from "./Display.js";

export default class System {
  constructor(displaySource, audioSource) {
    const display = new Display(displaySource);
    const audio = audioSource ? new Audio(audioSource) : null;

    this.clockRate = 250;
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

    this._pid = window.setInterval(() => {
      this._cpu.step();
    }, 1000/this.clockRate);
  }

  stop() {
    if (!this._pid) { return; }

    window.clearInterval(this._pid);
    this._pid = null;
  }

  reset() {
    this.stop();
    this._cpu.reset();
  }

  setInput(input) {
    this._cpu.setInput(input);
  }
}

