"use strict";

let CPU = require("./cpu");
let Display = require("./display");
let RomLoader = require("./rom_loader");
let audioSource = require("../sounds/beep.wav");

var romFile = document.getElementById("rom-file");
var debugToggle = document.getElementById("debug-toggle");
var resumeSwitch = document.getElementById("resume");
var stopSwitch = document.getElementById("stop");
var displayDomContainer = document.getElementById("display");

var cpu;
var pid;
var frequency = 16;

window.keybindings = {
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

debugToggle.onclick = function() {
  if (!cpu) { return; }

  cpu.debugMode = !cpu.debugMode;
};

stopSwitch.onclick = function() {
  if (!pid) { return; }

  window.clearInterval(pid);
  pid = null;
};

resumeSwitch.onclick = function() {
  if (pid) { return; }

  pid = window.setInterval(cpu.step.bind(cpu), frequency);
};

romFile.onchange = function() {
  if (pid) { window.clearInterval(pid); }

  new RomLoader(this.files[0], function(rom){
    let display = new Display(displayDomContainer);
    let audio = new Audio(audioSource);

    cpu = new CPU(display, audio);
    cpu.loadRom(rom);

    pid = window.setInterval(cpu.step.bind(cpu), frequency);
  });
};

document.onkeydown = function(e) {
  if (!cpu) { return; }

  cpu.setInput(window.keybindings[e.keyCode] || 0);
};
