/* jshint node:true */
/*
$> node example/repl.js
S>

 */

var sphero = require('../lib/sphero');
var repl = require('repl');

var context = repl.start('S> ').context;
context.dev = '/dev/cu.Sphero-PBR-RN-SPP'; //Change this to match your device
context.sphero = sphero;
context.toolbelt = require('../lib/toolbelt');
context.commands = require('../lib/commands');


context.o = { resetTimeout:true, requestAcknowledgement:true };
context.s = sphero();

context.s.on('error', function(error) {
  console.log('Sphero error:', error);
});

//context.s.open(dev);
