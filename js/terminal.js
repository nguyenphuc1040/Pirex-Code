const ipc = require("electron").ipcRenderer;
// const fitAddon = require('xterm-addon-fit');

// const term = new Terminal();
// // const fitAddon = new FitAddon();
// const fitAdd = new fitAddon.FitAddon();
// term.loadAddon(fitAdd)
// term.setOption('theme', {
//     background: "#1b1b1b",
//     foreground: "white",
// })
// term.setOption('fontSize',16)
// term.setOption('fontWeight','normal')
// term.setOption('fontFamily',"'Source Code Pro', monospace")

// // Open the terminal in #terminal-container
// term.open(document.getElementById('terminal'));

// // Make the terminal's size and geometry fit the size of #terminal-container
// // fitAddon.FitAddon.fit();
// fitAdd.fit();

// ipc.on("terminal.incomingData", (event, data) => {
//     term.write(data);
// });

// term.onData(e => {
//     ipc.send("terminal.keystroke", e);
// });

