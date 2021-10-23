
var Mousetrap = require('mousetrap');
// const os = require('os');
const electron = require("electron").remote;
const commands = require("./js/components/commands.class").cmdlist;
const spawn = require("child_process").spawn;
var shell_ = require('shelljs');
const { clipboard } = require('electron');
// UTILITY

// Entering a span element allows for styling
function span(classname, message_){
    return "<span class=\"" + classname + "\">" + message_ + "</span>"
}

function escapeHTML(html) {
    return html.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// END UTILITY

const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';

if (shell === "powershell.exe"){
    document.querySelector("title").append(" - Powershell");
}
else {
    document.querySelector("title").append(" - Bash");
}

const termwindow = $(".window");
const termwindow_ = document.querySelector(".window"); // This is here to get the clear command working

const pathdir = "["+ os.userInfo().username + "@" + os.hostname + "]";
const prompt_ = ">";

// Get online status (for external links)
let onlinestatus = navigator.onLine ? span("status-success", "Online" + "\n") : span("status-fail", "Offline" + "\n"); // gets whether app is online or not
let status = span("title", "Emulator Status: ") + onlinestatus;

// Get release version
let version = electron.app.getVersion();
let appversion = span("title", "Termello - v" + version);

var command = "";
const commandHistory = [''];
var historyIndex = 0;

function processcommand(){
    const args = command.split(" ");
    const typedCommand = commands.find(cmd => cmd.name === args[0]);
    args.shift();
        // Pass the command to the shell unless "clear" or "cd" is typed
    // Then execute the custom functions
    if (typedCommand == null){
        let child;
        if (shell === "powershell.exe"){
            child = spawn(shell, [command]);
        }
        else {
            child = spawn(command, {shell: true});
        }
        child.stdout.on("data",function(data){
            termwindow.append(escapeHTML(data.toString()) + "\n");
            termwindow_.scrollBy({
                top: termwindow_.scrollHeight,
                behavior: "smooth"
            })
        });
        child.stderr.on("data",function(data){
  
            termwindow.append(span("status-fail", escapeHTML(data.toString()) + "\n"));
            termwindow_.scrollBy({
                top: termwindow_.scrollHeight,
                behavior: "smooth"
            })
        });
        child.on("exit",function(){
            displayprompt();
        });
        child.stdin.end();
    }
    else {
        typedCommand.function(args);
        displayprompt();
    }

    // Add to command history and clean up
	commandHistory.splice(1, 0, command);
    command = "";
    historyIndex = 0;
    commandHistory[0] = '';
}

// Functions for displaying to the terminal

function appendcommand(str){
    termwindow.append(str);
    command += str;
}

function clearcommand(){
    if (command.length > 0){
        erase(command.length);
    }
}

function erase(n){
    command = command.slice(0, -n);
    termwindow.html(termwindow.html().slice(0, -n));
}
// End console functionality

const terminalInput = document.getElementById('terminal-input');
// Allows backspacing
terminalInput.addEventListener("keydown", (e) => {
    e = e || window.Event;
    const key = typeof e.which === "number" ? e.which : e.key;
    if (key == 8) {
        e.preventDefault();
        if (command !== "" && command !== "\n") {
            erase(1);
        }
        termwindow_.scrollBy({
                top: termwindow_.scrollHeight,
                behavior: "smooth"
            })
    }
    // Allows moving through command history
	if (key === 38 || key === 40) {
        e.preventDefault();
        // Move up or down the history
        // Up key
        if (key === 38) {
            if(historyIndex < commandHistory.length - 1) historyIndex++;
        } 
        // Down key
        else if (key === 40) {
            if(historyIndex > 0) historyIndex--;
        }

        // Get command and append it to the terminal
        const cmd = (historyIndex >= 0) ? commandHistory[historyIndex] : '';
        if (cmd != undefined) {
            clearcommand();
            appendcommand(cmd);
        }
        termwindow_.scrollBy({
            top: termwindow_.scrollHeight,
            behavior: "smooth"
        })
    }

    // Keys for copy and paste
    if (e.ctrlKey){
        switch (e.code){
            case "KeyC":
                clipboard.writeText(window.getSelection().toString());
        }
    }
    if (e.ctrlKey){
        switch (e.code){
            case "KeyV":
                appendcommand(clipboard.readText());
        }
    }
})

// Allows pasting with the "right" mouse button
terminalInput.addEventListener("mousedown", function(e){
    if (e.button === 2){
        appendcommand(clipboard.readText());
    }
})

// Allows typing
terminalInput.addEventListener("keypress", function(e){
    e = e || window.Event;
    let key = typeof e.which === "number" ? e.which : e.key;
    switch (key){
        case 13:
            termwindow.append("\n");
            if (command.trim().length !== 0){
                processcommand();
            }
            else {
                displayprompt();
            }
            termwindow_.scrollBy({
                top: termwindow_.scrollHeight,
                behavior: "smooth"
            })
            break;
        default:
            e.preventDefault();
            appendcommand(String.fromCharCode(key));
            commandHistory[0] = command;
            termwindow_.scrollBy({
                top: termwindow_.scrollHeight,
                behavior: "smooth"
            })
    }
})
// End typing

// Displays prompt
function displayprompt(){
    termwindow.append(span("pathdir", process.cwd()));
    termwindow.append(span("prompt", prompt_));
    termwindow_.scrollBy({
        top: termwindow_.scrollHeight,
        behavior: "smooth"
    })
}

// Some startup stuffs
function startterminal(){
    termwindow.append(span("title", "Running: " + shell + "\n"));
    displayprompt();
}

// startterminal();
terminalInput.addEventListener('click', function(e){
    terminalInput.focus();
    editorDoc.blur();
})

Mousetrap(terminalInput).bind(['ctrl+a'],function(e){
    e.preventDefault()
})


