

var toolbelt = require('./toolbelt');

var minimumCommandPacketSize = 7; //Smallest command packets are 7 bytes long
var spheroCommandTemplate = {
  SOP1: 0,
  SOP2: 1,
  DID:  2,
  CID:  3,
  SEQ:  4,
  DLEN: 5, //Two Bytes
  DATA: 6,
  CHK:  6 //The checksum offset must be adjusted if DLEN > 1
};

/**
 *
 * @param packet.DID
 * @param packet.CID
 * @param packet.SEQ
 * @param packet.DATA
 * @returns {Buffer}
 */
exports.spheroCommandPacketBuilder = function(packet) {
  packet.DID = packet.DID || 0x00;
  packet.CID = packet.CID || 0x00;
  packet.SEQ = packet.SEQ || 0x00;
  packet.DATA = packet.DATA || new Buffer(0);
  packet.resetTimeout = packet.resetTimeout || false;
  packet.requestAcknowledgement = packet.requestAcknowledgement || false;
  var SOP2 = 0xFC | (packet.resetTimeout && 0x02) | (packet.requestAcknowledgement && 0x01);

  var buffer = new Buffer(packet.DATA.length + minimumCommandPacketSize);
  buffer.writeUInt8(0xff, spheroCommandTemplate.SOP1);
  buffer.writeUInt8(SOP2, spheroCommandTemplate.SOP2);
  buffer.writeUInt8(packet.DID, spheroCommandTemplate.DID);
  buffer.writeUInt8(packet.CID, spheroCommandTemplate.CID);
  buffer.writeUInt8(packet.SEQ, spheroCommandTemplate.SEQ);
  buffer.writeUInt8(packet.DATA.length+1, spheroCommandTemplate.DLEN);
  packet.DATA.copy(buffer, spheroCommandTemplate.DATA);
  var checksum = toolbelt.calculateChecksum(buffer.slice(spheroCommandTemplate.DID, minimumCommandPacketSize + packet.DATA.length - 1));
  buffer.writeUInt8(checksum, spheroCommandTemplate.CHK + packet.DATA.length);

  return buffer;

};