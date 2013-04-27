var chipate = {
    'Emulator': function Emulator(setupProperties) {
        var self           = this,
            memoryBuffer   = new ArrayBuffer(0xE00 + 0x200),
            registerBuffer = new ArrayBuffer(0x10),
            screenBuffer   = new ArrayBuffer(64*32),
            memory         = new Uint8Array(memoryBuffer),
            registers      = new Uint8Array(registerBuffer),
            screen         = new Uint8Array(screenBuffer),
            i              = 0,
            pc             = 0x200,
            stack          = [],
            delayTimer = 0,
            soundTimer = 0,
            running = true;

        self.renderer = setupProperties['renderer'] || {'render': function () {}};
        self.input    = setupProperties['input']    || {'currentKey': -1};
        self.debugger = setupProperties['debugger'];

        self.loadRom = function loadRom(rom) {
            var i,
                length = rom.length;

            for (i = 0; i < length; i ++) {
                memory[0x200 + i] = rom[i];
            }

            self.initialize();
        }

        self.start = function start() {
            console.log('start');
            running = true;
            loop();
        };

        self.stop = function stop() {
            running = false;
        };

        self.initialize = function initialize() {
            memory[0x0 * 5 + 0] = parseInt('11110000', 2);
            memory[0x0 * 5 + 1] = parseInt('10010000', 2);
            memory[0x0 * 5 + 2] = parseInt('10010000', 2);
            memory[0x0 * 5 + 3] = parseInt('10010000', 2);
            memory[0x0 * 5 + 4] = parseInt('11110000', 2);

            memory[0x1 * 5 + 0] = parseInt('00110000', 2);
            memory[0x1 * 5 + 1] = parseInt('00010000', 2);
            memory[0x1 * 5 + 2] = parseInt('00010000', 2);
            memory[0x1 * 5 + 3] = parseInt('00010000', 2);
            memory[0x1 * 5 + 4] = parseInt('00010000', 2);

            memory[0x2 * 5 + 0] = parseInt('11110000', 2);
            memory[0x2 * 5 + 1] = parseInt('00010000', 2);
            memory[0x2 * 5 + 2] = parseInt('11110000', 2);
            memory[0x2 * 5 + 3] = parseInt('10000000', 2);
            memory[0x2 * 5 + 4] = parseInt('11110000', 2);

            memory[0x3 * 5 + 0] = parseInt('11110000', 2);
            memory[0x3 * 5 + 1] = parseInt('00010000', 2);
            memory[0x3 * 5 + 2] = parseInt('11110000', 2);
            memory[0x3 * 5 + 3] = parseInt('00010000', 2);
            memory[0x3 * 5 + 4] = parseInt('11110000', 2);

            memory[0x4 * 5 + 0] = parseInt('10010000', 2);
            memory[0x4 * 5 + 1] = parseInt('10010000', 2);
            memory[0x4 * 5 + 2] = parseInt('11110000', 2);
            memory[0x4 * 5 + 3] = parseInt('00010000', 2);
            memory[0x4 * 5 + 4] = parseInt('00010000', 2);

            memory[0x5 * 5 + 0] = parseInt('11110000', 2);
            memory[0x5 * 5 + 1] = parseInt('10000000', 2);
            memory[0x5 * 5 + 2] = parseInt('11110000', 2);
            memory[0x5 * 5 + 3] = parseInt('00010000', 2);
            memory[0x5 * 5 + 4] = parseInt('11110000', 2);

            memory[0x6 * 5 + 0] = parseInt('11110000', 2);
            memory[0x6 * 5 + 1] = parseInt('10000000', 2);
            memory[0x6 * 5 + 2] = parseInt('11110000', 2);
            memory[0x6 * 5 + 3] = parseInt('10010000', 2);
            memory[0x6 * 5 + 4] = parseInt('11110000', 2);

            memory[0x7 * 5 + 0] = parseInt('11110000', 2);
            memory[0x7 * 5 + 1] = parseInt('00010000', 2);
            memory[0x7 * 5 + 2] = parseInt('00010000', 2);
            memory[0x7 * 5 + 3] = parseInt('00010000', 2);
            memory[0x7 * 5 + 4] = parseInt('00010000', 2);

            memory[0x8 * 5 + 0] = parseInt('11110000', 2);
            memory[0x8 * 5 + 1] = parseInt('10010000', 2);
            memory[0x8 * 5 + 2] = parseInt('11110000', 2);
            memory[0x8 * 5 + 3] = parseInt('10010000', 2);
            memory[0x8 * 5 + 4] = parseInt('11110000', 2);

            memory[0x9 * 5 + 0] = parseInt('11110000', 2);
            memory[0x9 * 5 + 1] = parseInt('10010000', 2);
            memory[0x9 * 5 + 2] = parseInt('11110000', 2);
            memory[0x9 * 5 + 3] = parseInt('00010000', 2);
            memory[0x9 * 5 + 4] = parseInt('00010000', 2);

            memory[0xA * 5 + 0] = parseInt('11110000', 2);
            memory[0xA * 5 + 1] = parseInt('10010000', 2);
            memory[0xA * 5 + 2] = parseInt('11110000', 2);
            memory[0xA * 5 + 3] = parseInt('10010000', 2);
            memory[0xA * 5 + 4] = parseInt('10010000', 2);

            memory[0xB * 5 + 0] = parseInt('11100000', 2);
            memory[0xB * 5 + 1] = parseInt('10010000', 2);
            memory[0xB * 5 + 2] = parseInt('11100000', 2);
            memory[0xB * 5 + 3] = parseInt('10010000', 2);
            memory[0xB * 5 + 4] = parseInt('11100000', 2);

            memory[0xC * 5 + 0] = parseInt('11110000', 2);
            memory[0xC * 5 + 1] = parseInt('10000000', 2);
            memory[0xC * 5 + 2] = parseInt('10000000', 2);
            memory[0xC * 5 + 3] = parseInt('10000000', 2);
            memory[0xC * 5 + 4] = parseInt('11110000', 2);

            memory[0xD * 5 + 0] = parseInt('11100000', 2);
            memory[0xD * 5 + 1] = parseInt('10010000', 2);
            memory[0xD * 5 + 2] = parseInt('10010000', 2);
            memory[0xD * 5 + 3] = parseInt('10010000', 2);
            memory[0xD * 5 + 4] = parseInt('11100000', 2);

            memory[0xE * 5 + 0] = parseInt('11110000', 2);
            memory[0xE * 5 + 1] = parseInt('10000000', 2);
            memory[0xE * 5 + 2] = parseInt('11110000', 2);
            memory[0xE * 5 + 3] = parseInt('10000000', 2);
            memory[0xE * 5 + 4] = parseInt('11110000', 2);

            memory[0xF * 5 + 0] = parseInt('11110000', 2);
            memory[0xF * 5 + 1] = parseInt('10000000', 2);
            memory[0xF * 5 + 2] = parseInt('11110000', 2);
            memory[0xF * 5 + 3] = parseInt('10000000', 2);
            memory[0xF * 5 + 4] = parseInt('10000000', 2);

            setInterval(function () {
                if (delayTimer) {
                    delayTimer --;
                }
            }, 1000/60);

            setInterval(function () {
                if (soundTimer) {
                    soundTimer --;
                }
            }, 1000/60);
        };

        function render() {
            self.renderer.render(screen);
        }

        function clear() {
            var i;
            var l = screen.length;

            for (i = 0; i < l; i ++) {
                screen[i] = 0;
            }

            render();
        }

        function loop() {
            var word   = memory[pc] << 0x8 | memory[pc+1],
                opcode = word >> 0xc,
                x = (word & 0x0F00) >> 0x8,
                y = (word & 0xF0) >> 0x4,
                nnn = word & 0xFFF,
                nn  = word & 0xFF,
                n   = word & 0xF;

            if (self.debugger) {
                self.debugger.update({
                    'emulator':   self,
                    'memory':     memory,
                    'registers':  registers,
                    'i':          i,
                    'pc':         pc,
                    'stack':      stack,
                    'delayTimer': delayTimer,
                    'soundTimer': soundTimer,
                });

                if (!running) {
                    return;
                }
            }

            pc += 2;

            switch (opcode) {
                case 0x0:
                    switch (nn) {
                        case 0xE0: // clr
                            clear();
                            break;
                        case 0xEE: // ret
                            if (stack.length) {
                                pc = stack.pop();
                            }
                            break;
                    }
                    break;
                case 0x1: // jmp
                    pc = nnn;
                    break;
                case 0x2: // srt
                    stack.push(pc);
                    pc = nnn;
                    break;
                case 0x3: // sie
                    if (registers[x] === nn) {
                        pc += 2;
                    }
                    break;
                case 0x4: // sne
                    if (registers[x] !== nn) {
                        pc += 2;
                    }
                    break;
                case 0x5: // sre
                    if (registers[x] === registers[y]) {
                        pc += 2;
                    }
                    break;
                case 0x6: // set
                    registers[x] = nn;
                    break;
                case 0x7: // add
                    registers[x] += nn;
                    break;
                case 0x8:
                    switch (n) {
                        case 0x0: // str
                            registers[x] = registers[y];
                            break;
                        case 0x1: // ror
                            registers[x] = registers[x] | registers[y];
                            break;
                        case 0x2: // and
                            registers[x] = registers[x] & registers[y];
                            break;
                        case 0x3: // xor
                            registers[x] = registers[x] ^ registers[y];
                            break;
                        case 0x4: // adr
                            var result = registers[x] + registers[y];
                            if (result > 0xFF) {
                                registers[0xF] = 1;
                            }
                            else {
                                registers[0xF] = 0;
                            }
                            registers[x] = result;
                            break;
                        case 0x5: // sbr
                            var result = registers[x] - registers[y];
                            if (result < 0x0) {
                                registers[0xF] = 1;
                            }
                            else {
                                registers[0xF] = 0;
                            }
                            registers[x] = result;
                            break;
                        case 0x6: // shr
                            registers[0xF] = registers[x] & 0x1;
                            registers[x] = registers[x] >> 1;
                            break;
                        case 0x7: // sbf
                            var result = registers[y] - registers[x];
                            if (result < 0x0) {
                                registers[0xF] = 1;
                            }
                            else {
                                registers[0xF] = 0;
                            }
                            registers[x] = result;
                            break;
                        case 0xE: // shl
                            registers[0xF] = (registers[x] >> 7) & 0x1;
                            registers[x] = registers[x] << 1;
                            break;
                    }
                    break;
                case 0x9: // snr
                    if (registers[x] !== registers[y]) {
                        pc += 2;
                    }
                    break;
                case 0xA: // sti
                    i = nnn;
                    break;
                case 0xB: // jpp
                    pc = nnn + registers[0];
                    break;
                case 0xC: // rnd
                    registers[x] = Math.floor(Math.random() * 256) & nn;
                    break;
                case 0xD: // drw
                    var screenX = registers[x];
                    var screenY = registers[y];
                    var maxScreenX = screenX + 8;
                    var maxScreenY = screenY + n;
                    var memAdd = i;
                    var byt;
                    var bitCount;
                    var pos;

                    registers[0xF] = 0;
                    for (screenY; screenY < maxScreenY; screenY ++) {
                        byt = memory[memAdd];
                        bitCount = 7;
                        for (screenX; screenX < maxScreenX; screenX ++) {
                            pos = screenY*64+screenX;
                            var bit = (byt >> bitCount) & 1;
                            if (bit) {
                                if (screen[pos]) {
                                    registers[0xF] = 1;
                                    screen[pos] = 0;
                                }
                                else {
                                    registers[0xF] = 0;
                                    screen[pos] = 1;
                                }
                            }
                            bitCount --;
                        }
                        screenX -= 8;
                        memAdd ++;
                    }
                    render();
                    break;
                case 0xE:
                    switch (nn) {
                        case 0x9E: // sip
                            if (registers[x] === self.input.currentKey) {
                                pc += 2;
                            }
                            break;
                        case 0xA1: // snp
                            if (registers[x] !== self.input.currentKey) {
                                pc += 2;
                            }
                            break;
                        break;
                    }
                    break;
                case 0xF:
                    switch (nn) {
                        case 0x07: // stm
                            registers[x] = delayTimer;
                            break;
                        case 0x0A: // wfk
                            console.log('waiting for input');
                            self.input.onKeyDown = function () {
                                self.input.onKeyDown = null;
                                console.log('key pressed');
                                registers[x] = self.input.currentKey;
                                running = true;
                                setTimeout(loop, 0);
                            };
                            running = false;
                            break;
                        case 0x15: // sdt
                            delayTimer = registers[x];
                            break;
                        case 0x18: // sst
                            soundTimer = registers[x];
                            break;
                        case 0x1E: // adi
                            i += registers[x];
                            break;
                        case 0x29: // sts
                            i = registers[x] * 5;
                            break;
                        case 0x33: // sbd
                            var temp = registers[x];
                            memory[i] = Math.floor(temp / 100);
                            temp -= memory[i] * 100;
                            memory[i+1] = Math.floor(temp / 10);
                            temp -= memory[i] * 10;
                            memory[i+2] = temp;
                            break;
                        case 0x55: // srm
                            var ii;
                            for (ii = 0; ii <= x; ii ++) {
                                memory[i + ii] = registers[ii];
                            }
                            break;
                        case 0x65: // lrm
                            var ii;
                            for (ii = 0; ii <= x; ii ++) {
                                 registers[ii] = memory[i + ii];
                            }
                            break;
                    }
                    break;
            }

            if (running) {
                setTimeout(loop, 0);
            }
        }
    },
    'VisualDebugger': function VisualDebugger(element) {
        var self = this,
            sideBox          = document.createElement('div'),
            internalsDisplay = document.createElement('pre'),
            lineDisplay      = document.createElement('div'),
            toggleBox1       = document.createElement('div'),
            stepCheckbox     = document.createElement('input'),
            stepLabel        = document.createElement('label'),
            toggleBox2       = document.createElement('div'),
            followCheckbox   = document.createElement('input'),
            followLabel      = document.createElement('label'),
            lineElements,
            lastLine,
            lastPc;

        sideBox.id          = 'side-box';
        internalsDisplay.id = 'internals-display';
        lineDisplay.id      = 'line-display';

        stepCheckbox.type   = 'checkbox';
        stepLabel.innerHTML   = 'step';

        followCheckbox.type = 'checkbox';
        followCheckbox.checked = 'true';
        followLabel.innerHTML = 'follow';

        element.appendChild(lineDisplay);

        toggleBox1.appendChild(stepCheckbox);
        toggleBox1.appendChild(stepLabel);
        sideBox.appendChild(toggleBox1);

        toggleBox2.appendChild(followCheckbox);
        toggleBox2.appendChild(followLabel);
        sideBox.appendChild(toggleBox2);

        sideBox.appendChild(internalsDisplay);

        element.appendChild(sideBox);

        self.update = function update(data) {
            var disassembled,
                currentLine,
                offsetTop;

            if (!lineElements) {
                lineElements = [];
                disassembled = chipate.disassemble(data.memory);
                disassembled.forEach(function (line, index) {
                    var lineElement = document.createElement('div');

                    lineElement.className = 'line';

                    if (index % 2) {
                        lineElement.className += ' odd';
                    }

                    lineElement.innerHTML = line[0];
                    if (line[1]) {
                        lineElement.innerHTML += ' ' + line[1] + ' ' + line[2].join(' ');
                    }

                    lineDisplay.appendChild(lineElement);
                    lineElements[line[0]] = lineElement;
                });
            }

            currentLine = lineElements[data.pc];
            if (currentLine) {
                if (lastLine) {
                    lastLine.className = lastLine.className.replace(' current', '');
                }
                currentLine.className += ' current';

                if (followCheckbox.checked) {
                    offsetTop = currentLine.offsetTop - lineDisplay.offsetTop;
                    if (lineDisplay.scrollTop + lineDisplay.offsetHeight < offsetTop || lineDisplay.scrollTop > offsetTop) {
                        lineDisplay.scrollTop = offsetTop;
                    }
                }

                lastLine = currentLine;
            }

            internalsDisplay.innerHTML  = 'pc: ' + data.pc + '\n';
            internalsDisplay.innerHTML += 'v0: ' + data.registers[0] + '\n';
            internalsDisplay.innerHTML += 'v1: ' + data.registers[1] + '\n';
            internalsDisplay.innerHTML += 'v2: ' + data.registers[2] + '\n';
            internalsDisplay.innerHTML += 'v3: ' + data.registers[3] + '\n';
            internalsDisplay.innerHTML += 'v4: ' + data.registers[4] + '\n';
            internalsDisplay.innerHTML += 'v5: ' + data.registers[5] + '\n';
            internalsDisplay.innerHTML += 'v6: ' + data.registers[6] + '\n';
            internalsDisplay.innerHTML += 'v7: ' + data.registers[7] + '\n';
            internalsDisplay.innerHTML += 'v8: ' + data.registers[8] + '\n';
            internalsDisplay.innerHTML += 'v9: ' + data.registers[9] + '\n';
            internalsDisplay.innerHTML += 'va: ' + data.registers[10] + '\n';
            internalsDisplay.innerHTML += 'vb: ' + data.registers[11] + '\n';
            internalsDisplay.innerHTML += 'vc: ' + data.registers[12] + '\n';
            internalsDisplay.innerHTML += 'vd: ' + data.registers[13] + '\n';
            internalsDisplay.innerHTML += 've: ' + data.registers[14] + '\n';
            internalsDisplay.innerHTML += 'vf: ' + data.registers[15] + '\n';
            internalsDisplay.innerHTML += ' i: ' + data.i + '\n';
            internalsDisplay.innerHTML += 'dt: ' + data.delayTimer + '\n';
            internalsDisplay.innerHTML += 'st: ' + data.soundTimer + '\n';
            // todo: add stack display

            if (stepCheckbox.checked) {
                if (lastPc !== data.pc) {
                    data.emulator.stop();
                    lastPc = data.pc;
                }
            }
        };
    },
    'CanvasRenderer': function CanvasRenderer(canvasElement) {
        var context = canvasElement.getContext('2d');

        this.render = function render(screen) {
            var screenX;
            var screenY;

            for (screenY = 0; screenY < 32; screenY ++) {
                for (screenX = 0; screenX < 64; screenX ++) {
                    if (screen[screenY*64+screenX]) {
                        context.fillRect(screenX*10, screenY*10, 10, 10);
                    }
                    else {
                        context.clearRect(screenX*10, screenY*10, 10, 10);
                    }
                }
            }
        }
    },
    'KeyboardInput': function () {
        var self = this,
            keyMap = {
                49: 0x0,
                50: 0x1,
                51: 0x2,
                52: 0x3,
                81: 0x4,
                87: 0x5,
                69: 0x6,
                82: 0x7,
                65: 0x8,
                83: 0x9,
                68: 0xA,
                70: 0xB,
                90: 0xC,
                88: 0xD,
                67: 0xE,
                86: 0xF
            };

        self.currentKey = -1;
        self.onKeyDown = null;

        document.onkeydown = function (event) {
            var key = event.which;

            if (key in keyMap) {
                self.currentKey = keyMap[key];
            }

            if (self.onKeyDown) {
                self.onKeyDown();
            }
        }

        document.onkeyup = function () {
            self.currentKey = -1;
        }
            
    },
    'disassemble': function disassemble(memory) {
        var length = memory.length,
            i,
            word,
            opcode,
            x,
            y,
            nnn,
            nn,
            n,
            command,
            args,
            lines = [];

        for (i = 0; i < length; i ++) {
            word = memory[i] << 0x8 | memory[i+1],
            opcode = word >> 0xc,
            x = (word & 0x0F00) >> 0x8,
            y = (word & 0xF0) >> 0x4,
            nnn = word & 0xFFF,
            nn  = word & 0xFF,
            n   = word & 0xF,
            command ='',
            args = [];

            switch (opcode) {
                case 0x0:
                    switch (nn) {
                        case 0xE0:
                            command = 'clr';
                            break;
                        case 0xEE:
                            command = 'ret';
                            break;
                    }
                    break;
                case 0x1:
                    command = 'jmp';
                    args.push(nnn);
                    break;
                case 0x2:
                    command = 'srt';
                    args.push(nnn);
                    break;
                case 0x3:
                    command = 'sie';
                    args.push(x, nn);
                    break;
                case 0x4:
                    command = 'sne';
                    args.push(x, nn);
                    break;
                case 0x5:
                    command = 'sre';
                    args.push(x, y);
                    break;
                case 0x6:
                    command = 'set';
                    args.push(x, nn);
                    break;
                case 0x7:
                    command = 'add';
                    args.push(x, nn);
                    break;
                case 0x8:
                    switch (n) {
                        case 0x0:
                            command = 'str';
                            break;
                        case 0x1:
                            command = 'ror';
                            break;
                        case 0x2:
                            command = 'and';
                            break;
                        case 0x3:
                            command = 'xor';
                            break;
                        case 0x4:
                            command = 'adr';
                            break;
                        case 0x5:
                            command = 'sbr';
                            break;
                        case 0x6:
                            command = 'shr';
                            break;
                        case 0x7:
                            command = 'sbf';
                            break;
                        case 0xE:
                            command = 'shl';
                            break;
                    }
                    args.push(x, y);
                    break;
                case 0x9:
                    command = 'snr';
                    args.push(x, y);
                    break;
                case 0xA:
                    command = 'sti';
                    args.push(nnn);
                    break;
                case 0xB:
                    command = 'jpp';
                    args.push(nnn);
                    break;
                case 0xC:
                    command = 'rnd';
                    args.push(x, nn);
                    break;
                case 0xD:
                    command = 'drw';
                    args.push(x, y, n);
                    break;
                case 0xE:
                    switch (nn) {
                        case 0x9E:
                            command = 'sip';
                            break;
                        case 0xA1:
                            command = 'snp';
                            break;
                        break;
                    }
                    args.push(x);
                    break;
                case 0xF:
                    switch (nn) {
                        case 0x07:
                            command = 'stm';
                            break;
                        case 0x0A:
                            command = 'wfk';
                            break;
                        case 0x15:
                            command = 'sdt';
                            break;
                        case 0x18:
                            command = 'sst';
                            break;
                        case 0x1E:
                            command = 'adi';
                            break;
                        case 0x29:
                            command = 'sts';
                            break;
                        case 0x33:
                            command = 'sbd';
                            break;
                        case 0x55:
                            command = 'srm';
                            break;
                        case 0x65:
                            command = 'lrm';
                            break;
                    }
                    args.push(x);
                    break;
            }

            if (command) {
                lines.push([i, command, args]);
            }
            else {
                lines.push([i, null]);
            }
        }

        return lines;
    },
    'ajaxRom': function ajaxRom(path, callback) {
        var xhr       = new XMLHttpRequest(),
            romBuffer = new ArrayBuffer(0xE00),
            rom       = new Uint8Array(romBuffer);

        xhr.overrideMimeType('text/plain; charset=x-user-defined');
        xhr.onreadystatechange = function () {
            var text,
                i,
                byt;

            if (xhr.readyState == 4) {
                text = xhr.responseText;

                for (i = 0; i < text.length; i ++) {
                    byt = text.charCodeAt(i) & 0xFF;
                    rom[i] = byt;
                }

                callback(rom);
            }
        };
        xhr.open('GET', path);
        xhr.send();
    },
    'quickSetup': function (canvasElement) {
        var renderer = new chipate.CanvasRenderer(canvasElement),
            input    = new chipate.KeyboardInput(),
            emulator = new chipate.Emulator({'renderer': renderer, 'input': input});

        return emulator;
    }
};
