/* jshint node:true */

/*
 `spheroResponseParser` is a [node serialport](https://github.com/voodootikigod/node-serialport)
 compliant `parser`.
 */

var errors = require('./errors');
var calculateChecksum = require('./toolbelt').calculateChecksum;

//These offsets are constant for both types of packets.
var spheroPacketSOP1Offset = 0;
var spheroPacketSOP2Offset = 1;

//Response templates reflect the byte offset into the buffer. Packets can be created from these template

var spheroResponseTemplate = {
  SOP1: 0,
  SOP2: 1,
  MRSP: 2,
  SEQ:  3,
  DLEN: 4,
  DATA: 5,
  CHK:  5 //The checksum offset must be adjusted if DLEN > 1
};

var spheroAsynchronousTemplate = {
  SOP1:     0,
  SOP2:     1,
  ID_CODE:  2,
  DLEN:     3, //Two Bytes
  DATA:     5,
  CHK:      5 //The checksum offset must be adjusted if DLEN > 1
};

var spheroMinimumPacketSize = 6; //Smallest packet size is 6 bytes (simple acknowledgment packet)
var spheroHeaderLength = 5; //Both the response and async packets have 5 byte headers

//Each Sphero needs it's own parser to attach to the serial port
exports.spheroResponseParser = function spheroResponseParser() {

  var buffer = null;

  return function(anEmitter, aBuffer) {
    if (Buffer.isBuffer(buffer)) {
      buffer = Buffer.concat([buffer, aBuffer], buffer.length + aBuffer.length); //Explicitly pass the new buffer length because it is faster (according to the documentation)
    } else {
      buffer = new Buffer(aBuffer.length);
      aBuffer.copy(buffer);
    }


    function parseBuffer() {
      var packet = null;
      try {
        packet = scanForPacket(buffer);
        if (packet) {
          buffer = buffer.length > packet.length ? buffer.slice(packet.length) : null;
          if (packet instanceof Buffer) {
            anEmitter.emit('oob', packet);
          } else {
            anEmitter.emit('data', packet);
          }
        }
      } catch (error) {
        if (error instanceof errors.ChecksumError) {
          //This means we have a complete packet, but it is broken and needs to be dumped
          buffer = buffer.length > error.packetLength ? buffer.slice(error.packetLength) : null;
        }
        if (error instanceof errors.BadPacketError) {
          //Get rid of nonsense data.
          buffer = drainBuffer(buffer);
        }
        anEmitter.emit('error', error);
      }

    }

    parseBuffer();
  };
};

var parseAcknowledgment = exports._parseAcknowledgment = function(aBuffer) {
  var calculatedChecksum;
  var expectedPacketLength;
  var responsePacket;
  /*
    Minimum response packet length is 6
     SOP|SOP2|MRSP|SEQ|DLEN|<DATA>|CHK
   */
  if (aBuffer.length >= spheroMinimumPacketSize) { //Don't bother until we get a minimum sized packet
    responsePacket = Object.create(spheroResponseTemplate);
    responsePacket.SOP1 = aBuffer.readUInt8(spheroResponseTemplate.SOP1);
    responsePacket.SOP2 = aBuffer.readUInt8(spheroResponseTemplate.SOP2);
    responsePacket.MRSP = aBuffer.readUInt8(spheroResponseTemplate.MRSP);
    responsePacket.SEQ = aBuffer.readUInt8(spheroResponseTemplate.SEQ);
    responsePacket.DLEN = aBuffer.readUInt8(spheroResponseTemplate.DLEN); //Includes CHK byte
    responsePacket.DATA = new Buffer(responsePacket.DLEN - 1);
    //We have a minimum packet length, but if we can't get the CHK yet in case this packet is bigger than that
    expectedPacketLength = responsePacket.DLEN + spheroHeaderLength; //DLEN is the size of <DATA> + CHK so we need to include the header bytes
    if (aBuffer.length >= expectedPacketLength) { //Make sure there is enough data in the buffer to complete the packet
      //Ok, now we are sure we have the entire packet we can grab the CHK data
      responsePacket.CHK = aBuffer.readUInt8(spheroResponseTemplate.DATA + responsePacket.DLEN - 1);
      calculatedChecksum = calculateChecksum(aBuffer.slice(spheroResponseTemplate.MRSP, spheroResponseTemplate.CHK + responsePacket.DLEN - 1));
      if (calculatedChecksum === responsePacket.CHK) {
        //Good packet
        aBuffer.copy(responsePacket.DATA, 0, spheroResponseTemplate.DATA);
      } else { //Checksum didn't make it
        throw new errors.ChecksumError(null, expectedPacketLength);
      }
      return responsePacket;
    }
  }
  return null;
};

var parseAsynchronousMessage = exports._parseAsynchronousMessage = function(aBuffer) {
  var calculatedChecksum;
  var expectedPacketLength;
  var responsePacket;
  /*
   Minimum aync message length is 6
   SOP1|SOP2|ID_CODE|DLEN_MSB|DLEN_LSB|<DATA>|CHK
   */
  if (aBuffer.length >= spheroMinimumPacketSize) { //Don't bother until we get a minimum sized packet
    responsePacket = Object.create(spheroAsynchronousTemplate);
    responsePacket.SOP1 = aBuffer.readUInt8(spheroAsynchronousTemplate.SOP1);
    responsePacket.SOP2 = aBuffer.readUInt8(spheroAsynchronousTemplate.SOP2);
    responsePacket.ID_CODE = aBuffer.readUInt8(spheroAsynchronousTemplate.ID_CODE);
    responsePacket.DLEN = aBuffer.readUInt16BE(spheroAsynchronousTemplate.DLEN); //Includes CHK byte
    responsePacket.DATA = new Buffer(responsePacket.DLEN - 1);
    //We have a minimum packet length, but if we can't get the CHK yet in case this packet is bigger than that
    expectedPacketLength = responsePacket.DLEN + spheroHeaderLength; //DLEN is the size of <DATA> + CHK so we need to include the header bytes
    if (aBuffer.length >= expectedPacketLength) { //Make sure there is enough data in the buffer to complete the packet
      //Ok, now we are sure we have the entire packet we can grab the CHK data
      responsePacket.CHK = aBuffer.readUInt8(spheroAsynchronousTemplate.DATA + responsePacket.DLEN - 1);
      calculatedChecksum = calculateChecksum(aBuffer.slice(spheroAsynchronousTemplate.ID_CODE, spheroAsynchronousTemplate.CHK + responsePacket.DLEN - 1));
      if (calculatedChecksum === responsePacket.CHK) {
        //Good packet
        aBuffer.copy(responsePacket.DATA, 0, spheroAsynchronousTemplate.DATA);
      } else { //Checksum didn't make it
        throw new errors.ChecksumError(null, expectedPacketLength);
      }
      return responsePacket;
    }
  }
  return null;
};

var scanForPacket = exports._scanForPacket = function(aBuffer) {
  if (!aBuffer || aBuffer.length < spheroMinimumPacketSize) { //smallest packet is 6 bytes (simple acknowledge response)
    return null;
  }

  if (aBuffer[spheroPacketSOP1Offset] === 0xFF) { //Valid Start Of Packet 1 (SOP1)

    if (aBuffer[spheroPacketSOP2Offset] === 0xFF) { //Valid acknowledgement Start Of Packet 2 (SOP2)
      return parseAcknowledgment(aBuffer);
    } else if (aBuffer[spheroPacketSOP2Offset] === 0xFE) { //Valid asynchronous message Start Of Packet 2 (SOP2)
      return parseAsynchronousMessage(aBuffer);
    }

  }

  //Something wrong with SOP1 or SOP2 at the start of our buffer means the data is corrupt or it's a
  //weird OOB message, like from hack mode or a response from level 1 diagnostics
  return parseOOBData(aBuffer);

};

var parseOOBData = function(aBuffer) {
  var searchable = Array.prototype.slice.apply(aBuffer);
  var searchIndex = searchable.indexOf(0xFF);
  if (searchIndex === -1) {
    return aBuffer;
  } else {
    return aBuffer.slice(searchIndex);
  }
};

var drainBuffer = exports._drainBuffer = function(aBuffer) {
  try {
    var searchable = Array.prototype.slice.apply(aBuffer);
    var searchIndex = searchable.indexOf(0xFF);
    if (searchIndex === -1) {
      return null;
    } else {
      return aBuffer.slice(searchIndex);
    }
  } catch (e) {
    return null;
  }
};
