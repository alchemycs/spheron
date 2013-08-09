/* jshint node:true */
/* global describe,it,before,beforeEach */

var responseParser = require('../lib/response-parser');
var assert = require('assert');
var events = require('events');

describe('response-parser', function() {
  describe('#_drainBuffer()', function() {
    describe('with no valid SOP1 bytes', function() {
      it('should return null', function() {
        assert(responseParser._drainBuffer(new Buffer(0)) === null);
      });
    });
    describe('with a valid SOP1 byte', function() {
      var sampleBuffer = new Buffer([0x00, 0x23, 0xFF, 0x05]);
      var resultBuffer = responseParser._drainBuffer(sampleBuffer);
      it('should return a new buffer of the correct length', function() {
        assert(resultBuffer.length === 2);
      });
      it('should return a new buffer starting at the SOP1 offset', function() {
        assert(resultBuffer.readUInt8(0) === 0xFF, 'First byte is not a valid SOP1');
        assert(resultBuffer.readUInt8(1) === 0x05, 'First byte is SOP1 but following byte was not expected');
      });
    });
  });
  describe('#_scanForPacket()', function() {
    describe('with no buffer', function() {
      it('should return null', function() {
        assert(responseParser._scanForPacket(null) === null);
      });
    });
    describe('with a buffer less than 6 bytes', function() {
      it('should return null', function() {
        assert(responseParser._scanForPacket(new Buffer([0,0,0,0,0])) === null);
      });
    });
    describe('with a bad SOP1', function() {
      it('should return a Buffer', function() {
        return responseParser._scanForPacket(new Buffer([0,0,0,0,0,0]))
          .should.be.instanceOf(Buffer);
      });
    });
    describe('with a bad SOP2', function() {
      it('should return a Buffer', function() {
          responseParser._scanForPacket(new Buffer([0xFF, 0x00, 0x00, 0x00, 0x00, 0x00]))
            .should.be.instanceOf(Buffer);
      });
    });
    describe('with response packet', function() {
      describe('and a bad checksum', function() {
        it('should throw ChecksumError', function() {
          (function() {
            responseParser._scanForPacket(new Buffer([0xFF, 0xFF, 0x00, 0x00, 0x01, 0x23]));
          }).should.throw('ChecksumError');
        });
      });
      describe('and a good checksum', function() {
        it('should return an object', function() {
          responseParser._scanForPacket(new Buffer([0xFF, 0xFF, 0x00, 0x00, 0x02, 0x00, 0xFD]))
            .should.be.a('object');
        });
      });
      describe('having a packet length less than DLEN', function() {
        it('should return null', function() {
          assert(responseParser._scanForPacket(new Buffer([0xFF, 0xFF, 0x00, 0x00, 0x10, 0x00])) === null);
        });
      });
    });

    describe('with asynchronous message packet', function() {
      describe('and a bad checksum', function() {
        it('should throw ChecksumError', function() {
          (function() {
            responseParser._scanForPacket(new Buffer([0xFF, 0xFF, 0x00, 0x00, 0x01, 0x23]));
          }).should.throw('ChecksumError');
        });
      });
      describe('and a good checksum', function() {
        it('should return an object', function() {
          responseParser._scanForPacket(new Buffer([0xFF, 0xFF, 0x00, 0x00, 0x02, 0x00, 0xFD]))
            .should.be.a('object');
        });
      });
      describe('having a packet length less than DLEN', function() {
        it('should return null', function() {
          assert(responseParser._scanForPacket(new Buffer([0xFF, 0xFF, 0x00, 0x00, 0x10, 0x00])) === null);
        });
      });
    });
  });

  describe('#spheroResponseParser()', function() {
    var emitter;
    var spheroResponseParser;
    before(function() {
      emitter = new events.EventEmitter();
      spheroResponseParser = responseParser.spheroResponseParser();
    });
    beforeEach(function() {
      emitter.removeAllListeners('error');
      emitter.removeAllListeners('data');
      emitter.removeAllListeners('oob');
    });

    describe('expecting a response packet', function() {
      describe('with a bad packet', function() {
        it('should emit an oob event with a Buffer', function(done) {
          emitter.on('oob', function(packet) {
            packet.should.be.instanceOf(Buffer);
            done();
          });
          spheroResponseParser(emitter, new Buffer([0,0,0,0,0,0x23]));
        });
      });
      describe('with a bad checksum', function() {
        it('should emit an error event with a ChecksumError', function(done) {
          emitter.on('error', function(error) {
            error.message.should.equal('ChecksumError');
            done();
          });
          spheroResponseParser(emitter, new Buffer([0xFF, 0xFF, 0x01, 0x02, 0x02, 0x03, 0x23]));
        });
      });
      describe('with a good response packet', function() {
        it('should emit a data event with a data packet', function(done) {
          emitter.on('data', function(packet) {
            packet.should.be.a('object');
            packet.should.have.property('SOP1');
            packet.should.have.property('SOP2');
            packet.should.have.property('MRSP');
            packet.should.have.property('SEQ');
            packet.should.have.property('DLEN');
            packet.should.have.property('DATA');
            packet.should.have.property('CHK');
            done();
          });
          spheroResponseParser(emitter, new Buffer([0xFF, 0xFF, 0x00, 0x01, 0x01, 0xFD]));
        });
      });
    });

    describe('expecting an asynchronous packet', function() {
      describe('with a bad packet', function() {
        it('should emit an oob event with a Buffer', function(done) {
          emitter.on('oob', function(packet) {
            packet.should.be.instanceOf(Buffer);
            done();
          });
          spheroResponseParser(emitter, new Buffer([0,0,0,0,0,0x23]));
        });
      });
      describe('with a bad checksum', function() {
        it('should emit an error event with a ChecksumError', function(done) {
          emitter.on('error', function(error) {
            error.message.should.equal('ChecksumError');
            done();
          });
          spheroResponseParser(emitter, new Buffer([0xFF, 0xFE, 0x01, 0x00, 0x01, 0x00]));
        });
      });
      describe('with a good asynchronous packet', function() {
        it('should emit a data event with a data packet', function(done) {
          emitter.on('data', function(packet) {
            packet.should.be.a('object');
            packet.should.have.property('SOP1');
            packet.should.have.property('SOP2');
            packet.should.have.property('ID_CODE');
            packet.should.have.property('DLEN');
            packet.should.have.property('DATA');
            packet.should.have.property('CHK');
            done();
          });
          spheroResponseParser(emitter, new Buffer([0xFF, 0xFE, 0x00, 0x00, 0x02, 0x01, 0xFC]));
        });
      });
    });
  });
});
