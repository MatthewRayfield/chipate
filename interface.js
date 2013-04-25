window.onload = function () {
    var romSelector = document.getElementById('rom-selector'),
        loadButton  = document.getElementById('load-button'),
        startButton = document.getElementById('start-button'),
        stopButton  = document.getElementById('stop-button'),
        canvas      = document.getElementById('canvas'),
        statusLine  = document.getElementById('status-line'),
        debuggerBox = document.getElementById('debugger-box'),
        emulator = chipate.quickSetup(canvas),
        vdebugger = new chipate.VisualDebugger(debuggerBox);

    emulator.debugger = vdebugger;

    loadButton.addEventListener('click', function () {
        var path = 'roms/' + romSelector.value;

        statusLine.innerHTML = 'Loading ROM';

        chipate.ajaxRom(path, function (rom) {
            emulator.loadRom(rom);
            statusLine.innerHTML = 'ROM Loaded';
        });
    });

    startButton.addEventListener('click', function () {
        emulator.start();
        statusLine.innerHTML = 'Running';
    });

    stopButton.addEventListener('click', function () {
        emulator.stop();
        statusLine.innerHTML = 'Stopped';
    });
};
