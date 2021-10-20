var containerCmd = document.getElementById("container-command-mask");
var containerInput = document.getElementById("container-command");

function openCmdBox(isShow){
    containerCmd.style.display = !isShow ? "none" : "block";
    containerInput.style.display = !isShow ? "none" : "block";
}