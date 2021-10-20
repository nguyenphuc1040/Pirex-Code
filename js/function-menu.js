
function zoomIn(){
    if (webFrame.getZoomLevel()<=1){
        var wf = webFrame.getZoomLevel()+1;;
        webFrame.setZoomLevel(wf);
        var data = storage.getSync('setting');
        data.editorZoom = wf;
        writeSettingJson(data);
    }
}
function zoomOut(){
    if (webFrame.getZoomLevel() >= -2){
        var wf = webFrame.getZoomLevel()-1;
        webFrame.setZoomLevel(wf);
        var data = storage.getSync('setting');
        data.editorZoom = wf;
        writeSettingJson(data);
    }    
}
