/* jshint node:true */
/* global describe,it,beforeEach */

var packetBuilder = require('../lib/packet-builder');
//var assert = require('assert');
//var events = require('events');

describe('packet-builder', function() {
  describe('#spheroCommandPacketBuilder()', function() {
    describe('with the SOP2 flags', function() {
      var command;
      beforeEach(function() {
        command = {
          CID: 0x00,
          DID: 0x01,
          SEQ: 0x02
        };
      });
      describe('absent', function() {
        it('should return 0xFC', function() {
          var packet = packetBuilder.spheroCommandPacketBuilder(command);
          packet.readUInt8(1).should.eql(0xFC);
        });
      });
      describe('having requestAcknowledgement only', function() {
        it('should return 0xFD', function() {
          command.requestAcknowledgement = true;
          var packet = packetBuilder.spheroCommandPacketBuilder(command);
          packet.readUInt8(1).should.eql(0xFD);
        });
      });
      describe('having resetTimeout only', function() {
        it('should return 0xFE', function() {
          command.resetTimeout = true;
          var packet = packetBuilder.spheroCommandPacketBuilder(command);
          packet.readUInt8(1).should.eql(0xFE);
        });
      });
      describe('having resetTimeout and requestAcknowledgement', function() {
        it('should return 0xFF', function() {
          command.resetTimeout = true;
          command.requestAcknowledgement = true;
          var packet = packetBuilder.spheroCommandPacketBuilder(command);
          packet.readUInt8(1).should.eql(0xFF);
        });
      });
    });
    describe('with a command containing no data', function() {
      var command = {
        CID: 0x00,
        DID: 0x01,
        SEQ: 0x02
      };
      var packet = packetBuilder.spheroCommandPacketBuilder(command);
      it('should return a buffer matching the details', function() {
        packet.should.be.an.instanceOf(Buffer);
        packet.length.should.eql(7, 'Command packet is not the correct length');
        packet.readUInt8(0).should.eql(0xFF); //SOP1 is always 0xFF
        packet.readUInt8(1).should.eql(0xFC); //SOP2 is 0xFC with no flags
        packet.readUInt8(2).should.eql(command.DID);
        packet.readUInt8(3).should.eql(command.CID);
        packet.readUInt8(4).should.eql(command.SEQ);
        packet.readUInt8(5).should.eql(1);
        packet.readUInt8(6).should.eql(0xFB);
      });
    });
    describe('with a command containing some data', function() {
      var command = {
        CID: 0x00,
        DID: 0x01,
        SEQ: 0x02,
        DATA: new Buffer([0x10, 0x12, 0x13])
      };
      var packet = packetBuilder.spheroCommandPacketBuilder(command);
      it('should return a buffer matching the details', function() {
        packet.should.be.an.instanceOf(Buffer);
        packet.length.should.eql(10, 'Command packet is not the correct length');
        packet.readUInt8(0).should.eql(0xFF); //SOP1 is always 0xFF
        packet.readUInt8(1).should.eql(0xFC); //SOP2 is 0xFC with no flags
        packet.readUInt8(2).should.eql(command.DID);
        packet.readUInt8(3).should.eql(command.CID);
        packet.readUInt8(4).should.eql(command.SEQ);
        packet.readUInt8(5).should.eql(4);
        packet.readUInt8(9).should.eql(0xC3);
      });
    });

  });
});
