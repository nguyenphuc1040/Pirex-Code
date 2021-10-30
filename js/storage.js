const storage = require('electron-json-storage');
const os = require('os')
const { remote  } = require("electron");
const fs = require('fs');
const { webFrame } = require('electron')

const storagePath = storage.getDataPath();

defaultSettingData = {
    "editorFontFamily": "'Consolas', 'Courier New', monospace",
    "editorThemeMode": "dark",
    "editorFontSize": "15px",
    "editorLineHeight": "23px",
    "editorZoom" : "0",
    "editorKeybinding" : 'Prex Code',
  }
// storage.clear();
storage.has('setting', function(error, hasKey) {
    if (error) throw error;
  
    if (hasKey) {
        renderSetting();
        fs.watch(storagePath+"\\setting.json", function (event, filename) {
            if (event === 'change') {
                renderSetting();
            }
        });
    } else {
        storage.set('setting', {} , function(error) {
            if (error) throw error;
            writeSettingJson(defaultSettingData);
        });  
        changeEditorStyle(defaultSettingData);     
    }
});
// render follow setting.json
function renderSetting(){
    var data = storage.getSync('setting');
    changeEditorStyle(data); 
}

// write setting.json 
function writeSettingJson(data){
    fs.writeFile(storagePath + "\\setting.json", JSON.stringify(data,null,2) , function(err) {
        if(err) {
            return console.log(err);
        } 
        if(data===defaultSettingData) {
            fs.watch(storagePath+"\\setting.json", function (event, filename) {
                if (event === 'change') {
                    renderSetting();
                }
            });
        }
    });    
}
// Listner file setting.json is change

function onChangeTheme(){
    var data = storage.getSync('setting');
    if (data.editorThemeMode==='dark'){
        data.editorThemeMode = 'light';
    } else {
        data.editorThemeMode = 'dark';
    }
    writeSettingJson(data);
    changeEditorStyle(data);
}
function changeEditorStyle(data){
    // Theme mode 
    var theme = data.editorThemeMode;
    changeRootColorApp(theme);
    for (var i=1; i<=tabCount; i++) 
        if (tabEditor[i]!==null){
            if (theme==='dark') {
                editor.setTheme("ace/theme/one_dark");
            }
            else {
                editor.setTheme("ace/theme/one_light");
            }
        }
    // Font size, font family, line height In EDITOR
    document.documentElement.style.setProperty('--font-App', data.editorFontSize);
    document.documentElement.style.setProperty('--font-Family-App', data.editorFontFamily);
    document.documentElement.style.setProperty('--line-Height', data.editorLineHeight);

    webFrame.setZoomLevel(parseInt(data.editorZoom));
}

const rootColor = [
    '--color-gray',
    '--color-gray-text',
    '--color-tabbar-editor',
    '--color-gray-hover',
    '--color-gray-title',
    '--color-gray-element-title',
    '--color-gray-bottom',
    '--color-text-main',
    '--color-text-title',
    '--color-gray-toolbar',
    '--color-editor',
    '--color-hover-tab',
    '--color-scrollbar',
    '--color-scrollbar-hover'
]
const darkColor = [
    '#242526',
    'rgb(119, 119, 119)',
    '#1b1b1b',
    'rgb(189, 189, 189)',
    '#1b1b1b',
    'rgb(63, 63, 63)',
    '#161616',
    'rgb(153, 153, 153)',
    'white',
    '#1b1b1b',
    '#242526',
    '#2e2e2e',
    'rgb(53, 53, 53)',
    'rgba(116, 116, 116, 0.5)'
]
const lightColor = [
    '#ebebeb',
    'rgb(26, 26, 26)',
    '#e7e7e7',
    'rgb(114, 114, 114)',
    '#ffffff',
    'rgb(26, 26, 26)',
    '#bdbdbd',
    'rgb(22, 22, 22)',
    'rgb(22, 22, 22)',
    '#e7e7e7',
    'white',
    '#d1d1d1',
    'rgba(71, 71, 71, 0.247)',
    'rgba(92, 92, 92, 0.616)'
]

function changeRootColorApp(theme){
    if (theme==='dark'){
        rootColor.forEach((item,index) => {
            document.documentElement.style.setProperty(item,darkColor[index]);
        });

    } else {
        rootColor.forEach((item,index) => {
            document.documentElement.style.setProperty(item,lightColor[index]);
        });
    }
}
