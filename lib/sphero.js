/* jshint node:true */

var events = require('events');
var serialPort = require('serialport');
var responseParser = require('./response-parser');

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

  return _sphero;
};

