/* jshint node:true */
/*

 Turns off stabalisation and gently pulses a nice green colour

 This file expected to be run as follows:

 $ node examples/repl.js
 S> .load examples/vege.js

 */
var o = { resetTimeout:true, requestAcknowledgement:true };
var s = sphero();

s.on('error', function(error) {
  console.log('Sphero error:', error);
});

var colourStart = 0x006600;
var colourStop = 0x00FF00;

s.on('open', function() {

  console.log('Sphero connected');

});

s.open(dev);

var repeat = false;

var police = function(delay1, delay2) {
  s.write(commands.api.setRGB(0x000000, false, o));
  setTimeout(function() {
    s.write(commands.api.setRGB(0x0000FF, false, o));
  }, delay1);
  setTimeout(function() {
    s.write(commands.api.setRGB(0x000000, false, o));
  }, delay1*2);
  setTimeout(function() {
    s.write(commands.api.setRGB(0x0000FF, false, o));
  }, delay1*3);
  setTimeout(function() {
    s.write(commands.api.setRGB(0x000000, false, o));
  }, delay1*4);

  setTimeout(function() {
    s.write(commands.api.setRGB(0xFF0000, false, o));
  }, delay1*5);
  setTimeout(function() {
    s.write(commands.api.setRGB(0x000000, false, o));
  }, delay1*6);
  setTimeout(function() {
    s.write(commands.api.setRGB(0xFF0000, false, o));
  }, delay1*7);
  setTimeout(function() {
    s.write(commands.api.setRGB(0x000000, false, o));
  }, delay1*8);

  if (repeat) {
    setTimeout(function() {
      police(delay1, delay2);
    }, delay2+delay1*8);
  }
};

