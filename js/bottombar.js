function showItem(){
    remote.shell.showItemInFolder(pathTab[currentIndex]);
}

function resetZoom(){
    webFrame.setZoomLevel(-1);
    var data = storage.getSync('setting');
    data.editorZoom = -1;
    writeSettingJson(data);
}

function openCommand(){
    remote.shell.openPath('cmd.exe');
 }
 