/* jshint node:true */

var commands = require('./commands/macro');

var macro = exports.macro = function(id) {

  var _id;
  var _flags = 0;
  var _extendedFlags = 0; //Currently unused (changes for Sphero 2.0?)
  var macroCommands = [];
  var size = 0;
  var _macro = {};

  if (typeof(id) === 'undefined') {
    _id = 0xFF; //temporary macro
  } else {
    _id = id;
  }

  _macro.id = function(id) {
    if (typeof(id) === 'undefined') {
      return _id;
    } else {
      _id = id;
      return _macro;
    }
  };

  _macro.flags = function(flags) {
    if (typeof(id) === 'undefined') {
      return _flags;
    } else {
      _flags = flags;
      return _macro;
    }
  };

  _macro.extendedFlags = function(extendedFlags) {
    if (typeof(id) === 'undefined') {
      return _extendedFlags;
    } else {
      _extendedFlags = extendedFlags;
      return _macro;
    }
  };

  _macro.append = function(buffer) {
    macroCommands.push(buffer);
    size = size+buffer.length;
    return _macro;
  };

  _macro.clear = function() {
    macroCommands = [];
    size = 0;
    return this;
  };

  _macro.done = function(noEnd) {
    var header;
    if (_flags && 0x80) {
      header = new Buffer(3);
      header.writeUInt8(_flags, 1);
    } else {
      header = new Buffer(2);
    }
    header.writeUInt8(_id, 0);
    header.writeUInt8(_flags, 1);

    var parts = [ header ].concat(macroCommands);
    if (!noEnd) {
      parts.push(new Buffer([0x00]));
    }

    var buffer = Buffer.concat(parts);
    return buffer;
  };

  _macro.size = function() {
    return size;
  };

  return _macro;

};
