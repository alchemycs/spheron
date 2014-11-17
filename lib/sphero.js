/* jshint node:true */

var events = require('events'),
    responseParser = require('./response-parser'),
    commands = require('./commands'),
    serialPort = null;

// thanks to https://github.com/jgautier/firmata/blob/master/lib/firmata.js
try {
  if (process.browser) {
    serialPort = require("browser-serialport").SerialPort;
  } else {
    serialPort = require("serialport").SerialPort;
  }
} catch (err) {
  serialPort = null;
}

if (serialPort == null) {
  console.log("It looks like serialport didn't compile properly. This is a common problem and its fix is well documented here https://github.com/voodootikigod/node-serialport#to-install");
  throw "Missing serialport dependency";
}

/**
 *  Creates a new Sphero object
 *
 * @returns {events.EventEmitter}
 */
module.exports = function() {
  var _serialPort = null;

  var _sphero = new events.EventEmitter();

  var options = {
    resetTimeout:false,
    requestAcknowledgment:false
  };

  _sphero.resetTimeout = function(reset) {
    if (typeof(reset) === 'undefined') {
      return options.resetTimeout;
    } else {
      options.resetTimeout = reset;
      return _sphero;
    }
  };

  _sphero.requestAcknowledgement = function(acknowledge) {
    if (typeof(acknowledge) === 'undefined') {
      return options.requestAcknowledgment;
    } else {
      options.requestAcknowledgment = acknowledge;
      return _sphero;
    }
  };

  _sphero.open = function(device, callback) {
    _serialPort = new serialPort(device, {
      parser:responseParser.spheroResponseParser()
    }, true, function(err){
      if (err){
        if (callback && typeof(callback) == 'function'){
          callback(err);
        }
      }});

    _serialPort.on('open', function() {
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

      _serialPort.on('close', function() {
        _sphero.emit('close');
      });
      _serialPort.on('end', function() {
        _sphero.emit('end');
      });
      _serialPort.on('error', function(error) {
        _sphero.emit('error', error);
      });
      _serialPort.on('oob', function(packet) {
        _sphero.emit('oob', packet);
      });

      _sphero.emit('open');
      if (callback && typeof(callback) == 'function'){
        callback(null);
      }
    });
    return _sphero;
  };
  _sphero.close = function(callback) {
    _serialPort.close(callback);
  };
  _sphero.write = function(buffer, callback) {

    var cb = function(err, data){
      _sphero.emit('write', err, data);
      if (typeof(callback) === 'function'){
        callback(err, data);
      }
    }

    _serialPort.write(buffer, cb);

    return _sphero;
  };

  cascadeCommands(_sphero);

  return _sphero;
};

var cascadeCommands = function(sphero) {

  var func;
  var interceptor = function(sphero, func) {
    return function() {
      var options;
      var args = Array.prototype.slice.call(arguments);
      var callback = null;

      if (typeof(args[args.length - 1]) === 'function'){
        callback = args[args.length - 1]
      }

      if (args.length === func.length) {
        //An options parameter has been supplied, we just need to make changes where necessary
        options = args[args.length-1];
        if (!options.hasOwnProperty('resetTimeout')) {
          options.resetTimeout = sphero.resetTimeout();
        }
        if (!options.hasOwnProperty('requestAcknowledgement')) {
          options.requestAcknowledgement = sphero.requestAcknowledgement();
        }
      } else {
        //No options parameter has been supplied, we should build the
        args.push({
          resetTimeout:sphero.resetTimeout(),
          requestAcknowledgement:sphero.requestAcknowledgement()
        });
      }

      var packet = func.apply(this, args);

      sphero.write(packet, callback);

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
