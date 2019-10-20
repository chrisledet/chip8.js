import System from "./js/System.js";

// gather all the DOM objects
const displaySource = document.getElementById("display");
const resumeSwitch = document.getElementById("resume");
const uploader = document.getElementById("rom-uploader");
const romSelector = document.getElementById("rom-selector");
const stopSwitch = document.getElementById("stop");
const keyButtons = document.getElementsByClassName("key");

Array.from(keyButtons).forEach(b => {
  b.onclick = (e) => {
    const input = Number(e.target.dataset.input);
    if (!isNaN(input)) vm.setInput(input);
  }
})


// set up virtual machine
// TODO: figure out audio sources
// let audioSource from "../sounds/beep.wav";
const vm = new System(displaySource, null);
const readROMFile = (file, callback) => {
  let reader = new FileReader();

  reader.onload = (e) => {
    let buffer = e.target.result;
    let romData = new Uint8Array(buffer);
    callback(romData);
  };

  reader.readAsArrayBuffer(file);
}

// set up DOM events and listeners
resumeSwitch.onclick = () => vm.start();
stopSwitch.onclick = () => vm.stop();

uploader.onchange = (e) => {
  if (e.target.files.length < 1) { return; }
  const romFile = e.target.files[0];
  readROMFile(romFile, (rom) => vm.boot(rom));
};

romSelector.onchange = (e) => {
  if (e.target.value === "Select ROM") { return; }
  const romName = e.target.value;

  fetch("./roms/" + romName)
    .then(r => r.blob())
    .then((blob) => {
      readROMFile(blob, (rom) => { vm.boot(rom); });
    });
};

window.chip8vm = vm;
