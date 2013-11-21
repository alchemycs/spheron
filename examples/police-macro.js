/* jshint node:true */
/*

 Creates a macro to make Sphero flash blue and red like a police siren

 This file is expected to be run something like this:

 $ node examples/repl.js
 S> .load examples/police-macro.js
 S> s.open(dev);
 S> s.saveTemporaryMacro(police.done());
 S> s.runMacro(255);

 Or to make it more permanent and run when Sphero wakes up...

 $ node examples/repl.js
 S> .load examples/police-macro.js
 S> s.open(dev);
 S> police.id(100);
 S> s.saveMacro(police.done());
 S> s.sleep(0, 100, 0);


 */

var policeMacroId = 100; //Make 255 to try it as a temporary macro

var police = macro(policeMacroId);
police.append(commands.macro.setRGB(0, 100));
police.append(commands.macro.setRGB(0xFF0000, 100));
police.append(commands.macro.setRGB(0, 100));
police.append(commands.macro.setRGB(0xFF0000, 100));
police.append(commands.macro.setRGB(0, 100));
police.append(commands.macro.setRGB(0x0000FF, 100));
police.append(commands.macro.setRGB(0, 100));
police.append(commands.macro.setRGB(0x0000FF, 100));
police.append(commands.macro.setRGB(0, 200));
police.append(commands.macro.goto(police.id()));
police.size();
police.done();
