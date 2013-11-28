/* jshint node:true */


exports.setStabalization = function(flag, postCommandDelay) {
  var buffer = new Buffer(3);
  buffer.writeUInt8(0x03, 0);
  buffer.writeUInt8(flag, 1);
  buffer.writeUInt8(postCommandDelay, 2);
  return buffer;
};

exports.setHeading = function(heading, postCommandDelay) {
  var buffer = new Buffer(4);
  buffer.writeUInt8(0x04, 0);
  buffer.writeUInt16BE(heading, 1);
  buffer.writeUInt8(postCommandDelay, 3);
  return buffer;
};

exports.setRotationRate = function(rate) {
  var buffer = new Buffer(2);
  buffer.writeUInt8(0x13, 0);
  buffer.writeUInt8(rate, 1);
  return buffer;
};

exports.setHeading = function(heading, postCommandDelay) {
  var buffer = new Buffer(4);
  buffer.writeUInt8(0x04, 0);
  buffer.writeUInt16BE(heading, 1);
  buffer.writeUInt8(postCommandDelay, 3);
  return buffer;
};

exports.delay = function(delay) {
  var buffer = new Buffer(3);
  buffer.writeUInt8(0x0B, 0);
  buffer.writeUInt16BE(delay, 1);
  return buffer;
};

exports.setSystemDelay1 = function(delay) {
  var buffer = new Buffer(3);
  buffer.writeUInt8(0x01, 0);
  buffer.writeUInt16BE(delay, 1);
  return buffer;
};

exports.setSystemDelay2 = function(delay) {
  var buffer = new Buffer(3);
  buffer.writeUInt8(0x02, 0);
  buffer.writeUInt16BE(delay, 1);
  return buffer;
};

exports.setSystemSpeed1 = function(speed) {
  var buffer = new Buffer(3);
  buffer.writeUInt8(0x0F, 0);
  buffer.writeUInt16BE(speed, 1);
  return buffer;
};

exports.setSystemSpeed2 = function(speed) {
  var buffer = new Buffer(3);
  buffer.writeUInt8(0x10, 0);
  buffer.writeUInt16BE(speed, 1);
  return buffer;
};

exports.roll = function(speed, heading, postCommandDelay) {
  var buffer = new Buffer(5);
  buffer.writeUInt8(0x05, 0);
  buffer.writeUInt8(speed, 1);
  buffer.writeUInt16BE(heading, 2);
  buffer.writeUInt8(postCommandDelay, 4);
  return buffer;
};

exports.roll2 = function(speed, heading, delay) {
  var buffer = new Buffer(6);
  buffer.writeUInt8(0x05, 0);
  buffer.writeUInt8(speed, 1);
  buffer.writeUInt16BE(heading, 2);
  buffer.writeUInt16BE(delay, 4);
  return buffer;
};

exports.setSpeed = function(speed, delay) {
  var buffer = new Buffer(3);
  buffer.writeUInt8(0x25, 0);
  buffer.writeUInt8(speed, 1);
  buffer.writeUInt8(delay, 2);
  return buffer;
};

/* TODO : Check this, docs have heading before speed, but other commands are speed before heading */
exports.rollWithSystemDelay1 = function(heading, speed) {
  var buffer = new Buffer(4);
  buffer.writeUInt8(0x06, 0);
  buffer.writeUInt16BE(heading, 1);
  buffer.writeUInt8(speed, 2);
  return buffer;
};

exports.rollAtSystemSpeed1 = function(heading) {
  var buffer = new Buffer(3);
  buffer.writeUInt8(0x11, 0);
  buffer.writeUInt16BE(heading, 1);
  return buffer;
};

exports.rollAtSystemSpeed2 = function(heading) {
  var buffer = new Buffer(3);
  buffer.writeUInt8(0x12, 0);
  buffer.writeUInt16BE(heading, 1);
  return buffer;
};

exports.sendRawMotorCommands = function(leftMode, leftPower, rightMode, rightPower, postCommandDelay) {
  var buffer = new Buffer(6);
  buffer.writeUInt8(0x0A, 0);
  buffer.writeUInt8(leftMode, 1);
  buffer.writeUInt8(leftPower, 2);
  buffer.writeUInt8(rightMode, 3);
  buffer.writeUInt8(rightPower, 4);
  buffer.writeUInt8(postCommandDelay, 5);
  return buffer;
};

exports.rotateOverTime = function(angle, time) {
  var buffer = new Buffer(5);
  buffer.writeUInt8(0x1A, 0);
  buffer.writeInt16BE(angle, 1);
  buffer.writeUInt16BE(time, 3);
  return buffer;
};

exports.rotateOverSystemDelay1 = function(angle) {
  var buffer = new Buffer(3);
  buffer.writeUInt8(0x21, 0);
  buffer.writeInt16BE(angle, 1);
  return buffer;
};

exports.rotateOverSystemDelay2 = function(angle) {
  var buffer = new Buffer(3);
  buffer.writeUInt8(0x22, 0);
  buffer.writeInt16BE(angle, 1);
  return buffer;
};

exports.waitUntilStopped = function(time) {
  var buffer = new Buffer(3);
  buffer.writeUInt8(0x19, 0);
  buffer.writeUInt16BE(time, 1);
  return buffer;
};

exports.loopStart = function(count) {
  var buffer = new Buffer(2);
  buffer.writeUInt8(0x1E, 0);
  buffer.writeUInt8(count, 1);
  return buffer;
};

/* TODO : Find out more, don't remember seeing any reference to a system loop count anywhere else */
exports.loopStartSystem = function() {
  var buffer = new Buffer(1);
  buffer.writeUInt8(0x24, 0);
  return buffer;
};

exports.loopEnd = function() {
  var buffer = new Buffer(1);
  buffer.writeUInt8(0x1F, 0);
  return buffer;
};

exports.comment = function(message) {
  var buffer = new Buffer(message.length+3);
  buffer.writeUInt8(0x20, 0);
  buffer.writeUInt16BE(message.length, 1);
  buffer.write(message, 3);
  return buffer;
};

exports.setRGB = function(color, postCommandDelay) {
  var buffer = new Buffer(5);
  buffer.writeUInt8(0x07, 0);
  buffer.writeUInt8((color >> 16) & 0xFF, 1);
  buffer.writeUInt8((color >> 8) & 0xFF, 2);
  buffer.writeUInt8(color & 0xFF, 3);
  buffer.writeUInt8(postCommandDelay, 4);
  return buffer;
};

exports.setRGBWithSystemDelay2 = function(color) {
  var buffer = new Buffer(4);
  buffer.writeUInt8(0x08, 0);
  buffer.writeUInt8((color >> 16) & 0xFF, 1);
  buffer.writeUInt8((color >> 8) & 0xFF, 2);
  buffer.writeUInt8(color & 0xFF, 3);
  return buffer;
};

exports.fadeToLEDOverTime = function(color, time) {
  var buffer = new Buffer(6);
  buffer.writeUInt8(0x08, 0);
  buffer.writeUInt8((color >> 16) & 0xFF, 1);
  buffer.writeUInt8((color >> 8) & 0xFF, 2);
  buffer.writeUInt8(color & 0xFF, 3);
  buffer.writeUInt16BE(time, 4);
  return buffer;
};

exports.setBackLED = function(intensity, postCommandDelay) {
  var buffer = new Buffer(3);
  buffer.writeUInt8(0x09, 0);
  buffer.writeUInt8(intensity, 1);
  buffer.writeUInt8(postCommandDelay, 2);
  return buffer;
};

exports.goto = function(targetMacroId) {
  var buffer = new Buffer(2);
  buffer.writeUInt8(0x0C, 0);
  buffer.writeUInt8(targetMacroId, 1);
  return buffer;
};

exports.gosub = function(targetMacroId) {
  var buffer = new Buffer(2);
  buffer.writeUInt8(0x0D, 0);
  buffer.writeUInt8(targetMacroId, 1);
  return buffer;
};

exports.branchOnCollision = function(targetMacroId) {
  var buffer = new Buffer(2);
  buffer.writeUInt8(0x23, 0);
  buffer.writeUInt8(targetMacroId, 1);
  return buffer;
};

exports.configureCollisionDetection = function(method, thresholdX, speedX, thresholdY, speedY, deadTime) {
  var buffer = new Buffer(7);
  buffer.writeUInt8(0x27, 0);
  buffer.writeUInt8(method, 1);
  buffer.writeUInt8(thresholdX, 2);
  buffer.writeUInt8(speedX, 3);
  buffer.writeUInt8(thresholdY, 4);
  buffer.writeUInt8(speedY, 5);
  buffer.writeUInt8(deadTime, 6);
  return buffer;
};

exports.sleep = function(time) {
  var buffer = new Buffer(3);
  buffer.writeUInt8(0x0E, 0);
  buffer.writeUInt16BE(time, 1);
  return buffer;
};

exports.end = function() {
  var buffer = new Buffer(1);
  buffer.writeUInt8(0x00, 0);
  return buffer;
};

exports.streamEnd = function() {
  var buffer = new Buffer(1);
  buffer.writeUInt8(0x1B, 0);
  return buffer;
};

exports.emitMarker = function(value) {
  var buffer = new Buffer(2);
  buffer.writeUInt8(0x15, 0);
  buffer.writeUInt8(value, 1);
  return buffer;
};

