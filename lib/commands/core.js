/* jshint node:true */

var packetBuilder = require('../packet-builder').spheroCommandPacketBuilder;
var _createPacket = require('../toolbelt').createPacket;

var DID = 0x00;

var createPacket = function(cid, options) {
  return _createPacket(DID, cid, options);
};

exports.ping = function(options) {
  var packet = createPacket(0x01, options);
  var result = packetBuilder(packet);
  return result;
};

exports.getVersioning = function(options) {
  var packet = createPacket(0x02, options);
  var result = packetBuilder(packet);
  return result;
};

exports._controlUARTTxLine = function(enable, options) {
  var packet = createPacket(0x03, options);
  packet.DATA = new Buffer([(enable ? 0x01 : 0x00)]);
  var result = packetBuilder(packet);
  return result;
};

exports.setDeviceName = function(deviceName, options) {
  var packet = createPacket(0x10, options);
  packet.DATA = new Buffer(deviceName);
  var result = packetBuilder(packet);
  return result;
};

exports.getBluetoothInfo = function(options) {
  var packet = createPacket(0x11, options);
  var result = packetBuilder(packet);
  return result;
};

exports.setAutoReconnect = function(enable, time, options) {
  var packet = createPacket(0x12, options);
  packet.DATA = Buffer(2);
  packet.DATA.writeUInt8((enable?0x01 : 0x00), 0);
  packet.DATA.writeUInt8(time, 1);
  var result = packetBuilder(packet);
  return result;
};

exports.getAutoReconnect = function(options) {
  var packet = createPacket(0x13, options);
  var result = packetBuilder(packet);
  return result;
};

exports.getPowerState = function(options) {
  var packet = createPacket(0x20, options);
  var result = packetBuilder(packet);
  return result;
};

exports.setPowerNotification = function(enable, options) {
  var packet = createPacket(0x21, options);
  packet.DATA = new Buffer(1);
  packet.DATA.writeUInt8( enable?0x01:0x00, 0 );
  var result = packetBuilder(packet);
  return result;
};

exports.sleep = function(wakeup, macro, orbBasic, options) {
  wakeup = wakeup || 0;
  macro = macro || 0;
  orbBasic = orbBasic || 0;
  var packet = createPacket(0x22, options);
  packet.DATA = Buffer(5);
  packet.DATA.writeUInt16BE(wakeup, 0);
  packet.DATA.writeUInt8(macro, 2);
  packet.DATA.writeUInt16BE(orbBasic, 3);
  var result = packetBuilder(packet);
  return result;
};

exports.getVoltageTripPoints = function(options) {
  var packet = createPacket(0x23, options);
  var result = packetBuilder(packet);
  return result;
};

exports._setVoltageTripPoints = function(lowVoltage, criticalVoltage, options) {
  var packet = createPacket(0x24, options);
  packet.DATA = new Buffer(4);
  packet.DATA.writeUInt16BE(lowVoltage, 0);
  packet.DATA.writeUInt16BE(criticalVoltage, 2);
  var result = packetBuilder(packet);
  return result;
};

exports.setInactivityTimeout = function(time, options) {
  var packet = createPacket(0x25, options);
  packet.DATA = new Buffer(2);
  packet.DATA.writeUInt16BE(time, 0);
  var result = packetBuilder(packet);
  return result;
};

exports._jumpToBootloader = function(options) {
  var packet = createPacket(0x30, options);
  var result = packetBuilder(packet);
  return result;
};

exports.performLevel1Diagnostics = function(options) {
  var packet = createPacket(0x40, options);
  var result = packetBuilder(packet);
  return result;
};

exports.performLevel2Diagnostics = function(options) {
  var packet = createPacket(0x41, options);
  var result = packetBuilder(packet);
  return result;
};

exports._clearCounters = function(options) {
  var packet = createPacket(0x42, options);
  var result = packetBuilder(packet);
  return result;
};

exports.assignTimeValue = function(time, options) {
  var packet = createPacket(0x23, options);
  packet.DATA = new Buffer(4);
  packet.DATA.writeUInt32BE(time, 0);
  var result = packetBuilder(packet);
  return result;
};

exports.pollPacketTimes = function(time, options) {
  var packet = createPacket(0x51, options);
  packet.DATA = new Buffer(4);
  packet.DATA.writeUInt32BE(time, 0);
  var result = packetBuilder(packet);
  return result;
};

exports._jumpToBootloader = function(options) {
  var packet = createPacket(0x30, options);
  var result = packetBuilder(packet);
  return result;
};
