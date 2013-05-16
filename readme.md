# chipate - a javascript CHIP-8 emulator

## Try it [here](http://www.matthewrayfield.com/chipate/chipate.html)!

### What is it?
chipate is a [CHIP-8](http://en.wikipedia.org/wiki/CHIP-8) emulator that runs in your web browser. It has a built in debugger and disassembler.

### What browsers are supported?
It's been tested and works in Safari, Chrome, and Firefox.

### Where do I use it?
At <http://www.matthewrayfield.com/chipate/chipate.html> or on your own computer by following the "How do I install it?" instructions below.

### How do I use it?
Yeah, it's not exactly user friendly at the moment. Sorry about that.

But it's pretty simple:

1. Select a ROM (they're almost all games) from the left dropdown menu.
2. Click the "Load" button.
3. Click the "Start" button.
4. Play the game using the 1,2,3,4 q,w,e,r, a,s,d,f, and z,x,c,v keys. All the games have different controls, so just bang on 'em until you figure it out.

If you want to use the debugger, check the "debugger" box and the debugger / disassembler will appear. It slows down playback quite a bit, but that's okay.

If you check the "step" checkbox it will pause the playback on the current instruction. Then if you click the "Start" button it will step to the next instruction.

Unchecking the "follow" checkbox allows the disassembler window to scroll freely instead of auto-scrolling to the current instruction.

### How do I install it?
If you'd like to run it off your own computer just do the following:

1. Clone this repo.
2. Create a new folder named "roms" inside the chipate folder.
3. Download and unzip [these roms](http://www.zophar.net/pdroms/chip8/chip-8-games-pack.html) into the new "roms" folder.
4. Now run some sort of local webserver. If you have Python installed, you can do this by running "python -m SimpleHTTPServer" from within the chipate folder.
5. Now access "chipate.html" through your browser. If you used the above Python server it should be "http://localhost:8000/chipate.html".

### What's next?
I'm not sure. But I do have some ideas:

- Add an assembler and create a kind of CHIP-8 IDE.
- Optimize it. I know it can run much faster.
- Add some sort of more intuitive interface.
- Add the ability to drag and drop ROMs onto the window.
- Add sound support.
- Fix bugs (hahaha).
- Add SCHIP support.
- Add memory dump support for saving.
