// Initialisation {{{1

// Get the version number.
import {version} from "./version.mjs";
import {moduleNames} from "./moduleNames.mjs";
import {makePulprogText} from "./pulprog.mjs";

// Name attributes of the radio button groups.
let inputNames = ["hmbc", "n15", "ci13", "c13", "h1"];

// Object containing every module. Keys are module names. Values are module objects
// (imported from the individual module files).
const allModules = new Map();

// Programmatically import backend modules {{{1
function loadAllBackendModules() {
    // then import all of them, adding them to the allModules map.
    let promises = [];
    for (let module of moduleNames) {
        let p = import(`./modules/${module}.mjs`);
        p.then(obj => allModules.set(module, obj.default))
            .catch(error => console.log(`${module} not found`));
        promises.push(p);
    }
    return promises;
}
const promises = loadAllBackendModules();


// Get selected modules from HTML and convert to backend modules {{{1
function getChosenFrontendModules() {
    /* Get an array of strings (the radio button IDs) corresponding to the modules
     * selected by the user (the 'frontend modules'). */
    return inputNames.map(inputName => document.querySelector(`input[name="${inputName}"]:checked`).id);
}

function getChosenBackendModules(frontendModules) {
    /* Based on the user inputs, selects the appropriate backend modules for constructing
     * the pulse programme.
     * This takes care of a few aspects where the exact pulse sequence chosen depends on
     * what other modules are present in the sequence. In particular:
     *   - The presence of 13C and/or 15N zz-filters in the HMBC module depends on the
     *     subsequent modules.
     *   - The 15N seHSQC and 13C seHSQC depend on whether bulk magnetisation is required
     *     for subsequent modules. If it is not required, then we use the Bruker standard
     *     instead of the modified one with a reverse zz-filter.
     *   - The 13C HSQC-TOCSY uses the Bruker standard if it is the last experiment in the
     *     sequence, i.e. no further 13C HSQC or 1H module after it.
     *   - The INEPT excitation in the 13C HSQC-TOCSY is disabled if there is no further 
     *     13C module after it.
     *     */
    // Get array of non-none modules
    let validModules = frontendModules.filter(elem => !elem.includes("none"));
    // Return early if none were selected
    if (validModules.length == 0) return [];
    // If devmode is enabled, then we are (mostly) done, since the input IDs are already
    // the correct names of the backend modules. We just need to capitalise the 1H module.
    if (document.getElementById("devmode_button").checked) {
        if (validModules[validModules.length - 1].startsWith("h1")) {
            // replace the last element
            validModules.push(validModules.pop().replace("h1", "h").toUpperCase());
        }
        return validModules;
    }
    // Otherwise we need to do some logic...
    // Figure out which type of modules are present
    const nModulePresent = (validModules.findIndex(elem => elem.includes("n15")) !== -1);
    const c1ModulePresent = (validModules.findIndex(elem => elem.includes("ci13")) !== -1);
    const c2ModulePresent = (validModules.findIndex(elem => elem.includes("c13")) !== -1);
    const cModulePresent = (c1ModulePresent || c2ModulePresent);  // any 13C module
    const hModulePresent = (validModules.findIndex(elem => elem.includes("h1")) !== -1);
    // Initialise empty array of backend modules
    let backendModules = [];
    // Iterate over valid modules
    for (let module of validModules) {

        // Deal with HMBC module
        if (module.startsWith("hmbc")) {
            if (nModulePresent) backendModules.push("C_HMBC_CNF");
            else if (cModulePresent) backendModules.push("C_HMBC_CF");
            else backendModules.push("C_HMBC_NOF");
        }
        // Deal with N15 module
        else if (module.startsWith("n15")) {
            if (module === "n15_hmqc") backendModules.push("N_HMQC");
            else if (module === "n15_sehsqc") {
                if (cModulePresent || hModulePresent) backendModules.push("N_SEHSQC");
                else backendModules.push("N_SEHSQC_OR");   // Original CRK seHSQC
            }
        }
        // Deal with first C13 module (the one with variable INEPT excitation)
        else if (module.startsWith("ci13")) {
            if (module === "ci13_hsqc_tocsy") {
                // HSQC-TOCSY module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent) backendModules.push("CI_HSQC_TOCSY");
                else backendModules.push("C_HSQC_TOCSY");
            }
            else if (module === "ci13_hsqc") {
                // HSQC module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent) backendModules.push("CI_HSQC");
                else backendModules.push("C_HSQC");
            }
            else if (module === "ci13_hsqc_cosy") {
                // HSQC-COSY module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent) backendModules.push("CI_HSQC_COSY");
                else backendModules.push("C_HSQC_COSY");
            }
            else if (module === "ci13_hsqc_f2j") {
                // F2-coupled HSQC module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent) backendModules.push("CI_HSQC_F2J");
                else backendModules.push("C_HSQC_F2J");
            }
        }
        // Deal with second C13 module (without variable INEPT excitation)
        else if (module.startsWith("c13")) {
            // The only logic here is with the seHSQC variants: if a 1H module is present
            // then we use the ZIP-seHSQC version, if not then we can use CRK versions.
            if (module === "c13_hsqc") backendModules.push("C_HSQC");
            else if (module === "c13_sehsqc") {
                backendModules.push(hModulePresent ? "C_SEHSQC" : "C_SEHSQC_OR");
            }
            else if (module === "c13_hsqc_f2j") backendModules.push("C_HSQC_F2J");
            else if (module === "c13_hsqc_cosy") backendModules.push("C_HSQC_COSY");
            else if (module === "c13_hsqc_tocsy") backendModules.push("C_HSQC_TOCSY");
            else if (module === "c13_sehsqc_tocsy") {
                backendModules.push(hModulePresent ? "C_SEHSQC_TOCSY" : "C_SEHSQC_TOCSY_OR");
            }
        }
        // Deal with H1 module
        // There's no logic to deal with here, so we can save ourselves the tedium of manually
        // defining modules by using a convention where frontend module h1_xxx maps to backend
        // module H_XXX.
        else if (module.startsWith("h1")) {
            backendModules.push(module.replace("h1", "h").toUpperCase())
        }
    }
    return backendModules;
}


// Add website behaviour (e.g. textarea, devmode, reset, FAQ) {{{1

function updatePulprogText() {
    /* Function which updates the pulse programme text.
     * This is triggered whenever a module is selected. */
    // First, get array of frontend and backend modules
    let frontendModules = getChosenFrontendModules();
    const backendModules = getChosenBackendModules(frontendModules);
    // Change the pulprog text accordingly
    if (backendModules.length > 0) {
        let ppText;
        try { ppText = makePulprogText(backendModules, allModules); }
        catch (error) { console.error(error); ppText = ""; }
        document.getElementById("pulprog_text").value = ppText;
    }
    else {
        document.getElementById("pulprog_text").value = "";
    }
}

function toggleDevMode() {
    /* Enable or disable developer mode depending on the state of devmode_button. */
    // get state of button.
    const on = document.getElementById("devmode_button").checked;
    const uls = [...document.querySelectorAll("div.chooser_modules>ul")];
    // change the number of rows in each box
    // it turns out we don't need this (for now), but if we implement new things such
    // as 15N HMBC, we may need to adjust the number of rows in each box to avoid
    // things getting too large.
    // for (let ul of uls) {
    //     ul.style.gridTemplateRows = on ? "repeat(6, 30px)" : "repeat(6, 30px)";
    // }
    // iterate over classes of experiments, except for 1H, which doesn't need to be
    // toggled since nondevmode and devmode use the same inputs.
    for (let ul of uls.slice(0, -1)) {
        // iterate over each list item.
        for (let li of ul.children) {
            const radioID = li.children[0].id;
            if (radioID.includes("none")) {
                // 'none' button, must always be displayed
                li.style.display = "block";
            }
            else if (radioID[0] == radioID[0].toUpperCase()) {
                // ID is a capitalised one, i.e. only for dev mode
                li.style.display = on ? "block" : "none";
            }
            else {
                // ID is not a capitalised one, i.e. only outside of dev mode
                li.style.display = on ? "none" : "block";
            }
        }
    }
    // make the font size smaller if devmode is enabled
    for (let ul of uls.slice(0, -1)) {
        for (let li of ul.children) {
            if (!(li.children[0].id.includes("none"))) {
                li.style.fontSize = on ? "14px" : "inherit";
            }
        }
    }
    resetButtons();
    setModuleListLengths();
}

// Add toggle behaviour to the devmode button
document.getElementById("devmode_button").addEventListener("click", toggleDevMode);
// Call toggleDevMode() once upon page load so that the grid is styled correctly.
toggleDevMode();

// These are the module buttons, which need to call updatePulprogText().
for (let inputName of inputNames) {
    let buttons = document.querySelectorAll(`input[name="${inputName}"]`);
    for (let button of buttons) {
        button.addEventListener("click", updatePulprogText);
    }
}

// Reset button.
function resetButtons() {
    let noneButtonIDs = ["hmbc_none", "n15_none", "ci13_none", "c13_none", "h1_none"]
    for (let id of noneButtonIDs) {
        document.getElementById(id).checked = true;
    }
    updatePulprogText();
}
document.getElementById("reset_button").addEventListener("click", resetButtons);

// FAQ button.
function goToFAQ(){
    window.location.href = "#faq_h2";
}
document.getElementById("faq_button").addEventListener("click", goToFAQ);

// Download button.
function savePPFile() {
    const ppText = document.getElementById("pulprog_text").value;
    if (ppText.length > 0) {
        // use application/octet-stream to stop browsers from adding an extension
        const ppBlob = new Blob([ppText], {type: "application/octet-stream"});
        // replace this with below
        const ppFilename = ppText.split("\n")[0].slice(1).trim();
        // make a dummy link to click
        let link = document.createElement("a");
        link.download = ppFilename;
        link.href = window.URL.createObjectURL(ppBlob);
        link.style.display = "none";
        document.body.appendChild(link);
        // click it and remove it
        link.click();
        document.body.removeChild(link);
    }
}
document.getElementById("download_button").addEventListener("click", savePPFile);


// Automatically generate the links to the newest scripts, based on the version number.
function createScriptDownloadLinks() {
    let anchors = [...document.querySelectorAll("a.scripts")];
    for (let a of anchors) {
        a.setAttribute("href", `downloads/noah_scripts_v${version}.zip`);
    }
}
createScriptDownloadLinks();


// Style and display the page {{{1

// Function which sets grid-template-rows of each module selector box
// to be equal to the number of visible items -- except for the 1H box
// which is manually set to be 8 items long via CSS.
function setModuleListLengths() {
    let uls = [...document.querySelectorAll("div.chooser_modules:not(.h1)>ul")];
    let lengths = uls.map(ul => [...ul.children].filter(li => li.style.display != "none").length);
    uls.forEach(function (ul, i) {
        ul.style.gridTemplateRows = `repeat(${lengths[i]}, auto)`;
    });
}
setModuleListLengths();

function displayPage() {
    document.getElementById("spinner-container").style.display = "none";
    document.getElementById("main-wrapper").style.display = "block";
    document.getElementById("version").innerHTML = version;
}
Promise.all(promises).then(displayPage);
// }}}1
// vim: foldmethod=marker
