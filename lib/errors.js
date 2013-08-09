/* jshint node:true */

var util = require('util');

var BadPacketError = exports.BadPacketError = function(msg, constr) {
  Error.captureStackTrace(this, constr || this);
  this.message = msg || 'BadPacketError';
};
util.inherits(BadPacketError, Error);
BadPacketError.prototype.name = 'BadPacketError';

var ChecksumError = exports.ChecksumError = function(msg, packetLength, constr) {
  Error.captureStackTrace(this, constr || this);
  this.message = msg || 'ChecksumError';
  this.packetLength = packetLength || 0;
};
util.inherits(ChecksumError, Error);
ChecksumError.prototype.name = 'ChecksumError';
