# Use your javascript powers to control the Sphero by Orbotix

[![Build Status](https://travis-ci.org/alchemycs/spheron.png?branch=master)](https://travis-ci.org/alchemycs/spheron)

## Quick Start

    npm install spheron

Connect your [Sphero](http://gosphero.com) to your computer via bluetooth.

Add `spheron` to your code:

```javascript
var spheron = require('spheron');
var sphero = spheron.sphero();
var spheroPort = '/dev/cu.Sphero-RGB';
var COLORS = spheron.toolbelt.COLORS.BLUE;

sphero.on('open', function() {
  sphero.setRGB(color:COLORS.BLUE);
});

sphero.open(spheroPort);
```

Run that and your sphero will turn blue. You can pass hex colours such as `sphero.setRGB(0xFF00FF})` for `PURPLE`.

There are some named colours in `toolbelt.COLORS`.

## Dependencies
Communications over bluetooth are done through [node-serialport](https://github.com/voodootikigod/node-serialport) so
please check there for what you need to make it work.

##Examples
There are a few examples in the `examples` directory:

* `repl.js` provides a simple REPL shell to get you started and try things out
* `vege.js` uses the raw `.write()` method to send packets to the Sphero
* `police.js` takes advantage of the chained API
* See `spheron` being used in [spheron-leap](https://github.com/alchemycs/spheron-leap) controlling Sphero using Leap Motion

[![](http://img.youtube.com/vi/3ratT1yCnow/0.jpg)](http://www.youtube.com/watch?v=3ratT1yCnow&feature=share&list=UUKZdVrHYWr7rVNKbs9_fXnw)


##Direction
I plan on creating several execution strategies so that commands can be chained, waited upon and evented in such a way
that it can be run interactively or converted into a `macro` or (possibly?) `orbBasic` program and saved directly to
the Sphero.

Something like: `sphero.startMacro().setRGB(0x00FF00).strobeLED({period:60}).wait(1000).sleep().saveMacro()`

I'm also planning on implementing the API as completely as possible. [Orbotix](https://www.gosphero.com/company/) have
done a great job in [documenting the Sphero API](https://github.com/orbotix/DeveloperResources)!

##TODO
The most immediate things to be done include:

* Documentation!
* Create a macro builder
* Implement callbacks (or just stick with an event model?)

## Acknowledgments

Thanks to:
* Chris Williams for making [node-serialport](https://github.com/voodootikigod/node-serialport)
* [Orbotix](https://www.gosphero.com/company/) for creating and documenting the [Sphero API](https://github.com/orbotix/DeveloperResources)

## Legal Notices
This work is not endorsed by Orbotix.

Trademarks are the property of their respective owners.

## License

Simplified BSD License
