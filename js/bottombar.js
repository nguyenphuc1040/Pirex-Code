function showItem(){
    remote.shell.showItemInFolder(pathTab[currentIndex]);
}

function resetZoom(){
    webFrame.setZoomLevel(0);
    var data = storage.getSync('setting');
    data.editorZoom = 0;
    writeSettingJson(data);
}

function openCommand(){
    remote.shell.openPath('cmd.exe');
 }
 