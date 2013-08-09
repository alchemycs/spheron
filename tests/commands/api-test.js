/* jshint node:true */
/* global describe,it */

var api = require('../../lib/commands/api');

var apiDID = 0x02;
var assertHeader = function(packet, CID) {
  packet[0].should.eql(0xff, 'SOP1 should always be 0xff');
  packet[2].should.eql(apiDID, 'API commands should always have a DID of 0x02');
  packet[3].should.eql(CID, 'CID not as expected');
};

describe('commands.api', function() {
  describe('#setHeading()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setHeading(280);
      assertHeader(packet, 0x01);
      packet.length.should.eql(9);
    });
  });
  describe('#setStabalisation()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setStabalisation(true);
      assertHeader(packet, 0x02);
      packet.length.should.eql(8);
    });
  });
  describe('#setRotationRate()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setRotationRate(1);
      assertHeader(packet, 0x03);
      packet.length.should.eql(8);
    });
  });
  describe('#setApplicationConfigurationBlock()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setApplicationConfigurationBlock(new Buffer(0x20));
      assertHeader(packet, 0x04);
      packet.length.should.eql(0x27);
    });
  });
  describe('#getApplicationConfigurationBlock()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.getApplicationConfigurationBlock();
      assertHeader(packet, 0x05);
      packet.length.should.eql(0x7);
    });
  });
  describe('#getChassisID()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.getChassisID();
      assertHeader(packet, 0x07);
      packet.length.should.eql(0x7);
    });
  });
  describe('#_setChassisID()', function() {
    it('should have correct CID/DID', function() {
      var packet = api._setChassisID(0);
      assertHeader(packet, 0x08);
      packet.length.should.eql(0x9);
    });
  });
  describe('#selfLevel()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.selfLevel(1,2,3,4);
      assertHeader(packet, 0x09);
      packet.length.should.eql(0x0B);
    });
  });
  describe('#setDataStreaming()', function() {
    describe('without optional MASK2 field', function() {
      it('should have correct CID/DID', function() {
        var packet = api.setDataStreaming(1, 2, 3, 4);
        assertHeader(packet, 0x11);
        packet.length.should.eql(0x10);
      });
    });
    describe('with optional MASK2 field', function() {
      it('should have correct CID/DID', function() {
        var packet = api.setDataStreaming(1, 2, 3, 4, 5);
        assertHeader(packet, 0x11);
        packet.length.should.eql(0x14);
      });
    });
  });
  describe('#configureCollisionDetection()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.configureCollisionDetection(1, 2, 3, 4, 5, 6);
      assertHeader(packet, 0x12);
      packet.length.should.eql(0x0D);
    });
  });
  describe('#configureLocator()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.configureLocator(1, 2, 3, 4);
      assertHeader(packet, 0x13);
      packet.length.should.eql(0x0E);
    });
  });
  describe('#setAccelerometerRange()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setAccelerometerRange(1);
      assertHeader(packet, 0x14);
      packet.length.should.eql(8);
    });
  });
  describe('#readLocator()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.readLocator();
      assertHeader(packet, 0x15);
      packet.length.should.eql(7);
    });
  });
  describe('#setRGB()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setRGB(0xAABBCC, false);
      assertHeader(packet, 0x20);
      packet.length.should.eql(0x0B);
    });
  });
  describe('#setBackLED()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setBackLED(128);
      assertHeader(packet, 0x21);
      packet.length.should.eql(0x08);
    });
  });
  describe('#getRGB()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.getRGB();
      assertHeader(packet, 0x22);
      packet.length.should.eql(0x07);
    });
  });
  describe('#roll()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.roll(128, 180, 1);
      assertHeader(packet, 0x30);
      packet.length.should.eql(0x0B);
    });
  });
  describe('#setBoostWithTime()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setBoostWithTime(1, 90);
      assertHeader(packet, 0x31);
      packet.length.should.eql(0x0A);
    });
  });
  describe('#setRawMotorValues()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setRawMotorValues(1, 2, 3, 4);
      assertHeader(packet, 0x33);
      packet.length.should.eql(0x0B);
    });
  });
  describe('#setMotionTimeout()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setMotionTimeout(2);
      assertHeader(packet, 0x34);
      packet.length.should.eql(0x09);
    });
  });
  describe('#setPermanentOptionFlags()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setPermanentOptionFlags(23);
      assertHeader(packet, 0x35);
      packet.length.should.eql(0x0B);
    });
  });
  describe('#getPermanentOptionFlags()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.getPermanentOptionFlags();
      assertHeader(packet, 0x36);
      packet.length.should.eql(0x07);
    });
  });
  describe('#setTemporaryOptionFlags()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setTemporaryOptionFlags(12);
      assertHeader(packet, 0x37);
      packet.length.should.eql(0x0B);
    });
  });
  describe('#getTemporaryOptionFlags()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.getTemporaryOptionFlags();
      assertHeader(packet, 0x38);
      packet.length.should.eql(0x07);
    });
  });
  describe('#getConfigurationBlock()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.getConfigurationBlock(1);
      assertHeader(packet, 0x40);
      packet.length.should.eql(0x08);
    });
  });
  describe('#setDeviceMode()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setDeviceMode(1);
      assertHeader(packet, 0x42);
      packet.length.should.eql(0x08);
    });
  });
  describe('#setConfigurationBlock()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setConfigurationBlock(new Buffer(254));
      assertHeader(packet, 0x43);
      packet.length.should.eql(261);
    });
  });
  describe('#getDeviceMode()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.getDeviceMode();
      assertHeader(packet, 0x44);
      packet.length.should.eql(0x07);
    });
  });
  describe('#runMacro()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.runMacro(1);
      assertHeader(packet, 0x50);
      packet.length.should.eql(0x08);
    });
  });
  describe('#saveTemporaryMacro()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.saveTemporaryMacro(new Buffer(254));
      assertHeader(packet, 0x51);
      packet.length.should.eql(261);
    });
  });
  describe('#saveMacro()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.saveMacro(new Buffer(254));
      assertHeader(packet, 0x52);
      packet.length.should.eql(261);
    });
  });
  describe('#reInitializeMacroExecutive()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.reInitializeMacroExecutive();
      assertHeader(packet, 0x54);
      packet.length.should.eql(0x07);
    });
  });
  describe('#abortMacro()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.abortMacro();
      assertHeader(packet, 0x55);
      packet.length.should.eql(0x07);
    });
  });
  describe('#getMacroStatus()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.getMacroStatus();
      assertHeader(packet, 0x56);
      packet.length.should.eql(0x07);
    });
  });
  describe('#setMacroParameter()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.setMacroParameter(1, 2, 3);
      assertHeader(packet, 0x57);
      packet.length.should.eql(0x0A);
    });
  });
  describe('#appendMacroChunk()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.appendMacroChunck(new Buffer(254));
      assertHeader(packet, 0x58);
      packet.length.should.eql(261);
    });
  });
  describe('#eraseOrbBasicStorage()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.eraseOrbBasicStorage(1);
      assertHeader(packet, 0x60);
      packet.length.should.eql(0x08);
    });
  });
  describe('#appendOrbBasicFragment()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.appendOrbBasicFragment(1, new Buffer(253));
      assertHeader(packet, 0x61);
      packet.length.should.eql(261);
    });
  });
  describe('#executeOrbBasicProgram()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.executeOrbBasicProgram(1, 2);
      assertHeader(packet, 0x62);
      packet.length.should.eql(0x0A);
    });
  });
  describe('#abortOrbBasicProgram()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.abortOrbBasicProgram();
      assertHeader(packet, 0x63);
      packet.length.should.eql(0x07);
    });
  });
  describe('#submitValueToInputStatement()', function() {
    it('should have correct CID/DID', function() {
      var packet = api.submitValueToInputStatement(2);
      assertHeader(packet, 0x64);
      packet.length.should.eql(0x0B);
    });
  });
});