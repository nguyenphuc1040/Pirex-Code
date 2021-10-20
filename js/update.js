const uaup = require('uaup-js');


//This is Optional
const defaultStages = {
    Checking: "Checking...", // When Checking For Updates.
    Found: "Update Available!",  // If an Update is Found.
    NotFound: "No Update Available.", // If an Update is Not Found.
    Downloading: "Downloading...", // When Downloading Update.
    Unzipping: "Installing...", // When Unzipping the Archive into the Application Directory.
    Cleaning: "Finalizing...", // When Removing Temp Directories and Files (ex: update archive and tmp directory).
    Launch: "Relaunching..." // When Launching the Application.
};

const updateOptions = {
    gitRepo: "Prex-Code", // [Required] Your Repo Name
    gitUsername: "nguyenphuc1040",  // [Required] Your GitHub Username.

    appName: "Prex-Code", //[Required] The Name of the app archive and the app folder.
    appExecutableName: "Prex Code.exe", //[Required] The Executable of the Application to be Run after updating.

    // progressBar: document.getElementById("download"), // {Default is null} [Optional] If Using Electron with a HTML Progressbar, use that element here, otherwise ignore
    label: document.getElementById("text-update-cheking"), // {Default is null} [Optional] If Using Electron, this will be the area where we put status updates using InnerHTML
    stageTitles: defaultStages, // {Default is defaultStages} [Optional] Sets the Status Title for Each Stage
};

