export default class Util {
  static byteToSwitch(b) {
    let s = [
      (b & 0x80) == 0x80,
      (b & 0x40) == 0x40,
      (b & 0x20) == 0x20,
      (b & 0x10) == 0x10,
      (b & 0x08) == 0x08,
      (b & 0x04) == 0x04,
      (b & 0x02) == 0x02,
      (b & 0x01) == 0x01
    ];

    return s;
  }

  static rnd() {
    return Math.floor(Math.random() * (0xFF - 0x0)) + 0x0;
  }

  static clockRateInMS(clockRate) {
    clockRate = parseInt(clockRate, 10);
    if (clockRate < 1) { clockRate = 1; }
    return 1000/clockRate;
  }
}
