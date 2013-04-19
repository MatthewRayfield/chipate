var memoryBuffer   = new ArrayBuffer(0xE00 + 0x200),
    registerBuffer = new ArrayBuffer(0x10),
    screenBuffer   = new ArrayBuffer(64*32),
    memory         = new Uint8Array(memoryBuffer),
    registers      = new Uint8Array(registerBuffer),
    screen         = new Uint8Array(screenBuffer),
    i              = 0,
    pc             = 0x200,
    stack          = [],
    canvas,
    context,
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
    },
    keyIsDown = false,
    currentKey,
    waitingForKey = undefined,
    delayTimer = 0,
    soundTimer = 0,
    running = true;

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

document.onkeydown = function (e) {
    keyIsDown = true;
    currentKey = keyMap[e.which];
    console.log('key: ' + currentKey);
    if (waitingForKey) {
        waitingForKey();
        waitingForKey = undefined;
    }
}

document.onkeyup = function (e) {
    keyIsDown = false;
}

function render() {
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

    //console.log('pc:' + pc + 'opcode:' + opcode.toString(16));

    pc += 2;

    switch (opcode) {
        case 0x0:
            switch (nn) {
                case 0xE0:
                    clear();
                    break;
                case 0xEE:
                    pc = stack.pop();
                    break;
            }
            break;
        case 0x1:
            pc = nnn;
            break;
        case 0x2:
            stack.push(pc);
            px = nnn;
            break;
        case 0x3:
            if (registers[x] === nn) {
                if (x === 0xF) {
                    console.log('OKAY');
                    console.log(pc);
                }
                pc += 2;
            }
            break;
        case 0x4:
            if (registers[x] !== nn) {
                if (x === 0xF) {
                    console.log('OKAY2');
                }
                pc += 2;
            }
            break;
        case 0x5:
            if (registers[x] === registers[y]) {
                pc += 2;
            }
            break;
        case 0x6:
            registers[x] = nn;
            break;
        case 0x7:
            registers[x] += nn;
            break;
        case 0x8:
            switch (n) {
                case 0x0:
                    registers[x] = registers[y];
                    break;
                case 0x1:
                    registers[x] = registers[x] | registers[y];
                    break;
                case 0x2:
                    registers[x] = registers[x] & registers[y];
                    break;
                case 0x3:
                    registers[x] = registers[x] ^ registers[y];
                    break;
                case 0x4:
                    var result = registers[x] + registers[y];
                    if (result > 0xFF) {
                        registers[0xF] = 1;
                    }
                    else {
                        registers[0xF] = 0;
                    }
                    registers[x] = result;
                    break;
                case 0x5:
                    var result = registers[x] - registers[y];
                    if (result < 0x0) {
                        registers[0xF] = 1;
                    }
                    else {
                        registers[0xF] = 0;
                    }
                    registers[x] = result;
                    break;
                case 0x6:
                    registers[0xF] = registers[x] & 0x1;
                    registers[x] = registers[x] >> 1;
                    break;
                case 0x7:
                    var result = registers[y] - registers[x];
                    if (result < 0x0) {
                        registers[0xF] = 1;
                    }
                    else {
                        registers[0xF] = 0;
                    }
                    registers[x] = result;
                    break;
                case 0xE:
                    registers[0xF] = (registers[x] >> 7) & 0x1;
                    registers[x] = registers[x] << 1;
                    break;
            }
            break;
        case 0x9:
            if (registers[x] !== registers[y]) {
                pc += 2;
            }
            break;
        case 0xA:
            i = nnn;
            break;
        case 0xB:
            pc = nnn + registers[0];
            break;
        case 0xC:
            registers[x] = Math.floor(Math.random() * 256) & nn;
            break;
        case 0xD:
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
                case 0x9E:
                    if (keyIsDown) {
                        if (registers[x] === currentKey) {
                            pc += 2;
                        }
                    }
                    break;
                case 0xA1:
                    if (keyIsDown) {
                        if (registers[x] !== currentKey) {
                            pc += 2;
                        }
                    }
                    break;
                break;
            }
            break;
        case 0xF:
            switch (nn) {
                case 0x07:
                    registers[x] = delayTimer;
                    break;
                case 0x0A:
                    console.log('waiting for input');
                    waitingForKey = function () {
                        console.log('key pressed');
                        registers[x] = currentKey;
                        running = true;
                        setTimeout(loop, 0);
                    };
                    running = false;
                    break;
                case 0x15:
                    delayTimer = registers[x];
                    break;
                case 0x18:
                    soundTimer = registers[x];
                    break;
                case 0x1E:
                    i += registers[x];
                    break;
                case 0x29:
                    i = registers[x] * 5;
                    break;
                case 0x33:
                    var temp = registers[x];
                    memory[i] = Math.floor(temp / 100);
                    temp -= memory[i] * 100;
                    memory[i+1] = Math.floor(temp / 10);
                    temp -= memory[i] * 10;
                    memory[i+2] = temp;
                    break;
                case 0x55:
                    var ii;
                    for (ii = 0; ii < registers[x]; ii ++) {
                        memory[i + ii] = registers[ii];
                    }
                    break;
                case 0x65:
                    var ii;
                    for (ii = 0; ii < registers[x]; ii ++) {
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

window.onload = function () {

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

    function finish() {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');
        loop();
    }

    var xhr = new XMLHttpRequest();
    var rom = '';
    var byt;

    xhr.overrideMimeType('text/plain; charset=x-user-defined');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
     ;      rom = xhr.responseText;
            for (i = 0; i < rom.length; i ++) {
                byt = rom.charCodeAt(i) & 0xFF;
                memory[0x200 + i] = byt;
            }
            finish();
        }
    };
    xhr.open('GET', 'roms/MAZE');
    xhr.send();
};