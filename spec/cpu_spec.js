"use strict";

var CPU = require('./../js/cpu');

describe("CPU", function(){
  let cpu;
  let display = {
    draw: function(){},
    clear: function(){}
  };

  beforeEach(function(){
    cpu = new CPU(display);
  });

  describe("opscodes", function() {
    describe("Executing 1NNN", function(){
      let rom;

      beforeEach(function(){
        rom = [0x11, 0x11];
        cpu.loadRom(rom);
      });

      it("changed pc to 0x111", function(){
        cpu.step();
        expect(cpu.pc).toEqual(0x111);
      });
    });

    describe("Executing 2NNN", function(){
      let rom;

      beforeEach(function(){
        rom = [0x21, 0x2F];
        cpu.loadRom(rom);
      });

      it("changed pc to 0x12F", function(){
        cpu.step();
        expect(cpu.pc).toEqual(0x12F);
      });

      it("pop old pc to stack", function(){
        cpu.step();
        expect(cpu.stack[0]).toEqual(0x200);
      });
    });

    describe("Executing 3XNN", function(){
      describe("when V0 is set to 0x20", function(){
        let rom;

        beforeEach(function(){
          rom = [0x60, 0x22, 0x30, 0x22];
          cpu.loadRom(rom);
          cpu.step();
        });

        it("skips next instruction", function(){
          cpu.step();
          expect(cpu.pc).toEqual(0x206);
        });
      });

      describe("when V0 is still 0x0", function(){
        let rom;

        beforeEach(function(){
          rom = [0x61, 0x22, 0x30, 0x22];
          cpu.loadRom(rom);
          cpu.step();
        });

        it("does not skips next instruction", function(){
          cpu.step();
          expect(cpu.pc).toEqual(0x204);
        });
      });
    });

    // 4XNN  Skips the next instruction if VX doesn't equal NN.
    describe("Executing 4XNN", function(){
      describe("when V1 is not 0x22", function(){
        let rom;

        beforeEach(function(){
          rom = [0x61, 0xF1, 0x41, 0x22];
          cpu.loadRom(rom);
          cpu.step();
        });

        it("skips next instruction", function(){
          cpu.step();
          expect(cpu.pc).toEqual(0x206);
        });
      });

      describe("when V1 is 0x22", function(){
        let rom;

        beforeEach(function(){
          rom = [0x61, 0x22, 0x41, 0x22];
          cpu.loadRom(rom);
          cpu.step();
        });

        it("does not skip next instruction", function(){
          cpu.step();
          expect(cpu.pc).toEqual(0x204);
        });
      });
    });

    // 5XY0  Skips the next instruction if VX equals VY.
    describe("Executing 5XY0", function(){
      describe("when V0 is 0xFF and V1 is 0xFF", function(){
        let rom;

        beforeEach(function(){
          rom = [0x60, 0xFF, 0x61, 0xFF, 0x50, 0x10];
          cpu.loadRom(rom);
          cpu.step();
          cpu.step();
        });

        it("skips next instruction", function(){
          cpu.step();
          expect(cpu.pc).toEqual(0x208);
        });
      });

      describe("when V0 is 0x0 and V1 is 0x0", function(){
        let rom;

        beforeEach(function(){
          rom = [0x60, 0x1, 0x50, 0x10];
          cpu.loadRom(rom);
          cpu.step();
        });

        it("does not skip next instruction", function(){
          cpu.step();
          expect(cpu.pc).toEqual(0x204);
        });
      });
    });

    describe("Executing 6XNN", function(){
      let rom;

      beforeEach(function(){
        rom = [0x60, 0x22];
        cpu.loadRom(rom);
      });

      it("changed V0 to 0x22", function(){
        cpu.step();
        expect(cpu.v[0]).toEqual(0x22);
      });
    });

    describe("Executing 7XNN", function(){
      let rom;

      beforeEach(function(){
        rom = [0x60, 0x01, 0x70, 0x22];
        cpu.loadRom(rom);
        cpu.step();
      });

      it("adds value to v0", function(){
        cpu.step();
        expect(cpu.v[0]).toEqual(0x23);
      });

      describe("handling overflows", function(){
        let rom;

        beforeEach(function(){
          rom = [0x60, 0xF0, 0x70, 0x11];
          cpu.loadRom(rom);
          cpu.step();
        });

        it("overflows to 0x1", function(){
          cpu.step();
          expect(cpu.v[0]).toEqual(0x1);
        });
      });
    });

    describe("Executing 8XY0", function(){
      let rom;

      beforeEach(function(){
        rom = [0x61, 0xFF, 0x80, 0x10];
        cpu.loadRom(rom);
        cpu.step();
      });

      it("set V0 to value from V1", function(){
        cpu.step();
        expect(cpu.v[1]).toEqual(0xFF);
        expect(cpu.v[0]).toEqual(cpu.v[1]);
      });
    });

    describe("Executing 8XY1", function(){
      let rom;

      beforeEach(function(){
        rom = [0x60, 0xF0, 0x61, 0x0F, 0x80, 0x11];
        cpu.loadRom(rom);
        cpu.step();
        cpu.step();
      });

      it("set V0 to equal V0 OR V1", function(){
        cpu.step();
        expect(cpu.v[0]).toEqual(0xFF);
      });
    });

    describe("Executing 8XY2", function(){
      let rom;

      beforeEach(function(){
        rom = [0x60, 0xF0, 0x61, 0x0F, 0x80, 0x12];
        cpu.loadRom(rom);
        cpu.step();
        cpu.step();
      });

      it("set V0 to equal V0 AND V1", function(){
        cpu.step();
        expect(cpu.v[0]).toEqual(0x0);
      });
    });

    describe("Executing 8XY3", function(){
      let rom;

      beforeEach(function(){
        rom = [0x60, 0xF0, 0x61, 0x0F, 0x80, 0x13];
        cpu.loadRom(rom);
        cpu.step();
        cpu.step();
      });

      it("set V0 to equal V0 XOR V1", function(){
        cpu.step();
        expect(cpu.v[0]).toEqual(0x1);
      });
    });
  });
});
