const fs = require('fs');
const storage = require('electron-json-storage');
const { webFrame } = require('electron')
const process = require('process');
const { remote  } = require("electron");
var tabCount = 0;
var tabCountUntitled = 0;
var currentEditor;
var currentTab;
var currentIndex;
var tabElement = [];
var tabEditor = [];
var pathTab = [];
var tabSavePoint = [];
var valueEditor = [];
var tabName = [];

var hightLightCursor = document.getElementById("cursor-hightlight");

//  Prevent Scroll Click Button
var container = document.getElementById("container");
container.addEventListener("mousedown", function(e){
    e.preventDefault();
})

// PROCESS TEXT EDITOR

var titleNameFile = document.getElementById("title-name-file");
var programLang = document.getElementById("program-language");

function openFile(){
    remote.dialog.showOpenDialog({
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled){
            newFile(result.filePaths[0]);
        }   

    }).catch(err => {
    })
}

function readFile(path,index){
    fs.readFile(path, 'utf8', (err,data)=>{
        if (err){
            console.error(err);
            return
        }
        var editor = ace.edit("editor"+index);
        editor.setValue(data);
        pathTab[index] = path;
        editor.focus();
        editor.gotoLine(1);
        valueEditor[index] = data;
        processFilePath(path,index);
    })
}
function saveFile(){    
    var editor = ace.edit('editor'+currentIndex);
    var data = editor.getValue();
    if (data===valueEditor[currentIndex]) return;
    if (valueEditor[currentIndex]===undefined) {
        remote.dialog.showSaveDialog({
            properties: ['openFile']
        }).then(result => {
            if (!result.canceled){
                fs.writeFile(result.filePath, data , function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    tabSavePoint[currentIndex].style.display = 'none';
                    valueEditor[currentIndex] = data;
                    pathTab[currentIndex] = result.filePath;
                    processFilePath(result.filePath,currentIndex);
             
                }); 
            }   
    
        }).catch(err => {
        })
    } else {
        fs.writeFile(pathTab[currentIndex], data , function(err) {
            if(err) {
                return console.log("error");
            }
            tabSavePoint[currentIndex].style.display = 'none';
            valueEditor[currentIndex] = data;
        }); 
    }
    
}

// Set title name and program language
var fileNameTitle = "";

var programLangText = {
    "js" : "{} JavaScript",
    "cs" : " CSharp ",
    "jsx" : "{} JavaScript",
    "ts" : "{} TypeScript",
    "tsx" : "{} TypeScript",
    "cpp" : " C/C++ ",
    "c" : " C/C++ ",
    "json" : " Json ",
    "py" : " Python ",
    "dart" : " Dart ",
    "html" : " HTML ",
    "css" : " CSS ",
    "php" : " PHP ",
    "svg" : " HTML ",
}
var programLangMode = {
    "js" : "javascript",
    "cs" : "csharp",
    "jsx" : "javascript",
    "ts" : "typescript",
    "tsx" : "typescript",
    "cpp" : "c_cpp",
    "c" : "c_cpp",
    "json" : "json",
    "py" : "python",
    "dart" : "dart",
    "html" : "html",
    "css" : "css",
    "php" : "php",
    "svg" : "html",
}

function processFilePath(path,index,tabPress = false){
    if (path===undefined) return;
    // split path file open
    const link = path.split('\\');
    // set title file name
    fileNameTitle = link[link.length-1];
    titleNameFile.textContent = fileNameTitle + " - Prex Code";
    if (!tabPress) {
        tabName[index].textContent = fileNameTitle;
    }
    // process and set program language
    const name = fileNameTitle.split('.');
    const lang = name[name.length-1];
    var editor = ace.edit("editor"+index);
    if (programLangText[lang]===undefined){
        programLang.textContent = "Plain Text";
        if(!tabPress) editor.session.setMode("ace/mode/text");
    } else {
        programLang.textContent = programLangText[lang];
        if(!tabPress) editor.session.setMode("ace/mode/" + programLangMode[lang]);
    }
}


function newFile(path){
    var isExist = false;
    pathTab.forEach((item,index) => {
        if (item===path) {
            activeEditor(tabElement[index],tabEditor[index],index)
            isExist = true;
            return;
        }
   
    });
    if (!isExist) {
        tabCount ++;
        if (path===null) tabCountUntitled ++;
        newTab(path);
    }
}
window.onresize = setScrollMarginAgain;
function setScrollMarginAgain(){
    tabEditor.forEach(resizeEditor);
}
function resizeEditor(item,index){
    if (item === null) return;
    var editor = ace.edit("editor"+index);
    editor.renderer.setScrollMargin(0, window.innerHeight-140);
}
var cursorText = document.getElementById("position-cursor-editor");
function getLnCol(i){
    var e = ace.edit("editor"+i);
    cursorText.textContent = "Ln "+ (e.selection.getCursor().row+1) + ", Col " + (e.selection.getCursor().column+1);
}
function checkChangeValue(i){
    var e = ace.edit("editor"+i);
    if (e.getValue()!==valueEditor[i]) tabSavePoint[i].style.display = "block"; else tabSavePoint[i].style.display = "none";
}
const parentE = document.getElementById("code-editor");
function newTab(path){
    var i = tabCount;
    // NEW BUTTON TAB
    var parent = document.getElementById("tabbar");
    // create tab-btn
    var tab = document.createElement("div");
    tab.classList.add("tab-btn");
    parent.appendChild(tab);
    var tabN = document.createElement("div");
    tab.appendChild(tabN);
    if (path===null) {
        pathTab[i] = "Untitled-" + tabCountUntitled;
        tabN.textContent = "Untitled-" + tabCountUntitled;
    }
        else {
            const name = path.split('\\');
            tabN.textContent = name[name.length-1];
        }
    tabName[i] = tabN;
    tabElement[i] = tab;
    // create btn-close-tab
    // var closebtn = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // closebtn.setAttribute("viewBox","0 0 24 24");
    // closebtn.setAttribute("fill","rgb(119, 119, 119)");
    // var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    // newElement.setAttribute("d","M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z")
    // closebtn.appendChild(newElement)
    // tab.appendChild(closebtn);
    
    // CREATE SAVE POINT 
    var savePoint = document.createElement('div');
    savePoint.classList.add("save-point");
    tab.appendChild(savePoint);
    tabSavePoint[i] = savePoint;
    savePoint.style.display = "none";
    // NEW EDITOR
  
    var editorE = document.createElement("div");
    editorE.classList.add("editor-code");
    editorE.setAttribute("id","editor" + i);
    parentE.appendChild(editorE);
    var editor = ace.edit("editor"+i);
    var dataStorage = storage.getSync('setting');
    editor.focus();
    editor.renderer.setScrollMargin(0, window.innerHeight-140,0,20);
    if (dataStorage.editorThemeMode==='dark') editor.setTheme("ace/theme/one_dark");
        else editor.setTheme("ace/theme/one_light");
    editor.session.setMode("ace/mode/text");
    editor.session.selection.on('changeCursor', function(e) {
        getLnCol(i);
        checkChangeValue(i);
        hightLight()
    });
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        autoScrollEditorIntoView: true,
        copyWithEmptySelection: true,
    });
    tabEditor[i] = editorE;
    if (path!==null)
    {
        readFile(path,i);
    }
    // closebtn.addEventListener("click",function() {closeTab(tab,editorE,i);} )
    tab.addEventListener("mouseup", function(e){
        e.preventDefault();
        if (e.button==1) closeTab(tab,editorE,i);
        if (e.button==0) {  activeEditor(tab,editorE,i);}
    })
    tab.addEventListener("dblclick", function(e){
        e.preventDefault();
        if (e.button==0) {  closeTab(tab,editorE,i);}
    })

    if (i===1) {
        currentIndex = 1; 
        currentTab = tab;
        currentEditor = editorE;
        currentTab.style.backgroundColor = "var(--color-editor)";
    }
    activeEditor(tab,editorE,i);
    // processFilePath(pathTab[i],editorE);
   
}
function activeEditor(t,e,i){
    if (i===currentIndex) return;

    processFilePath(pathTab[i],i,true);
    if (tabEditor[currentIndex]!==null){
        tabEditor[currentIndex].style.display = "none";
        tabElement[currentIndex].style.backgroundColor = "var(--color-tabbar-editor)";
    }
    tabEditor[i].style.display = "block";
    tabElement[i].style.backgroundColor = "var(--color-editor)";
    currentEditor = e;
    currentTab = t;
    var editor = ace.edit("editor"+i);
    editor.focus();
    currentIndex = i;
   
}
function closeTab(a,b,index,boo=false){
    a.remove();
    b.remove();
    tabElement[index] = null;
    tabEditor[index] = null;
    pathTab[index] = null;
    tabSavePoint[index] = null;
    valueEditor[index] = null;
    if (boo) return;
    if (index !== currentIndex) return;
    for (var i = tabCount; i>=0; i--) {
        if (tabElement[i]!==null) {
            activeEditor(tabElement[i],tabEditor[i],i);
            break;
        }
    }
   
}

function showItem(){
    remote.shell.showItemInFolder(pathTab[currentIndex]);
}
function hightLight(){
    hightLightCursor.style.background = "var(--color-theme)";
    setTimeout(function(){ hightLightCursor.style.background = "var(--color-gray)" }, 200);
}
fileStartup();
// File open start up
function fileStartup(){
    if (remote.process.argv[1]==='.' || remote.process.argv.length<2){
        newFile(null);
    } else {
        newFile(remote.process.argv[1])
    }
}

