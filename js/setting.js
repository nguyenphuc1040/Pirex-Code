// Open setting.json
function settingJson(){
    storage.has('setting', function(error, hasKey) {
        if (error) throw error;
        if (hasKey) {
            newFile(storagePath+"\\setting.json");
        } else {
            writeSettingJson(defaultSettingData) ;    
        }
    });
}
 
var checking =  document.getElementById("update-bottom-checking");
var textUpdate = document.getElementById("text-update-cheking");
function updateApp(){
    let isUpdateAvalible = uaup.CheckForUpdates(updateOptions);
    checking.style.display = "flex";
    if(isUpdateAvalible){
        uaup.Update(updateOptions);
    } else {
        setTimeout(function(){
            textUpdate.textContent = "No Update Available";
            checking.style.display = "none";
        },5000)
    }
}
var updateCBB = document.getElementById("setting-mask");
function openSetting(isShow){
    updateCBB.style.display = !isShow ? "none" : "block";
}