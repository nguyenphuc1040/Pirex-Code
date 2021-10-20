// WINDOW SHORCUT KEY
var Mousetrap = require('mousetrap');

Mousetrap.bind(['ctrl+s'], function() {
    saveFile();
});
Mousetrap.bind(['ctrl+o'], function() {
    openFile();
});
Mousetrap.bind(['ctrl+-'], function() {
    zoomOut();
})
Mousetrap.bind(['ctrl+='], function() {
    zoomIn();
})
Mousetrap.bind(['ctrl+t'], function() {
    remote.shell.openPath('cmd.exe')
});

// EDITOR SHORCUT KEY
editor.commands.addCommand({
    name: "open",
    exec: function() {
        openFile()
    },
    bindKey: {mac: "ctrl-o", win: "ctrl-o"}
})
editor.commands.addCommand({
    name: "save",
    exec: function() {
        saveFile()
    },
    bindKey: {mac: "ctrl-s", win: "ctrl-s"}
})
editor.commands.addCommand({
    name: "terminal",
    exec: function() {
        remote.shell.openPath('cmd.exe')
    },
    bindKey: {mac: "ctrl-t", win: "ctrl-t"}
})
editor.commands.addCommand({
    name: "cmdbox",
    exec: function() {
    },
    bindKey: {mac: "ctrl-p", win: "ctrl-p"}
})

editor.commands.addCommand({
    name: "zoomOut",
    exec: function() {
        zoomOut();
    },
    bindKey: {mac: "ctrl--", win: "ctrl--"}
})
editor.commands.addCommand({
    name: "zoomIn",
    exec: function() {
        zoomIn();
    },
    bindKey: {mac: "ctrl-=", win: "ctrl-="}
})