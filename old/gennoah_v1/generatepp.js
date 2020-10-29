// Import templates and place in lookup object
import {NCH} from "./templates/NCH.js";
import {CH} from "./templates/CH.js";
import {BCH} from "./templates/BCH.js";
const allTemplates = {
    "NCH": NCH,
    "CH": CH,
    "BCH": BCH,
}

// Import modules and place in lookup object
import {N_M} from "./modules/N_M.js";
import {N_S} from "./modules/N_S.js";
import {N_Spv1} from "./modules/N_Spv1.js";
import {N_Spv2} from "./modules/N_Spv2.js";
import {C_B} from "./modules/C_B.js";
import {C_S} from "./modules/C_S.js";
import {C_Spv1} from "./modules/C_Spv1.js";
import {C_Spv2} from "./modules/C_Spv2.js";
import {C_Spv2ur} from "./modules/C_Spv2ur.js";
import {H_C} from "./modules/H_C.js";
import {H_Cqf} from "./modules/H_Cqf.js";
import {H_Cclip} from "./modules/H_Cclip.js";
import {H_D} from "./modules/H_D.js";
import {H_R} from "./modules/H_R.js";
import {H_Rad} from "./modules/H_Rad.js";
import {H_N} from "./modules/H_N.js";
import {H_T} from "./modules/H_T.js";
import {H_CN} from "./modules/H_CN.js";
import {H_CT} from "./modules/H_CT.js";
const allModules = {
    "N_M": N_M,
    "N_S": N_S,
    "N_Spv1": N_Spv1,
    "N_Spv2": N_Spv2,
    "C_B": C_B,
    "C_S": C_S,
    "C_Spv1": C_Spv1,
    "C_Spv2": C_Spv2,
    "C_Spv2ur": C_Spv2ur,
    "H_C": H_C,
    "H_Cqf": H_Cqf,
    "H_Cclip": H_Cclip,
    "H_D": H_D,
    "H_R": H_R,
    "H_Rad": H_Rad,
    "H_N": H_N,
    "H_T": H_T,
    "H_CN": H_CN,
    "H_CT": H_CT,
}
// Two-in-one modules.
const doubleModuleNames = ["H_CN", "H_CT"];

// Import parameter descriptions.
import {descriptions} from "./parameters.js"


/* Generates the actual pulprog text... */
export function generatePPText(templateName, moduleNames) {
    let pp = "";
    let pp_error = "An error occurred. Please check the console for more information";

    // Grab module objects from the names.
    const moduleObjs = moduleNames.map(name => allModules[name]);

    // Calculate the number of modules.
    let baseNumberofModules = templateName.length;
    if (doubleModuleNames.includes(moduleNames[moduleNames.length - 1])) {
        baseNumberofModules += 1;
    }

    // Construct pulse programme name.
    const moduleNamesShort = moduleNames.map(name => name.split("_")[1]).join("");
    pp += `; gn_noah${baseNumberofModules}-${moduleNamesShort}\n`;

    // Get short descriptions.
    let shortDescrs = moduleObjs.map(mod => trySplit(mod.shortDescription)).flat();
    pp += shortDescrs.join("\n");
    pp += "\n";

    // Read template text.
    let templateText = allTemplates[templateName].text.split("\n");

    // Get module preambles.
    let preambles = moduleObjs.map(mod => trySplit(mod.preamble)).flat();
    let sortedPreambles = sortPreambles(preambles);
    // Splice the preambles into the template text. With some error checking.
    let preambleIndex = templateText.findIndex(l => l.trim() == "include preamble");
    if (preambleIndex == -1) {
        console.error("'include preamble' line was not found in template");
        return pp_error;
    }
    else templateText.splice(preambleIndex, 1, ...sortedPreambles);
    // the "..." unpacks an array, like * does in Python.

    // Splice module texts into the template text.
    for (let n = 0; n < templateName.length; n++) {
        const moduleText = trySplit(moduleObjs[n].module);
        let moduleIndex = templateText.findIndex(l => l.trim() == "include module");
        if (moduleIndex == -1) {
            console.error("insufficient 'include module' lines were found in template");
            return pp_error;
        }
        else templateText.splice(moduleIndex, 1, ...moduleText);
    }

    // Get EA increments and splice in. You know the drill...
    const eaIndex = templateText.findIndex(l => l.trim() == "include ea_inc");
    if (eaIndex == -1) {
        console.error("'include ea_inc' line was not found in template");
        return pp_error;
    }
    else {
        let ea_incs = moduleObjs.map(mod => trySplit(mod.ea_inc)).flat();
        ea_incs = ea_incs.filter(Boolean);   // remove empty lines
        ea_incs = removeDuplicateByKey(ea_incs, (l => l.trim())); // remove duplicates
        templateText.splice(eaIndex, 1, ...ea_incs);
    }

    // The same for t1 increments...
    const t1Index = templateText.findIndex(l => l.trim() == "include t1_inc");
    if (t1Index == -1) {
        console.error("'include t1_inc' line was not found in template");
        return pp_error;
    }
    else {
        let t1_incs = moduleObjs.map(mod => trySplit(mod.t1_inc)).flat();
        t1_incs = t1_incs.filter(Boolean);
        t1_incs = removeDuplicateByKey(t1_incs, (l => l.trim()));
        templateText.splice(t1Index, 1, ...t1_incs);
    }

    // And then for 15N t1 increments, but this time we won't check...
    const nt1Index = templateText.findIndex(l => l.trim() == "include nt1_inc");
    if (nt1Index != -1) {   // can use 'if (~nt1Index)' to look cool
        let nt1_incs = moduleObjs.map(mod => trySplit(mod.nt1_inc)).flat();
        nt1_incs = nt1_incs.filter(Boolean);
        nt1_incs = removeDuplicateByKey(nt1_incs, (l => l.trim()));
        templateText.splice(nt1Index, 1, ...nt1_incs);
    }

    // Phases. We sort these by ascending number and remove duplicates.
    const phasesIndex = templateText.findIndex(l => l.trim() == "include phases");
    if (phasesIndex == -1) {
        console.error("'include phases' line was not found in template");
        return pp_error;
    }
    else {
        let phases = moduleObjs.map(mod => trySplit(mod.phases)).flat();
        phases = phases.filter(Boolean);
        // sort
        phases.sort(function (line1, line2) {
            let phaseNumber1 = line1.split("=")[0].match(/\d+/)[0];
            let phaseNumber2 = line2.split("=")[0].match(/\d+/)[0];
            return phaseNumber1 - phaseNumber2;
            // don't you just love the automatic promotion to Number...?
        });
        // remove duplicates according to the phXX number - we use a lambda here
        phases = removeDuplicateByKey(phases, (l => l.split("=")[0].match(/\d+/)[0]));
        templateText.splice(phasesIndex, 1, ...phases);
    }

    // Gradients. These need to be prettified and we need to add gpnam definitions.
    const gradientsIndex = templateText.findIndex(l => l.trim() == "include gradients");
    if (gradientsIndex == -1) {
        console.error("'include gradients' line was not found in template");
        return pp_error;
    }
    else {
        let gradients = moduleObjs.map(mod => trySplit(mod.gradients)).flat();
        gradients = gradients.filter(Boolean);
        // Add in the gpz0 purge gradient. It's always going to be there.
        gradients.push(";gpz0: 17.13%");
        // Sort in increasing order of number.
        gradients.sort((la, lb) => extractGradNumber(la) - extractGradNumber(lb));
        // Then make gpnam definitions (all are SMSQ10.100).
        const gpnamDefinitions = gradients.map(l => `;gpnam${extractGradNumber(l)}: SMSQ10.100`);
        // Splice them in.
        templateText.splice(gradientsIndex, 1, ...gradients, ...gpnamDefinitions);
    }

    // WaveMaker definitions. We just strip duplicates, otherwise left as-is.
    const wvmIndex = templateText.findIndex(l => l.trim() == "include wavemaker");
    if (wvmIndex == -1) {
        console.error("'include wavemaker' line was not found in template");
        return pp_error;
    }
    else {
        let wavemakers = moduleObjs.map(mod => trySplit(mod.wavemaker)).flat();
        wavemakers = wavemakers.filter(Boolean);
        wavemakers = removeDuplicateByKey(wavemakers, (l => l.split(":")[0].slice(1)))
        wavemakers.unshift("/* WaveMaker directives: use 'wvm -a' to create shaped pulses */");
        templateText.splice(wvmIndex, 1, ...wavemakers);
    }

    // Finally the big one: parameter descriptions...
    const descriptionIndex = templateText.findIndex(l => l.trim() == "include parameters");
    if (descriptionIndex == -1) {
        console.error("'include parameters' line was not found in template");
        return pp_error;
    }
    else {
        // We delegate this to a different function, just to split it up.
        let ppDescriptions = getPPDescriptions(templateText.join(" "));
        templateText.splice(descriptionIndex, 1, ...ppDescriptions);
    }

    // Put a date
    templateText.push(`; pulse programme generated on ${(new Date()).toString()}`)

    // Put all of it together!
    pp += templateText.join("\n");
    return pp;
}


/* Generates a list of pulse programme parameter descriptions, from a string containing the
 * pulse programme text. */
function getPPDescriptions(ppText) {
    // We need to scan ppText with several regexes.
    let ppParameters = [
        ...ppText.matchAll(/[^A-Za-z](p\d{1,2})/g),                  // pulses
        ...ppText.matchAll(/[^A-Za-z](d\d{1,2})/g),                  // delays
        ...ppText.matchAll(/[^A-Za-z](l\d{1,2})/g),                  // loop counters
        ...ppText.matchAll(/[^A-Za-z](sp\d{1,2})/g),                 // shaped pulses
        ...ppText.matchAll(/[^A-Za-z](pl\d{1,2})/g),                 // power levels
        ...ppText.matchAll(/[^A-Za-z](cpd\d{1,2})/g),                // decoupling programme
        ...ppText.matchAll(/[^A-Za-z](cnst\d{1,2})/g),               // constants
    ];
    // Extract the capture group
    ppParameters = ppParameters.map(m => m[1]);
    // Remove duplicates... most easily done with a set
    ppParameters = [... new Set(ppParameters)];
    // Replace sp's with spnam's. Also add pcpd's wherever a cpd is found.
    for (let i in ppParameters) {
        if (splitParam(ppParameters[i])[0] == "sp") {
            ppParameters[i] = ppParameters[i].replace("sp", "spnam");
        }
        else if (splitParam(ppParameters[i])[0] == "cpd") {
            ppParameters.push(ppParameters[i].replace("cpd", "pcpd"));
        }
    }
    // Then sort.
    ppParameters.sort(function (pa, pb) {
        let pa_s; let pa_n; let pb_s; let pb_n;
        [pa_s, pa_n] = splitParam(pa);
        [pb_s, pb_n] = splitParam(pb);
        // compare strings first
        if (pa_s > pb_s) return 1;
        else if (pa_s < pb_s) return -1;
        // string parts equal, compare numbers
        else return pa_n - pb_n;
    });
    // We add in a few bonus ones.
    const bonusParameters = ["aq", "ds", "FnMODE", "NBL", "ns"];
    ppParameters.push(...bonusParameters);
    // Generate and return descriptions.
    return ppParameters.map(p => `;${p}: ${descriptions[p]}`);
}


/* Splits a string by newlines, but if the string is undefined, returns an empty array.
 * Useful because we don't want to have to define empty attributes in modules which don't
 * need them. */
function trySplit(lines) {
    if (lines === undefined) return [];
    else return lines.split("\n");
}


/* Picks out the variable that a preamble line defines.
 * Returns param which has several attributes: 
 *  - param.f: the full name of the parameter ("cnst21")
 *  - param.s: the word part ("cnst")
 *  - param.n: the number part (21)
 * If there's no number part, param.n is 0. */
function extractPreambleParam(line) {
    let param = {};
    param.full = line.split("=")[0].slice(1).trim();
    // Get the word + number.
    [param.s, param.n] = splitParam(param.full);
    // Since we're going to use this for sorting, we should replace
    // the null with a zero.
    if (param.n == null) param.n = 0;
    return param;
}


/* Split parameter name into word + number.
 * Returns null for the number component if it's not present. */
function splitParam(p) {
    let numMatch = p.match(/\d+$/);
    let num; let word;
    if (numMatch) {
        num = numMatch[0];   // "21"
        word = p.slice(0, -num.length);  // "cnst"
        num = Number(num);  // 21
    }
    else {
        num = null;
        word = p;
    }
    return [word, num];
}


/* Removes duplicated definitions from the preambles and sorts them in
 * a very nice, pretty order. Also strips empty lines. */
function sortPreambles(lines) {
    // Strip any extra whitespace and discard empty lines.
    lines = lines.map(l => l.trim()).filter(Boolean);

    // Get "define delay ..." lines and sort them.
    // They will be placed at the top.
    let defineLines = lines.filter(l => l.startsWith("define"));
    defineLines.sort();

    // For the rest of the lines...
    let paramLines = lines.filter(l => !(l.startsWith("define")));
    // Sort by the parameter
    paramLines.sort(function (linea, lineb) {
        let pa = extractPreambleParam(linea);
        let pb = extractPreambleParam(lineb);
        // compare string part first
        if (pa.s > pb.s) return 1;
        else if (pa.s < pb.s) return -1;
        // string parts equal, compare numbers
        else return pa.n - pb.n;
    });
    // Then remove duplicates according to the full parameter name
    paramLines = removeDuplicateByKey(paramLines, (l => extractPreambleParam(l).full));

    // paramLines is now mostly sorted, but the DC_S delays come before
    // the other parameters, because capital letters sort lower than
    // lowercase letters. So we need to reverse that here.
    let upperParamLines = paramLines.filter(function (line) {
        let paramFirstLetter = extractPreambleParam(line).full[0];
        return paramFirstLetter == paramFirstLetter.toUpperCase();
    });
    let lowerParamLines = paramLines.filter(function (line) {
        let paramFirstLetter = extractPreambleParam(line).full[0];
        return paramFirstLetter == paramFirstLetter.toLowerCase();
    });

    return defineLines.concat(lowerParamLines).concat(upperParamLines);
}

/* Extracts the number X from a definition line ";gpzX: n%". */
function extractGradNumber(line) {
    return Number(line.split(":")[0].match(/\d+/)[0]);
}


/* Takes a list of strings and a key function (mapping string to something else).
 * Returns only the strings possessing unique keys. */
function removeDuplicateByKey(lines, keyfn) {
    let keys = lines.map(keyfn);
    let uniqueLines = lines.filter(function (l, pos) {
        let k = keyfn(l);  // grab the key corresponding to each line
        return keys.indexOf(k) == pos;
        // indexOf gets the first occurrence of k in keys,
        // so this returns true only if it's the first line with such a key.
    });
    return uniqueLines;
}
