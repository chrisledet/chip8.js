"use strict";

let RomLoader = require("./rom_loader");
let System = require("./system");

let audioSource = require("../sounds/beep.wav");
var displaySource = document.getElementById("display");
var resumeSwitch = document.getElementById("resume");
var romFile = document.getElementById("rom-file");
var romSelector = document.getElementById("rom-selector");
var stopSwitch = document.getElementById("stop");

window.chip8vm = new System(displaySource, audioSource);

/* event handlers */
document.onkeydown = function(e) {
  var input = window.chip8vm.keybindings[e.keyCode] || 0;
  window.chip8vm.setInput(input);
};

resumeSwitch.onclick = function(){
  window.chip8vm.start();
};

romFile.onchange = function() {
  new RomLoader(this.files[0], function(rom){
    window.chip8vm.boot(rom);
  });
};

romSelector.onchange = function(e) {
  if (e.target.value === "Select ROM") { return; }
  var romName = e.target.value;

  fetch("./roms/" + romName)
    .then((r) => r.blob())
    .then(function(blob) {
      new RomLoader(blob, function(rom){
        window.chip8vm.boot(rom);
      });
    });
};

stopSwitch.onclick = function(){
  window.chip8vm.stop();
};
