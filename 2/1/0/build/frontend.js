import { makePulprogText } from "./pulprog.js";
import { version } from "./version.js";
// HTML elements
const inputNames = ["hmbc", "n15", "ci13", "c13", "h1"];
const devModeButton = document.getElementById("devmode_button");
const pulprogTextarea = document.getElementById("pulprog_text");
const manualInput = document.getElementById("manual-modules");
const noneButtons = ["hmbc_none", "n15_none", "ci13_none", "c13_none", "h1_none"]
    .map(id => document.getElementById(id));
// getSelectedButtons :: ButtonID[] {{{1
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
// getTrueModules :: ButtonID[] -> TrueModule[] {{{1
/**
 * Determine which 'true' modules to use, based on the IDs of the buttons that the user selected.
 *
 * @param {string[]} selectedButtons - The IDs of the checked buttons on the website.
 * @returns {string[]} The names of the modules to construct the pulse programme from.
 */
function getTrueModules(selectedButtons) {
    // Remove any selected "None" buttons.
    let modules = selectedButtons.filter(elem => !elem.includes("none"));
    return devModeButton.checked ? modules : simpleModulesToTrue(modules);
}
// }}}1
// simpleModulesToTrue :: SimpleModule[] -> TrueModule[] {{{1
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
function simpleModulesToTrue(simpleModules) {
    // Figure out which type of modules are present
    const nModulePresent = (simpleModules.findIndex(elem => elem.includes("n15")) !== -1);
    const c1ModulePresent = (simpleModules.findIndex(elem => elem.includes("ci13")) !== -1);
    const c2ModulePresent = (simpleModules.findIndex(elem => elem.includes("c13")) !== -1);
    const cModulePresent = (c1ModulePresent || c2ModulePresent); // any 13C module
    const hModulePresent = (simpleModules.findIndex(elem => elem.includes("h1")) !== -1);
    // Initialise empty array of backend modules
    let trueModules = [];
    // Iterate over modules. Note that by now the None buttons have been removed.
    for (let module of simpleModules) {
        // Deal with HMBC module
        if (module.startsWith("hmbc")) {
            if (nModulePresent)
                trueModules.push("C_HMBC_CNF");
            else if (cModulePresent)
                trueModules.push("C_HMBC_CF");
            else
                trueModules.push("C_HMBC_NOF");
        }
        // Deal with N15 module
        else if (module.startsWith("n15")) {
            if (module === "n15_hmqc")
                trueModules.push("N_HMQC");
            else if (module === "n15_sehsqc") {
                if (cModulePresent || hModulePresent)
                    trueModules.push("N_SEHSQC");
                else
                    trueModules.push("N_SEHSQC_OR"); // Original CRK seHSQC
            }
        }
        // Deal with first C13 module (the one with variable INEPT excitation)
        else if (module.startsWith("ci13")) {
            if (module === "ci13_hsqc_tocsy") {
                // HSQC-TOCSY module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent)
                    trueModules.push("CI_HSQCT");
                else
                    trueModules.push("C_HSQCT");
            }
            else if (module === "ci13_hsqc") {
                // HSQC module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent)
                    trueModules.push("CI_HSQC");
                else
                    trueModules.push("C_HSQC");
            }
            else if (module === "ci13_hsqc_cosy") {
                // HSQC-COSY module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent)
                    trueModules.push("CI_HSQCC");
                // if there is a H1 module we need to preserve bulk
                else if (hModulePresent)
                    trueModules.push("C_HSQCC");
                // otherwise we can use the best version with CLIP transfer
                else
                    trueModules.push("C_HSQCC_CLIP");
            }
            else if (module === "ci13_hsqc_f2j") {
                // F2-coupled HSQC module
                // if a second C13 module is present we need the modified INEPT block
                if (c2ModulePresent)
                    trueModules.push("CI_HSQCJ");
                else
                    trueModules.push("C_HSQCJ");
            }
        }
        // Deal with second C13 module (without variable INEPT excitation)
        else if (module.startsWith("c13")) {
            // The only logic here is with the seHSQC variants: if a 1H module is present
            // then we use the ZIP-seHSQC version, if not then we can use CRK versions.
            if (module === "c13_hsqc")
                trueModules.push("C_HSQC");
            else if (module === "c13_sehsqc") {
                trueModules.push(hModulePresent ? "C_SEHSQC" : "C_SEHSQC_OR");
            }
            else if (module === "c13_sehsqc_f2j") {
                trueModules.push(hModulePresent ? "C_SEHSQCJ" : "C_SEHSQCJ_OR");
            }
            else if (module === "c13_hsqc_f2j")
                trueModules.push("C_HSQCJ");
            else if (module === "c13_hsqc_cosy") {
                trueModules.push(hModulePresent ? "C_HSQCC" : "C_HSQCC_CLIP");
            }
            else if (module === "c13_hsqc_tocsy")
                trueModules.push("C_HSQCT");
            else if (module === "c13_sehsqc_tocsy") {
                trueModules.push(hModulePresent ? "C_SEHSQCT" : "C_SEHSQCT_OR");
            }
            else if (module === "c13_hmqc")
                trueModules.push("C_HMQC");
        }
        // Deal with H1 module
        // There's no real logic to deal with here, so we can just use a mapping. (In principle,
        // we could just do module.replace("h1", "h").toUpperCase(), but that would rely on an
        // unspoken convention that the non-devmode and devmode labels follow this pattern.)
        else if (module.startsWith("h1")) {
            const h1mapping = {
                "h1_cosy": "H_COSY",
                "h1_cosy_qf": "H_COSY_QF",
                "h1_clip_cosy": "H_CLIP_COSY",
                "h1_dqf_cosy": "H_DQFCOSY",
                "h1_tocsy": "H_TOCSY",
                "h1_noesy": "H_NOESY",
                "h1_roesy": "H_ROESY",
                "h1_roesy_ad": "H_ROESY_AD",
                "h1_cosy_roesy": "H_CORO",
                "h1_cosy_roesy_st": "H_CORO_ST",
                "h1_cosy_noesy": "H_CONO",
                "h1_cosy_noesy_st": "H_CONO_ST",
                "h1_cosy_tocsy": "H_COTO",
                "h1_cosy_tocsy_st": "H_COTO_ST",
                "h1_jres": "H_JRES",
                "h1_psyche_jres": "H_JRES_PS",
                "h1_psyche": "H_PSYCHE_SAP",
                "h1_tse_psyche": "H_PSYCHE_TSAP",
            };
            trueModules.push(h1mapping[module]);
        }
    }
    return trueModules;
}
// }}}1
// trueModulesToSimple :: TrueModule[] -> SimpleModule[]  {{{1
/**
 * From a list of 'true' modules, determine whether there exists a set of 'simple' modules which
 * correspond exactly to the true modules.
 *
 * @param {string[]} trueModules - The list of true modules to try to convert.
 * @returns {string[]} The simplified modules which correspond to trueModules. Empty if a suitable
 * set couldn't be found.
 */
function trueModulesToSimple(trueModules) {
    // We try to 'pluck off' the result one category at a time, i.e. HMBC module first, then 15N,
    // etc. If at the end we're left with some leftover modules, then this means that there *isn't*
    // a suitable combination of 'simple' modules.
    //
    // On top of that, we also perform a check to make sure that convertSimpleModules(final_result)
    // is equivalent to the input. This helps to prevent misidentification of variants (for example,
    // C_HMBC_CF + C_SEHSQC_DP should NOT correspond to HMBC + seHSQC, because HMBC + seHSQC would
    // ordinarily give seHSQC v2 not v1).
    let simpleModules = [];
    let trueModulesCopy = [...trueModules]; // for comparison later
    let classifiers = ["C_HMBC_", "N_", "CI_", "C_", "H_"];
    for (const [idx, cf] of classifiers.entries()) {
        if (trueModules.length == 0)
            break; // No more modules to check
        if (trueModules[0].startsWith(cf)) { // Pluck it off!
            let nextTrueModule = trueModules.shift();
            if (idx == 0) { // HMBC
                simpleModules.push("hmbc_hmbc");
            }
            else if (idx == 1) { // 15N
                const n15Mapping = {
                    "N_HMQC": "n15_hmqc",
                    "N_SEHSQC": "n15_sehsqc",
                    "N_SEHSQC_OR": "n15_sehsqc",
                    "N_SEHSQC_DP": "n15_sehsqc",
                };
                if (nextTrueModule in n15Mapping) {
                    simpleModules.push(n15Mapping[nextTrueModule]);
                }
            }
            else if (idx == 2) { // 13C-INEPT
                const ci13Mapping = {
                    "CI_HSQCT": "ci13_hsqc_tocsy",
                    "CI_HSQCC": "ci13_hsqc_cosy",
                    "CI_HSQCC_CLIP": "ci13_hsqc_cosy",
                    "CI_HSQCC_DSE": "ci13_hsqc_cosy",
                    "CI_HSQC": "ci13_hsqc",
                    "CI_HSQCJ": "ci13_hsqc_f2j",
                };
                if (nextTrueModule in ci13Mapping) {
                    simpleModules.push(ci13Mapping[nextTrueModule]);
                }
            }
            else if (idx == 3) { // 13C
                const c13Mapping = {
                    "C_HMQC": "c13_hmqc",
                    "C_HSQC": "c13_hsqc",
                    "C_HSQCJ": "c13_hsqc_f2j",
                    "C_HSQCC": "c13_hsqc_cosy",
                    "C_HSQCC_CLIP": "c13_hsqc_cosy",
                    "C_HSQCC_DSE": "c13_hsqc_cosy",
                    "C_HSQCT": "c13_hsqc_tocsy",
                    "C_SEHSQC": "c13_sehsqc",
                    "C_SEHSQC_OR": "c13_sehsqc",
                    "C_SEHSQC_DP": "c13_sehsqc",
                    "C_SEHSQCJ": "c13_sehsqc_f2j",
                    "C_SEHSQCJ_OR": "c13_sehsqc_f2j",
                    "C_SEHSQCT": "c13_sehsqc_tocsy",
                    "C_SEHSQCT_OR": "c13_sehsqc_tocsy",
                };
                if (nextTrueModule in c13Mapping) {
                    simpleModules.push(c13Mapping[nextTrueModule]);
                }
            }
            else if (idx == 4) { // 1H
                const h1Mapping = {
                    "H_COSY": "h1_cosy",
                    "H_COSY_QF": "h1_cosy_qf",
                    "H_CLIP_COSY": "h1_clip_cosy",
                    "H_DQFCOSY": "h1_dqf_cosy",
                    "H_TOCSY": "h1_tocsy",
                    "H_NOESY": "h1_noesy",
                    "H_ROESY": "h1_roesy",
                    "H_ROESY_AD": "h1_roesy_ad",
                    "H_CORO": "h1_cosy_roesy",
                    "H_CORO_ST": "h1_cosy_roesy_st",
                    "H_CONO": "h1_cosy_noesy",
                    "H_CONO_ST": "h1_cosy_noesy_st",
                    "H_COTO": "h1_cosy_tocsy",
                    "H_COTO_ST": "h1_cosy_tocsy_st",
                    "H_JRES": "h1_jres",
                    "H_JRES_PS": "h1_psyche_jres",
                    "H_PSYCHE_SAP": "h1_psyche",
                    "H_PSYCHE_TSAP": "h1_tse_psyche",
                };
                if (nextTrueModule in h1Mapping) {
                    simpleModules.push(h1Mapping[nextTrueModule]);
                }
            }
        }
    }
    // Check for leeftover 'true' modules that weren't parsed.
    if (trueModules.length > 0)
        return [];
    // Check that simpleModulesToTrue is indeed an inverse.
    if (simpleModulesToTrue(simpleModules).join(" ") !== trueModulesCopy.join(" "))
        return [];
    return simpleModules;
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
        for (let li of ul.children) {
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
    manualDiv.style.display = on ? "block" : "none";
    // Toggle pulprog placeholder text
    const textArea = document.getElementById("pulprog_text");
    if (devModeButton.checked) {
        textArea.placeholder = "Select one or more modules to generate pulse programme...";
    }
    else {
        textArea.placeholder = "Select two or more modules to generate pulse programme...";
    }
    // Final actions
    if (devModeButton.checked) {
        updateButtons();
    }
    else {
        const trueModules = manualInput.value.split(/\s+/).filter(m => m !== "");
        const simpleModuleNames = trueModulesToSimple(trueModules);
        if (simpleModuleNames.length > 0) {
            const buttons = simpleModuleNames
                .map(name => document.getElementById(name))
                .filter(Boolean);
            noneButtons.forEach(b => b.checked = true);
            buttons.forEach(b => b.checked = true);
        }
        else {
            resetButtons();
        }
    }
    setModuleGridRows();
    updatePulprogText();
}
// Add toggle behaviour to the devmode button
document.getElementById("devmode_button").addEventListener("click", toggleDevMode);
// Call toggleDevMode() once upon page load so that the grid is styled correctly.
toggleDevMode();
// }}}2
// Update manual-modules textbox when buttons are clicked {{{2
function updateManualModulesValue() {
    const moduleNames = getTrueModules(getSelectedButtons());
    manualInput.value = moduleNames.join(' ');
    updatePulprogText(); // see https://stackoverflow.com/q/42427606
}
for (let inputName of inputNames) {
    let buttons = document.querySelectorAll(`input[name="${inputName}"]`);
    for (let button of buttons) {
        button.addEventListener("click", updateManualModulesValue);
    }
}
// }}}2
// Update buttons when manual-modules textbox is changed {{{2
function updateButtons() {
    const moduleNames = manualInput.value.split(/\s+/).filter(m => m !== "");
    // select the correct buttons
    const buttons = moduleNames
        .map(name => document.getElementById(name))
        .filter(Boolean); // remove null elements
    noneButtons.forEach(b => b.checked = true); // reset any invalid elements
    buttons.forEach(b => b.checked = true);
}
manualInput.addEventListener('input', updateButtons);
// }}}2
// Update pulprog textarea when manual-modules textbox is changed {{{2
function updatePulprogText() {
    const moduleNames = manualInput.value
        .toUpperCase().split(/\s+/).filter(m => m !== "");
    if (moduleNames.length == 0) {
        pulprogTextarea.value = "";
        return;
    }
    let ppText;
    try {
        ppText = makePulprogText(moduleNames, devModeButton.checked, devModeButton.checked);
    }
    catch (error) {
        console.error(error);
        ppText = "";
    }
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
document.getElementById("reset_button").addEventListener("click", resetButtons);
// }}}2
// Download button {{{2
/**
 * Triggers a download for the pulse programme file.
 */
function savePPFile() {
    const ppText = document.getElementById("pulprog_text").value;
    if (ppText.length > 0 && ppText.startsWith("; ")) {
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
// Make devmode button and FAQ collapsibles accessible {{{2
let faqLabels = [...document.querySelectorAll("label.toggle-label"),
    ...document.querySelectorAll("label.devmode-label")];
faqLabels.forEach(label => {
    label.addEventListener('keydown', e => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            label.click();
        }
        ;
    });
});
// }}}2
// Set the length of the five module boxes {{{2
/**
 * Sets the grid-template-rows property of each module selector box to be equal
 * to the number of visible items -- except for the 1H box which is set to be
 * ceil((n_items - 1)/2) + 1.
 * set to be 8 items long via CSS.
 */
function setModuleGridRows() {
    let uls = [...document.querySelectorAll("div.chooser_modules>ul")];
    let nrows = uls.map(ul => [...ul.children].filter(li => li.style.display != "none").length);
    // manually adjust 1H box
    nrows[nrows.length - 1] = Math.ceil((nrows[nrows.length - 1] - 1) / 2) + 1;
    uls.forEach(function (ul, i) {
        ul.style.gridTemplateRows = `repeat(${nrows[i]}, auto)`;
    });
}
setModuleGridRows();
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
