"use strict";

class RomLoader {
  constructor(romFile, callback) {
    let reader = new FileReader();
    let self = this;

    this.isLoaded = false;
    this.romData = [];

    reader.onload = function(e) {
      let buffer = e.target.result;
      let romData = new Uint8Array(buffer);

      callback(romData);
    }

    reader.readAsArrayBuffer(romFile);
  }

  setCallback(callback) {
    this.callback = callback;
  }
}
