/* jshint node:true */

var events = require('events');
var serialPort = require('serialport');
var responseParser = require('./response-parser');
var commands = require('./commands');

/**
 *  Creates a new Sphero object
 *
 * @returns {events.EventEmitter}
 */
module.exports = function() {
  var _serialPort = null;

  var _sphero = new events.EventEmitter();

  _sphero.open = function(device) {
    _serialPort = new serialPort.SerialPort(device, {
      parser:responseParser.spheroResponseParser()
    });

    _serialPort.on('open', function() {
      _sphero.emit('open');
    });
    _serialPort.on('close', function() {
      _sphero.emit('close');
    });
    _serialPort.on('end', function() {
      _sphero.emit('end');
    });
    _serialPort.on('error', function(error) {
      _sphero.emit('error', error);
    });
    _serialPort.on('data', function(packet) {
      _sphero.emit('packet', packet);
      switch (packet.SOP2) {
        case 0xFF:
          _sphero.emit('message', packet);
          break;
        case 0xFE:
          _sphero.emit('notification', packet);
          break;
      }
    });
    _serialPort.on('oob', function(packet) {
      _sphero.emit('oob', packet);
    });
  };
  _sphero.close = function(callback) {
    _serialPort.close(callback);
  };
  _sphero.write = function(buffer, callback) {
    _serialPort.write(buffer, callback);
    return _sphero;
  };

  cascadeCommands(_sphero);

  return _sphero;
};

var cascadeCommands = function(sphero) {

  var func;
  var interceptor = function(sphero, func) {
    return function() {
      var packet = func.apply(this, arguments);
      console.log(packet);
      sphero.write(packet);
      return sphero;
    };
  };

  for (func in commands.core) {
    if (commands.core.hasOwnProperty(func) && typeof(commands.core[func])==='function') {
      sphero[func] = interceptor(sphero, commands.core[func]);
    }
  }

  for (func in commands.api) {
    if (commands.api.hasOwnProperty(func) && typeof(commands.api[func])==='function') {
      sphero[func] = interceptor(sphero, commands.api[func]);
    }
  }


};