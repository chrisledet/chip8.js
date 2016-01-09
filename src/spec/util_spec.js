"use strict";

var Util = require("./../js/util");

describe("Util", function(){
  describe("clockRateInMS()", function(){
    it("converts to time in ms", function(){
      expect(Util.clockRateInMS(250)).toEqual(4);
      expect(Util.clockRateInMS(500)).toEqual(2);
      expect(Util.clockRateInMS(1000)).toEqual(1);
    });
  });
});
