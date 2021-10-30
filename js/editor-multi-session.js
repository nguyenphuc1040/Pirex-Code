
ace.require("ace/ext/language_tools");

// ace.require("ace/keybindings/vim");
var editor = ace.edit("editor");
const path = require('path')
var EditSession = ace.EditSession;

var editorDoc = document.getElementById('editor');
// editor.setKeyboardHandler("ace/keyboard/vim");
editor.setTheme("ace/theme/one_dark");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
    showLineNumbers: true,
    tabSize: 11
});
var pathTabText = document.getElementById('path-file-folder')

editor.renderer.setScrollMargin(0, window.innerHeight-140,0,20);

window.onresize = resizeEditor;
function resizeEditor(item,index){
    editor.renderer.setScrollMargin(0, window.innerHeight-140);
}

editor.setOptions({
    enableBasicAutocompletion: true
});
var tabCount = 0;
var tabCountUntitled = 0;
var tabExist = 0;
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
    remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),
        {properties: ['openFile']}
    ).then(result => {
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
        valueEditor[index] = data;
        setTimeout(function() {
            editor.setValue(data, -1);
            editor.getSession().setUndoManager(new ace.UndoManager())
        }, 0);
        pathTab[index] = path;
        editor.focus();
        editor.gotoLine(1);
        processFilePath(path,index);
        // watchFile(path,index,true);
        fs.watch(path, function (event, filename) {
            if (event === 'change') {
                fs.readFile(path, 'utf8', (err,data)=>{
                    if (err){
                        console.error(err);
                        return
                    }
                    if (data!==valueEditor[index]){
                        valueEditor[index] = data;
                        editor.setSession(tabEditor[index]);
                        editor.session.setValue(data);
                        pathTab[index] = path;
                        changeToCurrentSession();
                    }
                    
                })
            }
        });
    })
}
function changeToCurrentSession(){
    editor.setSession(tabEditor[currentIndex]);
}
function saveFile(){    

    var data = editor.getValue();
    var index = currentIndex;
    if (data===valueEditor[currentIndex]) return;
    if (valueEditor[currentIndex]===undefined || valueEditor[currentIndex]==='') {
        remote.dialog.showSaveDialog(
            remote.getCurrentWindow(),
            {properties: ['openFile']}
        ).then(result => {
            if (!result.canceled){
                var path = result.filePath;
                fs.writeFile(path, data , function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    editor.focus();
                    tabSavePoint[currentIndex].style.background = 'transparent';
                    valueEditor[currentIndex] = data;
                    pathTab[currentIndex] = path;
                    processFilePath(path,currentIndex);
                    fs.watch(path, function (event, filename) {
                        console.log(path);
                        if (event === 'change') {
                            fs.readFile(path, 'utf8', (err,data)=>{
                                if (err){
                                    console.error(err);
                                    return
                                }
                                if (data!==valueEditor[index]){
                                    valueEditor[index] = data;
                                    editor.setSession(tabEditor[index]);
                                    editor.session.setValue(data);
                                    pathTab[index] = path;
                                    changeToCurrentSession();
                                }
                                
                            })
                        }
                    });
                }); 
                
            }   
            editor.focus();
            
        }).catch(err => {
            editor.focus();
        })
    } else {
        fs.writeFile(pathTab[currentIndex], data , function(err) {
            if(err) {
                return console.log("error");
            }
            tabSavePoint[currentIndex].style.background = 'transparent';
            valueEditor[currentIndex] = data;
        }); 
    }
    
}
// Set title name and program language
var fileNameTitle = "";

var programLangText = {
    ".js" : "{} JavaScript",
    ".cs" : " CSharp ",
    ".jsx" : "{} JavaScript",
    ".ts" : "{} TypeScript",
    ".tsx" : "{} TypeScript",
    ".cpp" : " C/C++ ",
    ".c" : " C/C++ ",
    ".json" : " Json ",
    ".py" : " Python ",
    ".dart" : " Dart ",
    ".html" : " HTML ",
    ".fxml" : " FXML ",
    ".xml" : " xml ",
    ".css" : " CSS ",
    ".php" : " PHP ",
    ".svg" : " HTML ",
    ".sql" : " SQL ",
}
var programLangMode = {
    ".js" : "javascript",
    ".cs" : "c_cpp",
    ".jsx" : "jsx",
    ".ts" : "typescript",
    ".tsx" : "tsx",
    ".cpp" : "c_cpp",
    ".c" : "c_cpp",
    ".json" : "json",
    ".py" : "python",
    ".dart" : "dart",
    ".html" : "html",
    ".css" : "css",
    ".php" : "php",
    ".svg" : "html",
    ".fxml" : "html",
    ".xml" : " html",
    ".sql" : "sql" ,
}

function processFilePath(pathFile,index,tabPress = false){
    if (pathFile===undefined || pathFile===null) return;
    fileNameTitle = path.basename(pathFile);
    titleNameFile.textContent = fileNameTitle + " - Prex Code";
    if (pathFile.indexOf(':')!==-1) pathTabText.textContent = '\t'+ pathFile.replaceAll('\\','>');
        else pathTabText.textContent = '>_';
    if (!tabPress) tabName[index].textContent = fileNameTitle;
    changeExtFile(pathFile,tabPress);
}

function changeExtFile(pathFile,tabPress = false) { 
    const lang = path.extname(pathFile);
    if (programLangText[lang]===undefined){
        programLang.textContent = "Plain Text";
        if (!tabPress) editor.session.setMode("ace/mode/text");
    } else {
        programLang.textContent = programLangText[lang];
        if (!tabPress) editor.session.setMode("ace/mode/" + programLangMode[lang]);
    }
}


function newFile(path){
    var isExist = false;
    pathTab.forEach((item,index) => {
        if (item===path && item!==null) {
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

var cursorText = document.getElementById("position-cursor-editor");
function getLnCol(){
    cursorText.textContent = "Ln "+ (editor.selection.getCursor().row+1) + ", Col " + (editor.selection.getCursor().column+1);
}
function checkChangeValue(i){
    if (editor.getValue()!==valueEditor[i]) tabSavePoint[i].style.backgroundColor = "#999999"; else tabSavePoint[i].style.backgroundColor = "transparent";
}
const parentE = document.getElementById("code-editor");
function newTab(path){
    if (tabExist===0) disableEditor(false);
    tabExist ++;
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

    // CREATE SAVE POINT 
    var savePoint = document.createElement('div');
    savePoint.classList.add("save-point");
    tab.appendChild(savePoint);
    tabSavePoint[i] = savePoint;
    savePoint.style.backgroundColor = "transparent";
 
    // NEW EDITOR
    var editorN = new EditSession("");
    editor.setSession(editorN);
    tabEditor[i] = editorN;
    if (path!==null) {
        readFile(path,i);
        
    } else {
        processFilePath(pathTab[i],i)
        valueEditor[i] = '';
        setTimeout(function() {
            editor.setValue(valueEditor[i], -1);
            editor.getSession().setUndoManager(new ace.UndoManager())
        }, 0);
    }
    editor.session.setMode("ace/mode/text");
    editor.session.selection.on('changeCursor', function(e) {
        getLnCol();
    });
    editor.session.on('change', function(delta) {
        hightLight();
        checkChangeValue(i);
    });

    

    tab.addEventListener("mouseup", function(e){
        e.preventDefault();
        if (e.button==1) closeTab(tab,i);
        if (e.button==0) {  activeEditor(tab,editorN,i);}
    })
    tab.addEventListener("dblclick", function(e){
        e.preventDefault();
        if (e.button==0) {  closeTab(tab,i);}
    })
    activeEditor(tab,editorN,i);
    
}

function activeEditor(t,e,i){
    if (i===currentIndex) return;
    processFilePath(pathTab[i],i,true);
    if (tabElement[i]!==undefined && tabElement[i]!==null) {
        editor.setSession(tabEditor[i]);
        tabElement[i].style.backgroundColor = "var(--color-editor)";
        
    }
    if (tabElement[currentIndex]!==null && tabElement[currentIndex]!==undefined) tabElement[currentIndex].style.backgroundColor = "var(--color-tabbar-editor)";
    currentEditor = e;
    currentTab = t;
    // editor.focus();
    currentIndex = i;
    getLnCol();
   
}
function closeTab(a,index,boo=false){
    tabExist--;
    a.remove();
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
    if (tabExist===0) disableEditor(true);
}
function disableEditor(isDis){
    editorDoc.style.display= isDis ? "none" : "block";
    pathTabText.textContent = '\t>_';
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
        changeDir(os.homedir())
    } else {
        changeDir(path.dirname(remote.process.argv[1]))
        newFile(remote.process.argv[1])
    }
}

parentE.addEventListener('dragover',function(event){
    event.preventDefault();
    parentE.style.opacity = '0.5';
},false);

parentE.addEventListener("dragleave", function(event) {
    event.preventDefault();
    parentE.style.opacity = '1';
}, false);

parentE.addEventListener('drop',function(event){
    event.preventDefault();
    for (let f of event.dataTransfer.files){
        newFile(f.path)
    }
    parentE.style.opacity = '1';
},false)

editorDoc.addEventListener('click',function(event){
    editorDoc.focus();
})

const scrollTabbarEditor = document.getElementById("tabbar-editor");

scrollTabbarEditor.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scrollTabbarEditor.scrollLeft += evt.deltaY;
});

const FocusEditor = () => {
    terminalInput.blur();
    editorDoc.focus();
}