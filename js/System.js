import CPU from "./CPU.js";
import Display from "./Display.js";

export default class System {
  constructor(displaySource, audioSource) {
    const display = new Display(displaySource);
    const audio = audioSource ? new Audio(audioSource) : null;

    this.cpu = new CPU(display, audio);
    this.clockRate = 300;
    this.stepPid = null;
    this.timerPid = null;
  }

  boot(rom) {
    this.stop();
    this.cpu.loadRom(rom);
    this.start();
  }

  start() {
    if (this.stepPid || this.timerPid) {
      return;
    }

    this.stepPid = window.setInterval(() => {
      this.cpu.step();
    }, 1000/this.clockRate);

    this.timerPid = window.setInterval(() => {
      this.cpu.stepTimer();
    }, 1000/60); // delay and sound timers run at fixed 60Hz
  }

  stop() {
    if (this.stepPid) {
      window.clearInterval(this.stepPid);
    }
    if (this.timerPid) {
       window.clearInterval(this.timerPid);
    }

    this.stepPid = null;
    this.timerPid = null;
  }

  reset() {
    this.stop();
    this.cpu.reset();
  }

  setInput(input) {
    this.cpu.setInput(input);
  }
}

