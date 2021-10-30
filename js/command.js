var Split = require('split-grid')
var containerCmd = document.getElementById("container-command-mask");
var containerInput = document.getElementById("container-command");
var editorContainer = document.getElementById("editor-container");
var terminalShell = document.getElementById('terminal-shell');
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
    FocusTerminal();
    if (isStartup) {
        ClearTerm();
        RunTerminal();
        isStartup = false;
        cdTerminal(true);
        editorContainer.style.gridTemplateColumns = '60px 0 1fr 10px 500px';
        termIsShow = true;
        return;
    }
    if (termIsShow){
        cdTerminal();
    } else {
        editorContainer.style.gridTemplateColumns = '60px 0 1fr 10px 500px';
        termIsShow = true;
    }
}
function ClearTerm(){
    termwindow_.textContent = "";
}
function cdTerminal(startup=false){
    if (!startup){
        changeDir(path.dirname(pathTab[currentIndex]));
        child.stdin.write("cd " + path.dirname(pathTab[currentIndex])+ '\n');
        ClearTerm();
    }
}

function CloseTerminal(exit = false){
    if (exit) isStartup = true;
    termIsShow = false;
    editorContainer.style.gridTemplateColumns = '60px 0 1fr 0 0px';
    // code close is here
}

editorContainer.addEventListener("resize", function(e){
    e.preventDefault();
    console.log('ffff');
})
const FocusTerminal = () => {
    terminalInput.focus();
    editorDoc.blur();
}

const FocusTerminalShell = () =>{
    terminalShell.focus();
}