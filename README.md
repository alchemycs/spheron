# Use your javascript powers to control the Sphero by Orbotix

[![Build Status](https://travis-ci.org/alchemycs/spheron.png?branch=master)](https://travis-ci.org/alchemycs/spheron)

## Quick Start

    npm install spheron

Connect your [Sphero](http://gosphero.com) to your computer via bluetooth.

Add `spheron` to your code:

```
var spheron = require('spheron');
var sphero = spheron.sphero();
var spheroPort = '/dev/cu.Sphero-RGB';
var COLORS = spheron.toolbelt.COLORS;

sphero.on('open', function() {
  sphero.setRGB(COLORS.BLUE, false);
});

sphero.open(spheroPort);
```

Run that and your sphero will turn blue. You can pass hex colours such as `sphero.setRGB(0xFF00FF)` for `PURPLE`.

There are some named colours in `toolbelt.COLORS`.

## Dependencies
Communications over bluetooth are done through [node-serialport](https://github.com/voodootikigod/node-serialport) so
please check there for what you need to make it work.

## Examples
There are a few examples in the `examples` directory:

* `repl.js` provides a simple REPL shell to get you started and try things out
* `vege.js` uses the raw `.write()` method to send packets to the Sphero
* `police.js` takes advantage of the chained API
* `police-macro.js` uses macros to create a police light effect
* See `spheron` being used in [spheron-leap](https://github.com/alchemycs/spheron-leap) controlling Sphero using Leap Motion

[![](http://img.youtube.com/vi/3ratT1yCnow/0.jpg)](http://www.youtube.com/watch?v=3ratT1yCnow&feature=share&list=UUKZdVrHYWr7rVNKbs9_fXnw)


## Development Direction
I plan on creating several execution strategies so that commands can be chained, waited upon and evented in such a way
that it can be run interactively or converted into a `macro` or (possibly?) `orbBasic` program and saved directly to
the Sphero.

Something like: `sphero.startMacro().setRGB(0x00FF00).strobeLED({period:60}).wait(1000).sleep().saveMacro()`

I'm also planning on implementing the API as completely as possible (as time permits). [Orbotix](https://www.gosphero.com/company/) have
done a great job in [documenting the Sphero API](https://github.com/orbotix/DeveloperResources)!

## Methods
The `spheron` methods are chainable and certain methods are either query or command based on the number of arguments (much like jQuery).

### `sphero.resetTimeout([true|false])`
Called with no arguments this method will return the current state.

When this has been set to `true` then sphero will reset the internal command timeout after each command. This prevents sphero shutting down while in use. When this is `false` sphero will continue it's internal timeout count even when packets are sent.

### `sphero.requestAcknowledgement([true|false])`
Called with no arguments this method will return the current state.

When this has been set to `true` then sphero will emit a *message* in response to the command. When this is `false` sphero will not emit a *message*. Be mindfull that if this is false and you send a command asking for information (eg, current battery state) then you will **not** receive a response.

### More Commands
I've tried to implement most of the API commands, and will endevour to have more complete documentation done over the Christmas 2013 period. Please feel free to ask me any questions in the meantime.


## Events
The `sphero` object returned by the `spheron()` methid is an `EventEmitter` and supports the following events:

### `sphero.on('error', callback)`
Emitted when an error occurs. This is usaually connection oriented. The `callback` function simply takes a single error argument:

```
sphero.on('error', function(error) {
  console.log('Opps, something went wrong!');
});
```

### `sphero.on('open', callback)`
This event is triggered once the connection to your sphero has been established. At this point it is now safe to send commands to your sphero.

```
sphero.on('open', function() {
  console.log('Hurah! We're connected!');
});
```

### `sphero.on('close', callback)`
When the connection to your sphero has been closed, this event will let you know.

```
sphero.on('close', function() {
  console.log('Goodnight.');
});
```

### `sphero.on('end', callback)`
When the connection to your sphero has ended, this event will let you know.

```
sphero.on('end', function() {
  console.log('Connection has ended');
});
```

### `sphero.on('oob', callback)`
Any data that sphero sends that is not a recognised packet (i.e., Out Of Band)can be read from this event. Be mindful that the argument to the `callback` is a `Buffer` that has not been composed in any way. This means anything the sphero is sending out of band might be broken into several events.

```
sphero.on('oob', function(aBuffer) {
  console.log('OOB! ', aBuffer);
});
```


### `sphero.on('message', callback)`
A *message* is an acknowledgement from sphero in response to a command. The `callback` take as the only argument an object that represents the message.

```
sphero.on('message', function(message) {
  console.log('Sphero sent this message: ', message);
});
```

### `sphero.on('notification', callback)`
A *notification* is sent from sphero to advise of a condition such as low battery or a detected change in the locator module. The `callback` take as the only argument an object that represents the notification.

```
sphero.on('notification', function(notification) {
  console.log('Sphero would like to let you know: ', notification);
});
```

### `sphero.on('packet', callback)`
This event is a convenienve that is emitted on either a *message* or *notification* event. The `callback` takes a single argument that is either a *notification* or a *message*.

```
sphero.on('packet', function(packet) {
  console.log('Sphero sent this packet: ', packet);
  switch (packet.SOP2) {
    case 0xFF :
    	console.log('This is an acknowledgement');
    	break;
    case 0xFE :
    	console.log('This is a notification');
    	break;
});
```

## Event Packets
The *message* and *notification* packets have the following structure:

### Message Packet
```
{
  SOP1		(this is always 0xFF),
  SOP2		(this is always 0xFF for messages)
  MRSP		(Message Response, please see the API guide for details, I'll try and summarise it here at a later date)
  SEQ		(The sequence number passed into the calling request)
  DLEN		(The length of the data, including the trailing checksum)
  DATA		(This is a Buffer with the raw data. Future versions of spheron will abstract this)
  CHK		(The checksum of the packet)
}
```

### Notification Packet
```
{
  SOP1		(this is always 0xFF),
  SOP2		(this is always 0xFE for notifications)
  ID_CODE	(identifies what type of notification is being sent. Future versions of spheron will abstract this)
  DLEN		(The length of the data, including the trailing checksum)
  DATA		(This is a Buffer with the raw data. Future versions of spheron will abstract this)
  CHK		(The checksum of the packet)
}
```

For more details on the *message* and *notification* packets please see the [Sphero API Giude](https://github.com/orbotix/DeveloperResources/blob/ab81f775274494082b63422a41db22685b003c6f/docs/Sphero_API_1.46.pdf?raw=true).

## Macros
The basic macro code has been built but requires further testing and documentation. Please feel free to try it out or ask questions.

Obviously, this needs more documentation.

## TODO
The most immediate things to be done include:

* Documentation!
* Create <strike>a macro builder</strike> macro builder documentation (until then, please see [examples/police-macro.js](examples/police-macro.js) and code for usage details)
* Smarter objects passed into event listeners to make usage easier
* Implement callbacks (or just stick with an event model?)
* This has been written against the Orbotix Communications API 1.46, need to check against version 1.50 and on Sphero 2.0.

## Acknowledgments

Thanks to:

* Chris Williams for making [node-serialport](https://github.com/voodootikigod/node-serialport)
* [Orbotix](https://www.gosphero.com/company/) for creating and documenting the [Sphero API](https://github.com/orbotix/DeveloperResources)

## Legal Notices
This work is not endorsed by Orbotix.

Trademarks are the property of their respective owners.

## License

Simplified BSD License
