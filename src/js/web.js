"use strict";

let CPU = require("./cpu");
let Display = require("./display");
let RomLoader = require("./rom_loader");
let audioSource = require("../sounds/beep.wav");

var romFileUpload = document.getElementById("rom-file");
var debugToggle = document.getElementById("debug-toggle");
var resumeSwitch = document.getElementById("resume");
var stopSwitch = document.getElementById("stop");
var displayDomContainer = document.getElementById("display");

var cpu;
var pid;

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

  pid = window.setInterval(cpu.step.bind(cpu), 16);
};

romFileUpload.onchange = function() {
  new RomLoader(this.files[0], function(romData){
    let display = new Display(displayDomContainer);
    let audio = new Audio(audioSource);

    cpu = new CPU(display, audio);
    cpu.loadRom(romData);

    pid = window.setInterval(cpu.step.bind(cpu), 16);
  });
};

document.onkeydown = function(e) {
  if (!cpu) { return; }

  var key = e.keyCode - 48;
  var input = key;

  if (key > 9) {
    if (key == 33) {
      input = 0xA;
    } else if (key == 39) {
      input = 0xB;
    } else if (key == 21) {
      input = 0xC;
    } else if (key == 34) {
      input = 0xD;
    } else if (key == 36) {
      input = 0xE;
    } else if (key == 41) {
      input = 0xF;
    } else {
      return;
    }
  }

  cpu.setInput(input);
};
