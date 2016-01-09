"use strict";

let CPU = require("./cpu");
let Display = require("./display");
let RomLoader = require("./rom_loader");
let audioSource = require("../sounds/beep.wav");
let Util = require ("./util");

var romFile = document.getElementById("rom-file");
var debugToggle = document.getElementById("debug-toggle");
var resumeSwitch = document.getElementById("resume");
var stopSwitch = document.getElementById("stop");
var displayDomContainer = document.getElementById("display");

var cpu;
var pid;

window.chip8vm = {
  clockRate: 500,
  keybindings: {
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
  }
};

var start = function() {
  if (pid) { return; }
  var interval = Util.clockRateInMS(window.chip8vm.clockRate);
  pid = window.setInterval(cpu.step.bind(cpu), interval);
};

var stop = function() {
  if (!pid) { return; }

  window.clearInterval(pid);
  pid = null;
};

/* event handlers */
debugToggle.onclick = function() {
  if (!cpu) { return; }

  cpu.debugMode = !cpu.debugMode;
};

stopSwitch.onclick = stop;

resumeSwitch.onclick = start;

romFile.onchange = function() {
  stop();

  new RomLoader(this.files[0], function(rom){
    let display = new Display(displayDomContainer);
    let audio = new Audio(audioSource);

    cpu = new CPU(display, audio);
    cpu.loadRom(rom);

    start();
  });
};

document.onkeydown = function(e) {
  if (!cpu) { return; }

  var input = window.chip8vm.keybindings[e.keyCode] || 0;
  cpu.setInput(input);
};
