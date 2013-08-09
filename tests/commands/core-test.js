/* jshint node:true */
/* global describe,it */

var core = require('../../lib/commands/core');

var coreDID = 0x00;
var assertHeader = function(packet, CID) {
  packet[0].should.eql(0xff, 'SOP1 should always be 0xff');
  packet[2].should.eql(coreDID, 'Core commands should always have a DID of 0x00');
  packet[3].should.eql(CID, 'CID not as expected');
};

describe('commands.core', function() {
  describe('#ping()', function() {
    var packet = core.ping();
    it('should have correct DID/CID', function() {
      assertHeader(packet, 0x01);
      packet.length.should.eql(0x07);
    });
  });
  describe('#getVersioning()', function() {
    var packet = core.getVersioning();
    it('should have correct DID/CID', function() {
      assertHeader(packet, 0x02);
      packet.length.should.eql(0x07);
    });
  });
  describe('#_controlUARTTxLine()', function() {
    var packet = core._controlUARTTxLine(false);
    it('should have correct DID/CID', function() {
      assertHeader(packet, 0x03);
      packet.length.should.eql(0x08);
    });
  });
  describe('#setDeviceName()', function() {
    var name = 'example device name';
    var packet = core.setDeviceName(name);
    it('should have correct DID/CID', function() {
      assertHeader(packet, 0x10);
      packet.length.should.eql(7+name.length);
    });
  });
  describe('#getBluetoothInfo()', function() {
    var packet = core.getBluetoothInfo();
    it('should have correct DID/CID', function() {
      assertHeader(packet, 0x11);
      packet.length.should.eql(0x07);
    });
  });
  describe('#setAutoReconnect()', function() {
    var packet = core.setAutoReconnect(true, 12);
    it('should have correct DID/CID', function() {
      assertHeader(packet, 0x12);
      packet.length.should.eql(0x09);
    });
  });
  describe('#getAutoReconnect()', function() {
    var packet = core.getAutoReconnect();
    it('should have correct DID/CID', function() {
      assertHeader(packet, 0x13);
      packet.length.should.eql(0x07);
    });
  });
  describe('#getPowerState()', function() {
    var packet = core.getPowerState();
    it('should have correct DID/CID', function() {
      assertHeader(packet, 0x20);
      packet.length.should.eql(0x07);
    });
  });
  describe('#setPowerNotification()', function() {
    var packet = core.setPowerNotification(true);
    it('should have correct DID/CID', function() {
      assertHeader(packet, 0x21);
      packet.length.should.eql(0x08);
    });
  });
  describe('#sleep()', function() {
    var packet = core.sleep(1,2,3);
    it('should have correct DID/CID', function() {
      assertHeader(packet, 0x22);
      packet.length.should.eql(0x0C);
    });
  });
  describe('#getVoltageTripPoints()', function() {
    var packet = core.getVoltageTripPoints();
    it('should have correct DID/CID', function() {
      assertHeader(packet, 0x23);
      packet.length.should.eql(0x07);
    });
  });
  describe('#setVoltageTripPoints()', function() {
    var packet = core._setVoltageTripPoints(6, 7);
    it('should have correct DID/CID', function() {
      assertHeader(packet, 0x24);
      packet.length.should.eql(0x0B);
    });
  });
  describe('#setInactivityTimeout()', function() {
    var packet = core.setInactivityTimeout(23);
    it('should have correct DID/CID', function() {
      assertHeader(packet, 0x25);
      packet.length.should.eql(0x09);
    });
  });
  describe('#jumpToBootloader()', function() {
    var packet = core._jumpToBootloader();
    it('should have correct DID/CID', function() {
      assertHeader(packet, 0x30);
      packet.length.should.eql(0x07);
    });
  });
});