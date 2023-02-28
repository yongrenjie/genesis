// This file contains reusable pulse sequence elements.
export function replacePSElement(ppLines, preambleLines, abbreviation) {
    // First determine the text to be replaced with / added
    let psElementText;
    let psElementPreamble;
    if (abbreviation === "|LPJF|") {
        psElementText = lpjfText;
        psElementPreamble = lpjfPreamble;
    }
    else if (abbreviation === "|ZZF|") {
        psElementText = zzfText;
        psElementPreamble = zzfPreamble;
    }
    else if (abbreviation === "|SOLVSUPP|") {
        psElementText = solvsuppText(1);
        psElementPreamble = solvsuppPreamble;
    }
    else {
        console.error(`replacePSElement() called with unrecognised abbreviation ${abbreviation}`);
        return [ppLines, preambleLines];
    }
    // Search for occurrence of abbreviation
    let ppLineNo = ppLines.findIndex(line => line.includes(abbreviation));
    while (ppLineNo != -1) { // means it was found
        ppLines.splice(ppLineNo, 1, ...psElementText);
        preambleLines.push(...psElementPreamble);
        // Find next occurrence (if it exists)
        ppLineNo = ppLines.findIndex(line => line.includes(abbreviation));
    }
    return [ppLines, preambleLines];
}
// DIPSI mixing {{{1
/**
 * Dynamically generate the pulse programme and preamble needed for DIPSI-2 mixing.
 * This is needed because different DIPSI mixings require different loop counters
 * and delays (so that they aren't entangled).
 *
 * @param {string} label - The label to loop back to (i.e. X in 'lo to X times lY').
 * @param {number} loopCounter - The loop counter that will represent the number of
 *                               DIPSI-2 cycles (i.e. Y in 'lo to X times lY').
 * @param {number} delay - The delay that represents the mixing time.
 * @returns {string[]} [pulprog, preamble] - A two-member list containing the pulse
 *                              programme text and the preamble text respectively.
 */
export function makeDipsi(label, loopCounter, delay) {
    let pulprog = [
        `\t\t\t\t\t\t;begin DIPSI2`,
        `${label} p6*3.556 ph3`,
        `  p6*4.556 ph1`,
        `  p6*3.222 ph3`,
        `  p6*3.167 ph1`,
        `  p6*0.333 ph3`,
        `  p6*2.722 ph1`,
        `  p6*4.167 ph3`,
        `  p6*2.944 ph1`,
        `  p6*4.111 ph3`,
        ``,
        `  p6*3.556 ph1`,
        `  p6*4.556 ph3`,
        `  p6*3.222 ph1`,
        `  p6*3.167 ph3`,
        `  p6*0.333 ph1`,
        `  p6*2.722 ph3`,
        `  p6*4.167 ph1`,
        `  p6*2.944 ph3`,
        `  p6*4.111 ph1`,
        ``,
        `  p6*3.556 ph1`,
        `  p6*4.556 ph3`,
        `  p6*3.222 ph1`,
        `  p6*3.167 ph3`,
        `  p6*0.333 ph1`,
        `  p6*2.722 ph3`,
        `  p6*4.167 ph1`,
        `  p6*2.944 ph3`,
        `  p6*4.111 ph1`,
        ``,
        `  p6*3.556 ph3`,
        `  p6*4.556 ph1`,
        `  p6*3.222 ph3`,
        `  p6*3.167 ph1`,
        `  p6*0.333 ph3`,
        `  p6*2.722 ph1`,
        `  p6*4.167 ph3`,
        `  p6*2.944 ph1`,
        `  p6*4.111 ph3`,
        `  lo to ${label} times l${loopCounter}`,
        `\t\t\t\t\t\t;end DIPSI2`,
    ];
    let preamble = [
        `"l${loopCounter - 1}     = (d${delay}/(p6*115.112))/2"       ; half the number of DIPSI-2 loops`,
        `"l${loopCounter}     = l${loopCounter - 1}*2"                      ; number of DIPSI-2 loops`
    ];
    return [pulprog, preamble];
}
export function* makeDipsiGenerator() {
    let n_c13_modules = 0; // Number of 13C modules seen so far.
    let n_h1_modules = 0; // Number of 1H modules seen so far.
    // Seed the generator so that the next time we call it, we can
    // pass in moduleType.
    let moduleType = yield [[], []];
    while (true) {
        if ((moduleType == "c13") && (n_c13_modules == 0)) {
            // first 13C DIPSI-2 mixing requested.
            n_c13_modules++;
            moduleType = yield makeDipsi("5", 14, 19);
        }
        if ((moduleType == "c13") && (n_c13_modules == 1)) {
            // second or more 13C DIPSI-2 mixing requested.
            n_c13_modules++;
            moduleType = yield makeDipsi("9", 16, 29);
        }
        else if ((moduleType == "h1") && (n_h1_modules == 0)) {
            // first 1H DIPSI-2 mixing.
            n_h1_modules++;
            moduleType = yield makeDipsi("8", 12, 9);
        }
        else if ((moduleType == "h1") && (n_h1_modules == 1)) {
            // second 1H DIPSI-2 mixing.
            n_h1_modules++;
            moduleType = yield makeDipsi("10", 20, 14);
        }
        else {
            throw new Error("too much DIPSI mixing! what are you doing!");
        }
    }
}
// }}}1
// ASAP mixing {{{1
export const asapMixingPPText = [
    ``,
    `  ; ASAP mixing`,
    `if "d15 > 1m"`,
    `{`,
    `  50u`,
    `  p16:gp0*0.4`,
    `  d16`,
    `  4u`,
    `						;begin ASAP`,
    `6 (p45:sp45 ph=0.0):f1`,
    `  (p45:sp45 ph=150.0):f1`,
    `  (p45:sp45 ph=60.0):f1`,
    `  (p45:sp45 ph=150.0):f1`,
    `  (p45:sp45 ph=0.0):f1`,
    `  (p45:sp45 ph=0.0):f1`,
    `  (p45:sp45 ph=150.0):f1`,
    `  (p45:sp45 ph=60.0):f1`,
    `  (p45:sp45 ph=150.0):f1`,
    `  (p45:sp45 ph=0.0):f1`,
    `  (p45:sp45 ph=180.0):f1`,
    `  (p45:sp45 ph=330.0):f1`,
    `  (p45:sp45 ph=240.0):f1`,
    `  (p45:sp45 ph=330.0):f1`,
    `  (p45:sp45 ph=180.0):f1`,
    `  (p45:sp45 ph=180.0):f1`,
    `  (p45:sp45 ph=330.0):f1`,
    `  (p45:sp45 ph=240.0):f1`,
    `  (p45:sp45 ph=330.0):f1`,
    `  (p45:sp45 ph=180.0):f1`,
    `  lo to 6 times l6`,
    `						;end ASAP`,
    `  4u pl1:f1`,
    `}`,
];
// }}}1
// Solvent suppression for homonuclear modules {{{1
/**
 * Dynamically generate the pulse programme and preamble needed for excitation
 * sculpting.
 *
 * @param {number} grad_factor - The factor to multiply gradient amplitudes by.
 * @returns {string[][]} [pulprog, preamble] - A two-member list containing the
 *                                             pulse programme text and the
 *                                             preamble text respectively, both
 *                                             given as a list of lines.
 */
function solvsuppText(grad_factor) {
    const grad_multiply = grad_factor === 1 ? '' : `*${grad_factor}`;
    const text = [
        `#ifdef ES`,
        `  p16:gp20${grad_multiply}`,
        `  d16`,
        `  (p12:sp1 ph0):f1`,
        `  4u pl1:f1`,
        `  (p2 ph2):f1`,
        `  4u`,
        `  p16:gp20${grad_multiply}`,
        `  d16`,
        `  DH_EXSCULPT`,
        `  p16:gp21${grad_multiply}`,
        `  d16`,
        `  (p12:sp1 ph0):f1`,
        `  4u pl1:f1`,
        `  (p2 ph2):f1`,
        `  4u`,
        `  p16:gp21${grad_multiply}`,
        `  d16`,
        `#endif  /* ES */`
    ];
    return text;
}
const solvsuppPreamble = [
    `define delay DH_EXSCULPT`,
    `"DH_EXSCULPT = de+p1*2/3.1416"`
];
// }}}1
// Low-pass J-filters {{{1
const lpjfPreamble = [
    `define delay DLP2a`,
    `define delay DLP2b`,
    `define delay DLP3a`,
    `define delay DLP3b`,
    `define delay DLP3c`,
    `"DLP2a = 1s/(2*cnst6)-p16-d16"`,
    `"DLP2b = 1s/(2*cnst7)-p16-d16"`,
    `"DLP3a = 1s/(2*(cnst6+0.07*(cnst7-cnst6)))-p16-d16"`,
    `"DLP3b = 1s/(cnst7+cnst6)-p16-d16"`,
    `"DLP3c = 1s/(2*(cnst7-0.07*(cnst7-cnst6)))-p16-d16"`,
];
const lpjfText = [
    `#ifdef LP3`,
    `  DLP3a`,
    `  p16:gp10*2.8`,
    `  d16`,
    `  (p3 ph7):f2`,
    `  DLP3b`,
    `  p16:gp10*-1.6`,
    `  d16`,
    `  (p3 ph7):f2`,
    `  DLP3c`,
    `  p16:gp10*-0.8`,
    `  d16`,
    `  (p3 ph7):f2`,
    `  4u`,
    `  p16:gp10*-0.4`,
    `  d16`,
    `#else`,
    `  DLP2a`,
    `  p16:gp10*-3`,
    `  d16`,
    `  (p3 ph7):f2`,
    `  DLP2b`,
    `  p16:gp10*2`,
    `  d16`,
    `  (p3 ph7):f2`,
    `  4u`,
    `  p16:gp10`,
    `  d16`,
    `#endif`,
];
// }}}1
// HMBC zz-filter {{{1
const zzfPreamble = [
    `define delay DC_ZZFa`,
    `define delay DC_ZZFb`,
    `"DC_ZZFa = d4-p14/2"`,
    `"DC_ZZFb = d4+p14/2"`,
];
const zzfText = [
    `#ifdef NOZZF`,
    `  ; enable -DNOZZF acquisition flag to remove zz-filter`,
    `  ; only do this if you are sure about what you are doing!`,
    `  (p1 ph0):f1`,
    `#else`,
    `  ; zz-filter`,
    `  (p1 ph0):f1`,
    `  DC_ZZFa`,
    `  (p14:sp3 ph0):f2`,
    `  (p2 ph0):f1`,
    `  DC_ZZFb`,
    `  (p1 ph0):f1`,
    `  DC_ZZFa`,
    `  (p14:sp3 ph0):f2`,
    `  (p2 ph0):f1`,
    `  DC_ZZFb pl2:f2`,
    `  (lalign (p1 ph0):f1 (p3 ph7):f2 )`,
    `#endif`,
];
// }}}1
// vim: foldmethod=marker
