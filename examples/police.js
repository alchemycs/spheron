/* jshint node:true */
/*

 Turns off stabalisation and gently pulses a nice green colour

 This file is expected to be run something like this:

 $ node examples/repl.js
 S> .load examples/vege.js
 S> police(100, 500);
 S> repeat = true;
 S> police(100,500);
 S> repeat = false;

 */
var o = { resetTimeout:true, requestAcknowledgement:true };
var s = sphero().resetTimeout(true).requestAcknowledgement(true);

s.on('error', function(error) {
  console.log('Sphero error:', error);
});

s.on('open', function() {

  console.log('Sphero connected');

});

s.open(dev);

var repeat = false;

var police = function(delay1, delay2) {
  s.setRGB(0x000000, false);
  setTimeout(function() {
    s.setRGB(0x0000FF);
  }, delay1);
  setTimeout(function() {
    s.setRGB(0x000000, false);
  }, delay1*2);
  setTimeout(function() {
    s.setRGB(0x0000FF, false);
  }, delay1*3);
  setTimeout(function() {
    s.setRGB(0x000000, false);
  }, delay1*4);

  setTimeout(function() {
    s.setRGB(0xFF0000, false);
  }, delay1*5);
  setTimeout(function() {
    s.setRGB(0x000000, false);
  }, delay1*6);
  setTimeout(function() {
    s.setRGB(0xFF0000, false);
  }, delay1*7);
  setTimeout(function() {
    s.setRGB(0x000000, false);
  }, delay1*8);

  if (repeat) {
    setTimeout(function() {
      police(delay1, delay2);
    }, delay2+delay1*8);
  }
};
