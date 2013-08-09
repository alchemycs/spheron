/* jshint node:true */

/*
 General tools useful to the library or clients
 */

/**
 * An enum of some nice colour names
 *
 * @type {{BLACK: number, BLUE: number, GREEN: number, ORANGE: number, PINK: number, PURPLE: number, RED: number, WHITE: number, YELLOW: number}}
 */
var COLORS = exports.COLORS = {
  BLACK:  0x000000,
  BLUE:   0x0000ff,
  GREEN:  0x00ff00,
  ORANGE: 0xff4500,
  PINK:   0xff1444,
  PURPLE: 0xff00ff,
  RED:    0xff0000,
  WHITE:  0xffffff,
  YELLOW: 0xffff00
};

/**
 * An array of primary colours
 * @type {Array}
 */
var COLORS_PRIMARY = exports.COLORS_PRIMARY = [
  COLORS.RED, COLORS.GREEN, COLORS.BLUE
];

/**
 * Select a random primary colour
 *
 * @returns {*}
 */
exports.randomPrimary = function() {
  var index = Math.floor(Math.random()*COLORS_PRIMARY.length);
  return COLORS_PRIMARY[index];
};

/**
 * Select a random colour across the whole colour space
 *
 * @returns {number}
 */
exports.randomColor = function() {
  var r = Math.random()*255;
  var g = Math.random()*255;
  var b = Math.random()*255;
  var color = (r << 16) | (g << 8) | b;
  return color;
};

/**
 * Determine the colour between a start and end colour given a position between them.
 *
 * @param startColor
 * @param endColor
 * @param position A float between 0 and 1 where 0=start colour and 1=end colour
 * @returns {number}
 */
exports.colorStop = function(startColor, endColor, position) {
  if (position < 0 ) {
    position = 0;
  }
  if (position > 1) {
    position = 1;
  }
  var redStart = (startColor & 0xFF0000) >> 16;
  var redEnd = (endColor & 0xFF0000) >> 16;
  var redRange = redEnd-redStart;
  var greenStart = (startColor & 0x00FF00) >> 8;
  var greenEnd = (endColor & 0x00FF00) >> 8;
  var greenRange = greenEnd-greenStart;
  var blueStart = startColor & 0x0000FF;
  var blueEnd = endColor & 0x0000FF;
  var blueRange = blueEnd-blueStart;

  var newRed = redStart + Math.round((redRange) * position);
  var newGreen = greenStart + Math.round((greenRange) * position);
  var newBlue = blueStart + Math.round((blueRange) * position);

  var newColor = (newRed << 16) | (newGreen << 8) | newBlue;

  return newColor;
};

/**
 * Calculate the checksum of a buffer by summing the bytes with module 256 then 1-complimenting the result
 *
 * @param aBuffer
 * @returns {number}
 */
exports.calculateChecksum = function(aBuffer) {
  var calculatedChecksum = 0;
  for (var _i = 0; _i < aBuffer.length; _i++) {
    calculatedChecksum += aBuffer.readUInt8(_i);
  }
  calculatedChecksum = calculatedChecksum & 0xFF ^ 0xFF;
  return calculatedChecksum;
};

/**
 * Internal helper class create a Sphero command packet
 *
 * @param did
 * @param cid
 * @param options
 * @returns {{}}
 */
exports.createPacket = function(did, cid, options) {
  var _packet = {};
  for (var _i in options) {
    if (options.hasOwnProperty(_i)) {
      _packet[_i] = options[_i];
    }
  }
  _packet.DID = did;
  _packet.CID = cid;

  return _packet;
};
