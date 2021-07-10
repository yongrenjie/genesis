import allModules from "./allModules.js";
import { makePulprogText } from "./pulprog.js";
import { version } from "./version.js";

// HTML elements
const inputNames = ["hmbc", "n15", "ci13", "c13", "h1"];
const devModeButton = document.getElementById("devmode_button") as HTMLInputElement;
const pulprogTextarea = document.getElementById("pulprog_text") as HTMLTextAreaElement;
const manualInput = document.getElementById("manual-modules") as HTMLInputElement;
const noneButtons = ["hmbc_none", "n15_none", "ci13_none", "c13_none", "h1_none"]
    .map(id => document.getElementById(id) as HTMLInputElement);

// Type synonyms, to make function signatures more useful
type ButtonID = string;       // Generic button labels
type SimpleModule = string;   // Non-devmode button labels
type TrueModule = string;     // Devmode button labels, which correspond to the names of the NOAHModule objects

// getSelectedButtons :: ButtonID[] {{{1
/**
 * Obtain the IDs of the radio buttons that were selected by the user on the webpage.
 * @returns {string[]} The selected IDs.
 */
function getSelectedButtons(): ButtonID[] {
    /* Get an array of strings (the radio button IDs) corresponding to the modules
     * selected by the user (the 'frontend modules'). */
    return inputNames.map(inputName => document.querySelector(`input[name="${inputName}"]:checked`)!.id);
}
// }}}1

// getTrueModules :: ButtonID[] -> TrueModule[] {{{1
/**
 * Determine which 'true' modules to use, based on the IDs of the buttons that the user selected.
 *
 * @param {string[]} selectedButtons - The IDs of the checked buttons on the website.
 * @returns {string[]} The names of the modules to construct the pulse programme from.
 */
function getTrueModules(selectedButtons: ButtonID[]): TrueModule[] {
    // Remove any selected "None" buttons.
    let modules = selectedButtons.filter(elem => !elem.includes("none"));
    return devModeButton.checked ? modules : simpleModulesToTrue(modules);
}
// }}}1

// convertSimpleModules :: SimpleModule[] -> TrueModule[] {{{1
/**
 * Determine which 'true' modules to use, based on the IDs of the buttons that the user selected.
 *
 * This function is 'intelligent' in that it takes care of a few details where the exact
 * variant chosen depends on what other modules are present in the sequence. In particular:
 *
 * - The presence of 13C and/or 15N zz-filters in the HMBC module depends on the subsequent modules.
 *
 * - The 15N seHSQC and 13C seHSQC depend on whether bulk magnetisation is required for subsequent
 *   modules. If it is not required, then we use the Bruker standard instead of the ZIP-seHSQC.
 *
 * - Variable INEPT excitation is used in the first 13C module if there are two such modules.
 *
 * @param {string[]} selectedButtons - The IDs of the checked buttons on the website.
 * @returns {string[]} The names of the modules to construct the pulse programme from.
 */
function simpleModulesToTrue(simpleModules: string[]): string[] {
    // Figure out which type of modules are present
    const nModulePresent = (simpleModules.findIndex(elem => elem.includes("n15")) !== -1);
    const c1ModulePresent = (simpleModules.findIndex(elem => elem.includes("ci13")) !== -1);
    const c2ModulePresent = (simpleModules.findIndex(elem => elem.includes("c13")) !== -1);
    const cModulePresent = (c1ModulePresent || c2ModulePresent);  // any 13C module
    const hModulePresent = (simpleModules.findIndex(elem => elem.includes("h1")) !== -1);
    // Initialise empty array of backend modules
    let trueModules: TrueModule[] = [];
    // Iterate over valid modules
    for (let module of simpleModules) {

        // Deal with HMBC module
        if (module.startsWith("hmbc")) {
            if (nModulePresent) trueModules.push("C_HMBC_CNF");
            else if (cModulePresent) trueModules.push("C_HMBC_CF");
            else trueModules.push("C_HMBC_NOF");
        }
        // Deal with N15 module
        else if (module.startsWith("n15")) {
            if (module === "n15_hmqc") trueModules.push("N_HMQC");
            else if (module === "n15_sehsqc") {
                if (cModulePresent || hModulePresent) trueModules.push("N_SEHSQC");
                else trueModules.push("N_SEHSQC_OR");   // Original CRK seHSQC
            }
        }
        // Deal with first C13 module (the one with variable INEPT excitation)
        else if (module.startsWith("ci13")) {
            if (module === "ci13_hsqc_tocsy") {
                // HSQC-TOCSY module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent) trueModules.push("CI_HSQC_TOCSY");
                else trueModules.push("C_HSQC_TOCSY");
            }
            else if (module === "ci13_hsqc") {
                // HSQC module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent) trueModules.push("CI_HSQC");
                else trueModules.push("C_HSQC");
            }
            else if (module === "ci13_hsqc_cosy") {
                // HSQC-COSY module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent) trueModules.push("CI_HSQC_COSY");
                // if there is a H1 module we need to preserve bulk
                else if (hModulePresent) trueModules.push("C_HSQC_COSY");
                // otherwise we can use the best version with CLIP transfer
                else trueModules.push("C_HSQC_COSY_CLIP");
            }
            else if (module === "ci13_hsqc_f2j") {
                // F2-coupled HSQC module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent) trueModules.push("CI_HSQC_F2J");
                else trueModules.push("C_HSQC_F2J");
            }
        }
        // Deal with second C13 module (without variable INEPT excitation)
        else if (module.startsWith("c13")) {
            // The only logic here is with the seHSQC variants: if a 1H module is present
            // then we use the ZIP-seHSQC version, if not then we can use CRK versions.
            if (module === "c13_hsqc") trueModules.push("C_HSQC");
            else if (module === "c13_sehsqc") {
                trueModules.push(hModulePresent ? "C_SEHSQC" : "C_SEHSQC_OR");
            }
            else if (module === "c13_hsqc_f2j") trueModules.push("C_HSQC_F2J");
            else if (module === "c13_hsqc_cosy") {
                trueModules.push(hModulePresent ? "C_HSQC_COSY" : "C_HSQC_COSY_CLIP");
            }
            else if (module === "c13_hsqc_tocsy") trueModules.push("C_HSQC_TOCSY");
            else if (module === "c13_sehsqc_tocsy") {
                trueModules.push(hModulePresent ? "C_SEHSQC_TOCSY" : "C_SEHSQC_TOCSY_OR");
            }
        }
        // Deal with H1 module
        // There's no logic to deal with here, so we can save ourselves the tedium of manually
        // defining modules by using a convention where frontend module h1_xxx maps to backend
        // module H_XXX.
        else if (module.startsWith("h1")) {
            trueModules.push(module.replace("h1", "h").toUpperCase())
        }
    }
    return trueModules;
}
// }}}1

// Add page behaviour {{{1
// Dev mode toggle {{{2
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

    // Iterate over classes of experiments (which are ul's)
    for (let ul of uls) {
        // Iterate over every label
        for (let li of ul.children as HTMLCollectionOf<HTMLElement>) {
            const radioID = li.children[0].id;
            // 'None' button must always be displayed, and the font shouldn't change.
            if (radioID.includes("none")) {
                li.style.display = "block";
            }
            else {
                // Change visibility
                if (radioID[0] === radioID[0].toUpperCase()) {
                    li.style.display = on ? "block" : "none";
                }
                else {
                    // ID is not a capitalised one, i.e. only outside of dev mode
                    li.style.display = on ? "none" : "block";
                }
                // Change font size and font face.
                li.style.fontSize = on ? "16px" : "inherit";
                li.style.fontFamily = on ? "Inconsolata" : "inherit";
            }
        }
    }

    // if it's on, make the manual box visible
    const manualDiv = document.getElementById("manual-input");
    manualDiv!.style.display = on ? "block" : "none";
    // Final actions
    resetButtons();
    setModuleListLengths();
}
// Add toggle behaviour to the devmode button
document.getElementById("devmode_button")!.addEventListener("click", toggleDevMode);
// Call toggleDevMode() once upon page load so that the grid is styled correctly.
toggleDevMode();
// }}}2

// Update manual-modules textbox when buttons are clicked {{{2
function updateManualModulesValue() {
    const moduleNames = getTrueModules(getSelectedButtons());
    manualInput.value = moduleNames.join(' ');
    updatePulprogText();   // see https://stackoverflow.com/q/42427606
}
for (let inputName of inputNames) {
    let buttons = document.querySelectorAll(`input[name="${inputName}"]`);
    for (let button of buttons) {
        button.addEventListener("click", updateManualModulesValue);
    }
}
// }}}2
// Update buttons when manual-modules textbox is changed {{{2
function updateDevmodeButtons() {
    const moduleNames = manualInput.value.split(/\s+/).filter(m => m !== "");
    // select the correct buttons
    const buttons = moduleNames
        .map(name => document.getElementById(name) as HTMLInputElement)
        .filter(Boolean);  // remove null elements
    noneButtons.forEach(b => b.checked = true);   // reset any invalid elements
    buttons.forEach(b => b.checked = true);
}
manualInput.addEventListener('input', updateDevmodeButtons);
// }}}2
// Update pulprog textarea when manual-modules textbox is changed {{{2
function updatePulprogText() {
    const moduleNames = manualInput.value
        .toUpperCase().split(/\s+/).filter(m => m !== "");
    if (moduleNames.length == 0) {
        pulprogTextarea.value = "";
        return;
    }
    let ppText: string;
    try { ppText = makePulprogText(moduleNames, allModules, devModeButton.checked); }
    catch (error) { ppText = ""; }
    pulprogTextarea.value = ppText;
}
manualInput.addEventListener('input', updatePulprogText);
// }}}2

// Reset button {{{2
function resetButtons() {
    noneButtons.forEach(b => b.checked = true);
    updateManualModulesValue();
    updatePulprogText();
}
document.getElementById("reset_button")!.addEventListener("click", resetButtons);
// }}}2
// Download button {{{2
/**
 * Triggers a download for the pulse programme file.
 */
function savePPFile() {
    const ppText = (document.getElementById("pulprog_text") as HTMLTextAreaElement).value;
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
document.getElementById("download_button")!.addEventListener("click", savePPFile);
// }}}2
// FAQ button {{{2
function goToFAQ(){
    window.location.href = "#faq_h2";
}
document.getElementById("faq_button")!.addEventListener("click", goToFAQ);
// }}}2
// Programmatically generate the FAQ table of contents {{{2
const toc = document.getElementById("faq_toc");
const dts = document.querySelectorAll("dl>dt");
for (let dt of dts as NodeListOf<HTMLElement>) {
    let a = document.createElement("a");
    let text = document.createTextNode(dt.innerText);
    a.appendChild(text);
    a.href = `#${dt.id}`;
    let li = document.createElement("li");
    li.appendChild(a);
    toc!.appendChild(li);
}
// }}}2
// Set the length of the five module boxes {{{2
/**
 * Sets the grid-template-rows property of each module selector box to be equal
 * to the number of visible items -- except for the 1H box which is manually
 * set to be 8 items long via CSS.
 */
function setModuleListLengths() {
    let uls = [...document.querySelectorAll("div.chooser_modules:not(.h1)>ul")] as Array<HTMLElement>;
    let lengths = uls.map(ul => ([...ul.children] as Array<HTMLElement>).filter(li => li.style.display != "none").length);
    uls.forEach(function (ul, i) {
        ul.style.gridTemplateRows = `repeat(${lengths[i]}, auto)`;
    });
}
setModuleListLengths();
// }}}2
// Modify version number-dependent parts {{{2
// Update the version number on the page
document.getElementById("version")!.innerHTML = version;
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
document.getElementById("spinner-container")!.style.display = "none";
document.getElementById("main-wrapper")!.style.display = "block";
// }}}2
// }}}1

// vim: foldmethod=marker
