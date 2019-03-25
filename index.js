import System from "./js/System.js";
import RomLoader from "./js/RomLoader.js";

const displaySource = document.getElementById("display");
const resumeSwitch = document.getElementById("resume");
const uploader = document.getElementById("rom-uploader");
const romSelector = document.getElementById("rom-selector");
const stopSwitch = document.getElementById("stop");
// TODO: figure out audio sources
// let audioSource from "../sounds/beep.wav";

const vm = new System(displaySource, null);

/* event handlers */
document.onkeydown = e => {
  const input = vm.keybindings[e.keyCode] || 0;
  console.log("input", input);
  vm.setInput(input);
};

resumeSwitch.onclick = () => {
  vm.start();
};

stopSwitch.onclick = () => {
  vm.stop();
};

uploader.onchange = (e) => {
  if (e.target.files.length < 1) { return; }
  const romFile = e.target.files[0];
  new RomLoader(romFile, (rom) => {
    vm.boot(rom);
  });
};

romSelector.onchange = (e)  => {
  if (e.target.value === "Select ROM") { return; }
  const romName = e.target.value;

  fetch("./roms/" + romName)
    .then(r => r.blob())
    .then((blob) => {
      new RomLoader(blob, (rom) => {
        vm.boot(rom);
      });
    });
};

window.chip8vm = vm;
