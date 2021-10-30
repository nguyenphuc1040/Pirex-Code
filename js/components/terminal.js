 
var Mousetrap = require('mousetrap');
// const os = require('os');
const electron = require("electron").remote;
const commands = require("./js/components/commands.class").cmdlist;
const spawn = require("child_process").exec;
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

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';


const termwindow = $(".window");
const termwindow_ = document.querySelector(".window"); // This is here to get the clear command working

var command = "";
const commandHistory = [''];
var historyIndex = 0;
var isProcess = false;
var child;
var isClientEnter = false;
function changeDir(arg){
    shell_.cd(arg);
}
RunTerminal();
function RunTerminal(){
    child = spawn(shell);
    // child.stdout.pipe(process.stdout);
    // child.stdin.setEncoding ("utf8")
    child.stdout.setEncoding ("utf8")
    // child.stderr.setEncoding ("utf8")
    child.stdin.on('data', function(data){
        console.log(data);
    });
    
    child.stdout.on("data",function(data){
        termwindow.append(escapeHTML(data.toString()));
        termwindow_.scrollBy({
            top: termwindow_.scrollHeight,
            behavior: "smooth"
        })
    });
    child.stderr.on("data",(data)=>{
        
        termwindow.append(span("status-fail", escapeHTML(data.toString()) + "\n"));
        termwindow_.scrollBy({
            top: termwindow_.scrollHeight,
            behavior: "smooth"
        })
    });
    
    child.on("exit",function(){
        CloseTerminal(true);
    })
    
}

function processcommand(){
    if (command!== '') termwindow.append("\n");
    const args = command.split(" ");
    const typedCommand = commands.find(cmd => cmd.name === args[0]);
    args.shift();
    console.log(typedCommand);
    if (typedCommand == null){
        child.stdin.write(command+'\n');
    }
    else {
        if (typedCommand.name === 'cd') {
            child.stdin.write(command+'\n');
        } 
        typedCommand.function(args);
    }
    // // Add to command history and clean up
	commandHistory.splice(1, 0, command);
    command = "";
    historyIndex = 0;
    commandHistory[0] = '';
   
}

// Functions for displaying to the terminal

function appendcommand(str){
    termwindow.append(str);
    command += str;
    // processcommand()
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
    if (key === 8) {
        e.preventDefault();
        // appendcommand('\b')
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
        appendcommand(key)
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
            // termwindow.append("\n");
            // processcommand()
            isClientEnter = true;
            if (command.trim().length !== 0){
                processcommand();
            }
            else {
                processcommand();
                // displayprompt();
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


