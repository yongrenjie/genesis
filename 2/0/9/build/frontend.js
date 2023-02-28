import { version } from "./version.js";
import { makePulprogText } from "./pulprog.js";
import allModules from "./allModules.js";
const inputNames = ["hmbc", "n15", "ci13", "c13", "h1"];
const devModeButton = document.getElementById("devmode_button");
const pulprogTextarea = document.getElementById("pulprog_text");
// Function to determine which buttons are selected {{{1
/**
 * Obtain the IDs of the radio buttons that were selected by the user on the webpage.
 * @returns {string[]} The selected IDs.
 */
function getSelectedButtons() {
    /* Get an array of strings (the radio button IDs) corresponding to the modules
     * selected by the user (the 'frontend modules'). */
    return inputNames.map(inputName => document.querySelector(`input[name="${inputName}"]:checked`).id);
}
// }}}1
// Function to determine which modules to use {{{1
/**
 * Determine which modules to use, based on the IDs of the buttons that the user selected.
 *
 * This function is 'intelligent' in that it takes care of a few details where the exact
 * variant chosen depends on what other modules are present in the sequence. In particular:
 *
 * - The presence of 13C and/or 15N zz-filters in the HMBC module depends on the
 *   subsequent modules.
 * - The 15N seHSQC and 13C seHSQC depend on whether bulk magnetisation is required
 *   for subsequent modules. If it is not required, then we use the Bruker standard
 *   instead of the ZIP-seHSQC.
 * - Variable INEPT excitation is used in the first 13C module if there are two such
 *   modules.
 *
 * @param {string[]} selectedButtons - The IDs of the checked buttons on the website.
 * @returns {string[]} The names of the modules to construct the pulse programme from.
 */
function chooseModules(selectedButtons) {
    // Remove any selected "None" buttons.
    let validModules = selectedButtons.filter(elem => !elem.includes("none"));
    // Return early if none were selected
    if (validModules.length == 0)
        return [];
    // If devmode is enabled, then we are (mostly) done, since the input IDs are already
    // the correct names of the backend modules. We just need to capitalise the 1H module.
    if (devModeButton.checked) {
        const lastValidModule = validModules[validModules.length - 1];
        // replace the last element if it's a 1H element
        if (lastValidModule.startsWith("h1")) {
            validModules[validModules.length - 1] = lastValidModule.replace("h1", "h").toUpperCase();
        }
        return validModules;
    }
    // Otherwise we need to do some logic...
    // Figure out which type of modules are present
    const nModulePresent = (validModules.findIndex(elem => elem.includes("n15")) !== -1);
    const c1ModulePresent = (validModules.findIndex(elem => elem.includes("ci13")) !== -1);
    const c2ModulePresent = (validModules.findIndex(elem => elem.includes("c13")) !== -1);
    const cModulePresent = (c1ModulePresent || c2ModulePresent); // any 13C module
    const hModulePresent = (validModules.findIndex(elem => elem.includes("h1")) !== -1);
    // Initialise empty array of backend modules
    let backendModules = [];
    // Iterate over valid modules
    for (let module of validModules) {
        // Deal with HMBC module
        if (module.startsWith("hmbc")) {
            if (nModulePresent)
                backendModules.push("C_HMBC_CNF");
            else if (cModulePresent)
                backendModules.push("C_HMBC_CF");
            else
                backendModules.push("C_HMBC_NOF");
        }
        // Deal with N15 module
        else if (module.startsWith("n15")) {
            if (module === "n15_hmqc")
                backendModules.push("N_HMQC");
            else if (module === "n15_sehsqc") {
                if (cModulePresent || hModulePresent)
                    backendModules.push("N_SEHSQC");
                else
                    backendModules.push("N_SEHSQC_OR"); // Original CRK seHSQC
            }
        }
        // Deal with first C13 module (the one with variable INEPT excitation)
        else if (module.startsWith("ci13")) {
            if (module === "ci13_hsqc_tocsy") {
                // HSQC-TOCSY module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent)
                    backendModules.push("CI_HSQC_TOCSY");
                else
                    backendModules.push("C_HSQC_TOCSY");
            }
            else if (module === "ci13_hsqc") {
                // HSQC module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent)
                    backendModules.push("CI_HSQC");
                else
                    backendModules.push("C_HSQC");
            }
            else if (module === "ci13_hsqc_cosy") {
                // HSQC-COSY module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent)
                    backendModules.push("CI_HSQC_COSY");
                // if there is a H1 module we need to preserve bulk
                else if (hModulePresent)
                    backendModules.push("C_HSQC_COSY");
                // otherwise we can use the best version with CLIP transfer
                else
                    backendModules.push("C_HSQC_COSY_CLIP");
            }
            else if (module === "ci13_hsqc_f2j") {
                // F2-coupled HSQC module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent)
                    backendModules.push("CI_HSQC_F2J");
                else
                    backendModules.push("C_HSQC_F2J");
            }
        }
        // Deal with second C13 module (without variable INEPT excitation)
        else if (module.startsWith("c13")) {
            // The only logic here is with the seHSQC variants: if a 1H module is present
            // then we use the ZIP-seHSQC version, if not then we can use CRK versions.
            if (module === "c13_hsqc")
                backendModules.push("C_HSQC");
            else if (module === "c13_sehsqc") {
                backendModules.push(hModulePresent ? "C_SEHSQC" : "C_SEHSQC_OR");
            }
            else if (module === "c13_hsqc_f2j")
                backendModules.push("C_HSQC_F2J");
            else if (module === "c13_hsqc_cosy") {
                backendModules.push(hModulePresent ? "C_HSQC_COSY" : "C_HSQC_COSY_CLIP");
            }
            else if (module === "c13_hsqc_tocsy")
                backendModules.push("C_HSQC_TOCSY");
            else if (module === "c13_sehsqc_tocsy") {
                backendModules.push(hModulePresent ? "C_SEHSQC_TOCSY" : "C_SEHSQC_TOCSY_OR");
            }
        }
        // Deal with H1 module
        // There's no logic to deal with here, so we can save ourselves the tedium of manually
        // defining modules by using a convention where frontend module h1_xxx maps to backend
        // module H_XXX.
        else if (module.startsWith("h1")) {
            backendModules.push(module.replace("h1", "h").toUpperCase());
        }
    }
    return backendModules;
}
// }}}1
// Add page behaviour {{{1
// Dev mode {{{2
/** Enable or disable developer mode depending on the state of devmode_button.
 */
function toggleDevMode() {
    const on = devModeButton.checked;
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
// }}}2
// Update pulprog text when radio buttons are changed {{{2
/**
 * Updates the pulse programme textarea with the pulse programme corresponding
 * to the currently selected modules. If no modules are selected, or if fewer
 * than two modules are present, it empties the textarea (thereby resetting it
 * to its placeholder text).
 */
function updatePulprogText() {
    const moduleNames = chooseModules(getSelectedButtons());
    if (moduleNames.length > 0) {
        let ppText;
        try {
            ppText = makePulprogText(moduleNames, allModules, false);
        }
        catch (error) {
            console.error(error);
            ppText = "";
        }
        pulprogTextarea.value = ppText;
    }
    else {
        pulprogTextarea.value = "";
    }
}
for (let inputName of inputNames) {
    let buttons = document.querySelectorAll(`input[name="${inputName}"]`);
    for (let button of buttons) {
        button.addEventListener("click", updatePulprogText);
    }
}
// }}}2
// Reset button {{{2
function resetButtons() {
    let noneButtonIDs = ["hmbc_none", "n15_none", "ci13_none", "c13_none", "h1_none"];
    for (let id of noneButtonIDs) {
        document.getElementById(id).checked = true;
    }
    updatePulprogText();
}
document.getElementById("reset_button").addEventListener("click", resetButtons);
// }}}2
// Download button {{{2
/**
 * Triggers a download for the pulse programme file.
 */
function savePPFile() {
    const ppText = document.getElementById("pulprog_text").value;
    if (ppText.length > 0) {
        // use application/octet-stream to stop browsers from adding an extension
        const ppBlob = new Blob([ppText], { type: "application/octet-stream" });
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
// }}}2
// FAQ button {{{2
function goToFAQ() {
    window.location.href = "#faq_h2";
}
document.getElementById("faq_button").addEventListener("click", goToFAQ);
// }}}2
// Programmatically generate the FAQ table of contents {{{2
const toc = document.getElementById("faq_toc");
const dts = document.querySelectorAll("dl>dt");
for (let dt of dts) {
    let a = document.createElement("a");
    let text = document.createTextNode(dt.innerText);
    a.appendChild(text);
    a.href = `#${dt.id}`;
    let li = document.createElement("li");
    li.appendChild(a);
    toc.appendChild(li);
}
// }}}2
// Set the length of the five module boxes {{{2
/**
 * Sets the grid-template-rows property of each module selector box to be equal
 * to the number of visible items -- except for the 1H box which is manually
 * set to be 8 items long via CSS.
 */
function setModuleListLengths() {
    let uls = [...document.querySelectorAll("div.chooser_modules:not(.h1)>ul")];
    let lengths = uls.map(ul => [...ul.children].filter(li => li.style.display != "none").length);
    uls.forEach(function (ul, i) {
        ul.style.gridTemplateRows = `repeat(${lengths[i]}, auto)`;
    });
}
setModuleListLengths();
// }}}2
// Modify version number-dependent parts {{{2
// Update the version number on the page
document.getElementById("version").innerHTML = version;
/**
 * Automatically generates the links to the newest scripts, based on the
 * version number.
 */
function createScriptDownloadLinks() {
    let anchors = [...document.querySelectorAll("a.scripts")];
    for (let a of anchors) {
        a.setAttribute("href", `static/downloads/noah_scripts_v${version}.zip`);
    }
}
// Create the download link for the newest scripts
createScriptDownloadLinks();
// }}}2
// Display the page {{{2
document.getElementById("spinner-container").style.display = "none";
document.getElementById("main-wrapper").style.display = "block";
// }}}2
// }}}1
// vim: foldmethod=marker
