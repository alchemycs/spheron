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
  s.write(commands.api.setStabalisation(false));

  var step = 0;
  var steps = 30*1;

  function nextColour() {
    var colour = toolbelt.colorStop(colourStart, colourStop, (Math.sin(step/steps)+1)/2);
    s.write(commands.api.setRGB(colour, false, { resetTimeout:true}));
    step++;
    setTimeout(nextColour, 16);
  }

  nextColour();

});

s.open(dev);
