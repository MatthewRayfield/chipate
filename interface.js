window.onload = function () {
    var romSelector = document.getElementById('rom-selector'),
        loadButton  = document.getElementById('load-button'),
        startButton = document.getElementById('start-button'),
        stopButton  = document.getElementById('stop-button'),
        canvas      = document.getElementById('canvas'),
        emulator = chipate.quickSetup(canvas);

    loadButton.addEventListener('click', function () {
        var path = 'roms/' + romSelector.value;

        chipate.ajaxRom(path, function (rom) {
            emulator.loadRom(rom);
        });
    });

    startButton.addEventListener('click', function () {
        emulator.start();
    });

    stopButton.addEventListener('click', function () {
        emulator.stop();
    });
};
