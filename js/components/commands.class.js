var shell = require('shelljs');

//#region Command Functions
function cd(arg){
    shell.cd(arg[0]);
}

function cls(){
    termwindow_.textContent = "";
    child.stdin.write("\n");
}
//#endregion

//#region Commands
const commands = [
    {
    "name": "cd",
    "function": cd,
    "description": "Change to given directory. If no directory is given returns to current directory"
},
{
    "name": "cls",
    "function": cls,
    "description": "Clears the terminal"
},
];
//#endregion


exports.cmdlist = commands;