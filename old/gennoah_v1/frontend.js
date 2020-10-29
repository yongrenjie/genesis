import {generatePPText} from "./generatepp.js";

/* Initialise all radio buttons to being unchecked */
window.addEventListener("unload", function(event) {
    const Buttons = document.querySelectorAll('input[type="radio"]');
    for (const button of Buttons) {
        button.checked = false;
    }
});

/* Initialise placeholder pulprog text */
const ppPlaceHolder = "Pulse programme will be displayed here"
document.getElementById("pulprog").value = ppPlaceHolder;

/* Add event listeners to template radio buttons */
const templateButtons = document.querySelectorAll('input[name="template"]')
for (const templateButton of templateButtons) {
    templateButton.addEventListener("click", showExperiments);
}

/* Add event listeners to module radio buttons */
const moduleButtons = document.querySelectorAll('input[name="N_expt"], input[name="B_expt"], input[name="C_expt"], input[name="H_expt"]')
for (const moduleButton of moduleButtons) {
    moduleButton.addEventListener("click", displayPPText);
}


/* Add event listener to 'save to file' button */
document.getElementById("save_file").addEventListener("click", savePPFile);


/* Varies the modules offered in Step 2 */
function showExperiments() {
    // Clear the initial prompt
    document.getElementById("promptForTemplate").style.display = "none";
    // Clear the pulprog text
    document.getElementById("pulprog").value = ppPlaceHolder;

    // Get the template name and show/hide divs accordingly
    let templateName = document.querySelector('input[name="template"]:checked').value
    switch (templateName) {
        case "NCH":
            document.getElementById("N_select").style.display = "block";
            document.getElementById("B_select").style.display = "none";
            document.getElementById("C_select").style.display = "block";
            document.getElementById("H_select").style.display = "block";
            break;
        case "CH":
            document.getElementById("N_select").style.display = "none";
            document.getElementById("B_select").style.display = "none";
            document.getElementById("C_select").style.display = "block";
            document.getElementById("H_select").style.display = "block";
            break;
        case "BCH":
            document.getElementById("N_select").style.display = "none";
            document.getElementById("B_select").style.display = "block";
            document.getElementById("C_select").style.display = "block";
            document.getElementById("H_select").style.display = "block";
            break;
    }

    // Reset the selected status of the module buttons
    for (const moduleButton of moduleButtons) {
        moduleButton.checked = false;
    }
}


/* Checks if sufficient information has been specified to create a pulse programme. 
 * If yes, then returns [template, [module1, module2, ...]]. Else returns null. */
function getTemplateModules() {
    // Get the template name
    let templateButton = document.querySelector('input[name="template"]:checked');
    let templateName = "";
    if (templateButton) {
        templateName = templateButton.value;
    }
    else return null;

    // Look for the checked buttons in each input group
    let n_CheckedButton = document.querySelector('input[name="N_expt"]:checked');
    let b_CheckedButton = document.querySelector('input[name="B_expt"]:checked');
    let c_CheckedButton = document.querySelector('input[name="C_expt"]:checked');
    let h_CheckedButton = document.querySelector('input[name="H_expt"]:checked');

    // Main logic
    if (templateName == "NCH" && n_CheckedButton && c_CheckedButton && h_CheckedButton) {
        return ["NCH", [n_CheckedButton.value, c_CheckedButton.value, h_CheckedButton.value]];
    }
    else if (templateName == "CH" && c_CheckedButton && h_CheckedButton) {
        return ["CH", [c_CheckedButton.value, h_CheckedButton.value]];
    }
    else if (templateName == "BCH" && b_CheckedButton && c_CheckedButton && h_CheckedButton) {
        return ["BCH", [b_CheckedButton.value, c_CheckedButton.value, h_CheckedButton.value]];
    }
    else return null;
}


/* Display pulse programme text */
function displayPPText() {
    let templateModules = getTemplateModules();
    if (templateModules) {
        let pp = generatePPText(...templateModules);
        document.getElementById("pulprog").value = pp;
    }
}


/* Download current pulse programme as a file */
function savePPFile() {
    if (getTemplateModules()) {
        const ppText = document.getElementById("pulprog").value;
        // use application/octet-stream to stop browsers from adding an extension
        const ppBlob = new Blob([ppText], {type: "application/octet-stream"});
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
    else {
        alert("Please select a template and modules before downloading.")
    }
}


/* Display the div */
document.getElementById("main_section").style.display = "block";
