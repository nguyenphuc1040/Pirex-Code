var Split = require('split-grid')
var containerCmd = document.getElementById("container-command-mask");
var containerInput = document.getElementById("container-command");
var editorContainer = document.getElementById("editor-container");
var TerminalEditor = document.getElementById('terminal-container');
var termIsShow = false;
var isStartup = true;
function openCmdBox(isShow){
    containerCmd.style.display = !isShow ? "none" : "block";
    containerInput.style.display = !isShow ? "none" : "block";
}

Split({
    columnGutters: [{
        track: 3,
        element: document.getElementById('divide-terminal-editor'),
    }],
})

function ChangeLinkTerminal(){
    if (isStartup) {
        isStartup = false;
        cdTerminal(true);
        editorContainer.style.gridTemplateColumns = '60px 0 1fr 10px 300px';
        termIsShow = true;
        return;
    }
    if (termIsShow){
        cdTerminal();
    } else {
        editorContainer.style.gridTemplateColumns = '60px 0 1fr 10px 300px';
        termIsShow = true;
    }
}

function cdTerminal(startup=false){
    if (!startup){
        command = "cd " + path.dirname(pathTab[currentIndex]);
        processcommand()
        command = "clear";
        processcommand()
    } else {
        startterminal()
    }
}

function CloseTerminal(){
    termIsShow = false;
    editorContainer.style.gridTemplateColumns = '60px 0 1fr 0 0';
    // code close is here
}

editorContainer.addEventListener("resize", function(e){
    e.preventDefault();
    console.log('ffff');
})
