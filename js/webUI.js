"use strict";

var romFileUpload = document.getElementById("rom-file");
var debugToggle = document.getElementById("debug-toggle");
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
};

romFileUpload.onchange = function() {
  new RomLoader(this.files[0], function(romData){
    cpu = new CPU(
      new Display(displayDomContainer)
    );

    cpu.loadRom(romData);

    pid = window.setInterval(cpu.step.bind(cpu), 10);
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
}
