// Get the version number.
import {version} from "./version.js";
import NOAHModule from "./moduleSpec.js";

// Standardised parameter definitions {{{1
// Goto labels {{{2
// 1 - beginning of pulse sequence ('ze')
// 2 - NS loop (go=2)
// 3 - EA loop (lo to 3 times 2)
// 4 - t1 loop (lo to 4 times l1)
// 5 - HSQC-TOCSY DIPSI-2
// 6 - ASAP mixing
// 7 - ROESY spin lock
// 8 - TOCSY DIPSI-2

// String definitions {{{2
const allParams = {
    "aq": "acquisition time",
    "ds": ">= 16",
    "FnMODE": "echo-antiecho",
    "NBL": "number of blocks (NOAH modules)",
    "ns": "1 * n",

    "p1": "f1 channel -  90 degree high power pulse",
    "p2": "f1 channel - 180 degree high power pulse",
    "p3": "f2 channel -  90 degree high power pulse",
    "p4": "f2 channel - 180 degree high power pulse",
    "p6": "f1 channel -  90 degree low power pulse",
    "p14": "f2 channel - 180 degree shaped pulse for inversion\n;     = 500usec for Crp60,0.5,20.1",
    "p15": "f1 channel - duration of ROESY spin lock",
    "p16": "gradient pulse   [1 ms]",
    "p17": "extended gradient pulse for 15N HSQC",
    "p19": "gradient pulse 2 [600 us]",
    "p21": "f3 channel -  90 degree high power pulse",
    "p22": "f3 channel - 180 degree high power pulse",
    "p24": "f2 channel - 180 degree shaped pulse for refocusing\n;      = 2msec for Crp60comp.4",
    "p25": "f1 channel - 180 degree pulse at pl27 for ROESY spin lock",
    "p31": "f2 channel - 180 degree shaped pulse for inversion with J-compensation",
    "p32": "f1 channel - 180 degree shaped pulse (adiabatic)      [20 msec]\n;     smoothed chirp (sweepwidth, 20% smoothing, 10000 points)",
    "p33": "f1 channel - 180(x) BURBOP [600 us]",
    "p34": "f2 channel - 180 pp BIBOP [600 us]",
    "p40": "f1 channel - PSYCHE double saltire pulse [30 ms]",
    "p41": "f1 channel - PSYCHE ZQS chirp pulses [40 ms]",
    "p45": "f1 channel -  180 degree CAWURST-2 pulse",
    "p50": "f1 channel -  Adiabatic pulse for ROESY (half of total mixing time)\n;			 total mixing time = 2*p50",

    "pl0": "0 W",
    "pl1": "f1 channel - power level for pulse (default)",
    "pl2": "f2 channel - power level for pulse (default)",
    "pl3": "f3 channel - power level for pulse (default)",
    "pl10": "f1 channel - power level for TOCSY-spinlock",
    "pl12": "f2 channel - power level for CPD/BB decoupling",
    "pl16": "f3 channel - power level for CPD/BB decoupling",
    "pl27": "f1 channel - power level for pulsed ROESY-spinlock",

    "sp3": "f2 channel - shaped pulse (180 degree inversion)",
    "spnam3": "Crp60,0.5,20.1 or WaveMaker",
    "sp7": "f2 channel - shaped pulse (180 degree refocusing)",
    "spnam7": "Crp60comp.4",
    "sp18": "f2 channel - shaped pulse (180 degree with J-compensation)",
    "spnam18": "Crp60_xfilt.2 or WaveMaker",
    "sp29": "f1 channel - shaped pulse (adiabatic)",
    "spnam29": "Crp60,20,20.10",
    "sp33": "f1 channel - 180(x) BURBOP",
    "spnam33": "BUBI_1H_600u_RF20kHz",
    "sp34": "f2 channel - 180 pp BIBOP",
    "spnam34": "BUBI_13C_600u_RF10kHz",
    "sp40": "f1 channel - PSYCHE double saltire",
    "spnam40": "PSYCHE_Saltire_30ms",
    "sp41": "f1 channel - PSYCHE ZQS low-to-high chirp",
    "spnam41": "PSYCHE_Chirp_LH",
    "sp42": "f1 channel - PSYCHE ZQS high-to-low chirp",
    "spnam42": "PSYCHE_Chirp_HL",
    "sp45": "f1 channel - CAWURST-2 pulse (180 degree)",
    "spnam45": "wuASAP (generate via WaveMaker)",
    "sp49": "f1 channel - first shaped pulse WURSTAM (adiabatic) for ROESY mixing (high shift)",
    "spnam49": "wu180H1SL (generate via WaveMaker)",
    "sp50": "f1 channel - second shaped pulse WURSTAM (adiabatic) for ROESY mixing (low shift)",
    "spnam50": "wu180H1SL2 (generate via WaveMaker)",

    "cnst2": "= 1J(CH)",
    "cnst3": "apparent J(CH) for Ernst angle excitation",
    "cnst4": "= 1J(NH)",
    "cnst6": "= minimum 1J(CH)",
    "cnst7": "= maximum 1J(CH)",
    "cnst12": "> J(HH), ca. 30 Hz for CLIP-COSY mixing",
    "cnst13": "= nJ(CH) long-range",
    "cnst16": "15N CTP gradient lengthening factor",
    "cnst17": "= -0.5 for Crp60comp.4",
    "cnst20": "PSYCHE saltire flip angle (degrees)",
    "cnst21": "PSYCHE saltire / chirp bandwidth (Hz) [10000]",
    "cnst22": "PSYCHE saltire RF amplitude (Hz)",
    "cnst23": "PSYCHE ZQS chirp RF amplitude (Hz)",
    "cnst24": "PSYCHE drop points [ca. 4]",
    "cnst32": "fraction of C-H magn used for HSQC-TOCSY [0.5 to 1]",
    "cnst33": "= rf amplitude 20000 Hz for BUBI_1H_600u_RF20kHz",
    "cnst34": "= rf amplitude 10000 Hz for BUBI_13C_600u_RF10kHz",
    "cnst37": "TD1 for 1H JRES or PSYCHE [32]",
    "cnst38": "SW (Hz) for 1H JRES or PSYCHE",
    "cnst39": "15N HSQC sensitivity factor [1-4]",
    "cnst40": "15N SW (ppm)",
    "cnst41": "gradient ratio (2*C/H)",
    "cnst42": "gradient ratio (4*C/H)",
    "cnst43": "gradient ratio (1*C/H)",
    "cnst44": "gradient ratio (2*N/H)",
    "cnst45": "gradient ratio (4*N/H)",
    "cnst46": "gradient ratio (1*N/H)",
    "cnst47": "HMBC gradient ratio",
    "cnst49": "left edge of spectral window (ppm) [ca. 9.5]",
    "cnst50": "right edge of spectral window (ppm) [ca. -0.5]",

    "d0": "13C t1",
    "d1": "relaxation delay",
    "d2": "1/2J(CH)",
    "d3": "reduced 1/4J(CH) for Ernst angle excitation",
    "d4": "1/4J(CH)",
    "d6": "1/8J(CH) for all multiplicities, 1/4J(CH) for CH only",
    "d7": "1/(2*nJ(CH)), long-range coupling evolution",
    "d8": "delay for NOE buildup",
    "d9": "TOCSY mixing time",
    "d10": "1H t1",
    "d11": "1H t1 (magnitude-mode)",
    "d12": "<1/4J(HH) CLIP-COSY mixing time",
    "d15": "optional ASAP mixing time [40-60 ms] (use `wvm`)",
    "d16": "delay for homospoil/gradient recovery [200 us]",
    "d19": "HSQC-TOCSY mixing time",
    "d20": "15N t1",
    "d24": "1/4J(NH)",
    "d26": "1/8J(NH) for all multiplicities, 1/4J(NH) for NH only",
    "d29": "DIPSI-2 mixing time between 13C modules",

    "inf1": "1/SW(C) = 2 * DW(C)",
    "in0": "1/(2 * SW(C)) = DW(C)",
    "in10": "1/(SW(H)) = 2 * DW(H)",
    "in20": "1/(2 * SW(N)) = DW(N)",

    "l0": "total number of t1 increments",
    "l1": "running counter of t1 increments",
    "l2": "even for echo, odd for antiecho",
    "l3": "running counter for scan number",
    "l6": "loop for ASAP mixing",
    "l7": "loop for ROESY spinlock = p15 / p25*2",
    "l11": "TOCSY: half the number of DIPSI-2 cycles",
    "l12": "TOCSY: actual number of DIPSI-2 cycles",
    "l13": "HSQC-TOCSY: half the number of DIPSI-2 cycles",
    "l14": "HSQC-TOCSY: actual number of DIPSI-2 cycles",
    "l15": "DIPSI-2 between 13C modules: half the number of DIPSI-2 cycles",
    "l16": "DIPSI-2 between 13C modules: actual number of DIPSI-2 cycles",

    "cpd2": "13C decoupling according to sequence defined by cpdprg2",
    "cpd3": "15N decoupling according to sequence defined by cpdprg3",
    "pcpd2": "f2 channel - 90 degree pulse for decoupling sequence",
    "pcpd3": "f3 channel - 90 degree pulse for decoupling sequence",
}

// Phases {{{2
class Phase {
    num: number;
    str: string;
    ea:  string;
    nt1: string;
    ct1: string;
    ht1: string;

    constructor({num, str, ea = null, nt1 = null, ct1 = null, ht1 = null}) {
        this.num = num;  // phXX
        this.str = str;  // string describing the phases e.g. "0 0 0 0 2 2 2 2"
        this.ea = ea;    // actions to take when EA / 15N t1 etc. is incremented.
        this.nt1 = nt1;  //    these are stored as strings.
        this.ct1 = ct1;  //    syntax: 'i' for increment (by 90deg), 'i2' for increment by 180
        this.ht1 = ht1;  //            'r' for reset
    }

    makeInstruction(occasion: string) {  // occasion = 'ea', 'nt1', 'ct1', or 'ht1'
        if (this[occasion] === null) {
            return ``;
        }
        else if (this[occasion].length == 1) {
            return `${this[occasion]}p${this.num}`;  // 'ip30' or 'rp30'
        }
        else if (this[occasion].length == 2) {
            return `${this[occasion][0]}p${this.num}*${this[occasion][1]}`;  // 'ip30*2'
        }
        else console.error("we didn't plan for this");
    }
}
const allPhases = new Array(32);
allPhases[0] = new Phase({num: 0, str: "0"});
allPhases[1] = new Phase({num: 1, str: "1"});
allPhases[2] = new Phase({num: 2, str: "2"});
allPhases[3] = new Phase({num: 3, str: "3"});
allPhases[4] = new Phase({num: 4, str: "0 2", nt1: "i2"});
allPhases[5] = new Phase({num: 5, str: "0 2", ct1: "i2"});
allPhases[6] = new Phase({num: 6, str: "0 2", ea: "i", ct1: "r"});
allPhases[7] = new Phase({num: 7, str: "0 0 2 2"});
allPhases[8] = new Phase({num: 8, str: "2 2 0 0"});
allPhases[9] = new Phase({num: 9, str: "1 1 3 3", ea: "i2"});    // seHSQC
allPhases[10] = new Phase({num: 10, str: "3 3 1 1", ea: "i2"});  // seHSQC
allPhases[11] = new Phase({num: 11, str: "0 0 0 0 2 2 2 2"});
allPhases[12] = new Phase({num: 12, str: "0 2"});
allPhases[13] = new Phase({num: 13, str: "0", ct1: "i2"});
allPhases[14] = new Phase({num: 14, str: "0 1 2 3"});
allPhases[15] = new Phase({num: 15, str: "0 1"});
allPhases[16] = new Phase({num: 16, str: "1 3", ea: "i", ct1: "r"});  // DQF-COSY ph
allPhases[17] = new Phase({num: 17, str: "1 1 3 3"});
// ... plenty of empty slots to use
// below are for receivers
allPhases[25] = new Phase({num: 25, str: "0 0 2 2", ct1: "i2"});      // HSQC-COSY
allPhases[26] = new Phase({num: 26, str: "0 2"});
allPhases[27] = new Phase({num: 27, str: "1 3 3 1", nt1: "i2"});
allPhases[28] = new Phase({num: 28, str: "1 3 3 1", ct1: "i2"});
allPhases[29] = new Phase({num: 29, str: "0 2 2 0", nt1: "i2"});
allPhases[30] = new Phase({num: 30, str: "0 2 2 0", ct1: "i2"});
allPhases[31] = new Phase({num: 31, str: "0 2", ct1: "i2"});


// Gradients {{{2
class Gradient {
    num: number;
    val: number;
    comment: string;
    shape: string;

    constructor({num, val, comment = "", shape="SMSQ10.100"}) {
        this.num = num;   // gpzXX
        this.val = val;   // float: amplitude in percentage
        this.comment = comment.trim();   // description of the gradient
        this.shape = shape;   // gradient shape
    }

    makeGpnamInstruction() {
        if (Boolean(this.shape)) return `;gpnam${this.num}: ${this.shape}`;
        else return ``;  // no shape -- for gron/groff commands
    }

    makeGpzInstruction() {
        let s = `;gpz${this.num}: ${this.val}%`;
        if (Boolean(this.comment)) s += ` (${this.comment})`;
        return s;
    }
}
const allGradients = new Array(32);
allGradients[0] = new Gradient({num: 0, val: 24, comment: "for purging"});
allGradients[1] = new Gradient({num: 1, val: 80, comment: "HMBC CTP"});
allGradients[2] = new Gradient({num: 2, val: 80, comment: "15N CTP"});
allGradients[3] = new Gradient({num: 3, val: 75, comment: "13C alternate module CTP"});
allGradients[4] = new Gradient({num: 4, val: 70, comment: "13C CTP"});
allGradients[5] = new Gradient({num: 5, val: 10, comment: "1H CTP"});
allGradients[6] = new Gradient({num: 6, val: 11, comment: "13C spin echo CTP"});
allGradients[7] = new Gradient({num: 7, val: -5, comment: "13C spin echo CTP"});
allGradients[8] = new Gradient({num: 8, val: 13, comment: "15N spin echo CTP"});
allGradients[9] = new Gradient({num: 9, val: -6, comment: "15N spin echo CTP"});
allGradients[10] = new Gradient({num: 10, val: 5, comment: "HMBC J-filter"});
allGradients[11] = new Gradient({num: 11, val: 43, comment: "1H purge gradient"});
allGradients[12] = new Gradient({num: 12, val: 11, comment: "1H ZQ filter", shape: ""});
allGradients[13] = new Gradient({num: 13, val: 19, comment: "13C DIPSI-2 purge gradients"});
allGradients[14] = new Gradient({num: 14, val: 1, comment: "1H PSYCHE weak gradient", shape: "RECT.1"});
allGradients[15] = new Gradient({num: 15, val: 1, comment: "1H PSYCHE ZQS weak gradient", shape: "RECT.1"});
allGradients[16] = new Gradient({num: 16, val: 35, comment: "1H PSYCHE CTP gradient 1"});
allGradients[17] = new Gradient({num: 17, val: 49, comment: "1H PSYCHE CTP gradient 2"});
allGradients[18] = new Gradient({num: 18, val: 77, comment: "1H PSYCHE CTP gradient 3"});
allGradients[19] = new Gradient({num: 19, val: 37, comment: "1H CTP"}); // stronger grad needed for e.g. DQF-COSY


// WaveMaker definitions {{{2
const allWavemakers = new Array(64);
allWavemakers[3] = ";sp3:wvm:wu180C13: cawurst-20(60 kHz, 0.5 ms; L2H)";
allWavemakers[18] = ";sp18:wvm:wu180Jcomp: cawurst-40(280 ppm; Jcomp, L2H)";
allWavemakers[45] = ";sp45:wvm:wuASAP: cawurst-2(30 ppm, 1.0 ms; Q=3)";
allWavemakers[49] = ";sp49:wvm:wu180H1SL: wurstAM(p50, cnst49 ppm; B1max = 5.0 kHz)";
allWavemakers[50] = ";sp50:wvm:wu180H1SL2: wurstAM(p50, cnst50 ppm; B1max = 5.0 kHz)";
// }}}1

// Boring and ultra-long string constants {{{1
// extraDipsiMixingPPText {{{2
const extraDipsiMixingPPText = [
    ``,
    `  ; (optional) DIPSI-2 mixing before next module`,
    `if "d29 > 1m"`,
    `{`,
    `  50u`,
    `  p16:gp13`,
    `  d16 pl10:f1`,
    `						;begin DIPSI2`,
    `9 p6*3.556 ph3`,
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
    `  lo to 9 times l16`,
    `						;end DIPSI2`,
    `  p16:gp13*1.333`,
    `  d16 pl1:f1`,
    `}`,
]
// }}}2
// asapMixingPPText {{{2
const asapMixingPPText = [
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
]
// }}}2
// }}}1

// The function {{{1
export function makePulprogText(backendModules: string[],
                                allModules: Map<string, NOAHModule>) {
    /* backendModules : Array of Strings indicating the backend modules to be used in pulse
     *                  programme construction.
     * allModules     : Map containing backend module names as the keys (these are the same 
     *                  as the .js file names, without extensions) and the actual module
     *                  objects as the values.
     */
    // Initialisation {{{2

    // Set some flags that will help us later
    const hmbcModulePresent = (backendModules.findIndex(elem => elem.startsWith("C_HMBC_")) !== -1);
    const nModulePresent = (backendModules.findIndex(elem => elem.startsWith("N_")) !== -1);
    const c1ModulePresent = (backendModules.findIndex(elem => elem.startsWith("CI_")) !== -1);
    const c2ModulePresent = (backendModules.findIndex(elem => elem.startsWith("C_")) !== -1);
    const cModulePresent = (c1ModulePresent || c2ModulePresent);  // any 13C module
    const hModulePresent = (backendModules.findIndex(elem => elem.startsWith("H_")) !== -1);
    const asapMixing = (hmbcModulePresent && hModulePresent);
    const extraDipsiMixing = (c1ModulePresent && c2ModulePresent &&
        backendModules.filter(m => m.includes("CI_") && m.includes("TOCSY")).length === 0);

    // Initialise pulse programme components.
    // All these are arrays of strings.
    let pp = [];
    let shortCodes = [];
    let shortDescriptions = [];
    let preambles = [];
    let mainpp = [];  // the bulk of the pulse programme

    // Helper functions {{{2
    // Trim newlines from beginning and end. trim() removes all whitespace, which we don't want here.
    let trimNewlines = ((s: string) => s.replace(/^\n|\n$/g, ''));
    // Split a parameter name into word and number.
    function splitParam(p: string) {
        let numMatch = p.match(/\d+$/);
        let numAsStr: string;
        let word: string;
        let num: number;  // or null...
        if (numMatch) {
            numAsStr = numMatch[0];   // "21"
            word = p.slice(0, -numAsStr.length);  // "cnst"
            num = Number(numAsStr);  // 21
        }
        else {
            num = null;
            word = p;
        }
        return [word, num];
    }
    // Extract the parameter being defined from a preamble line.
    // The parameter is an object with attributes 's' for string ('cnst'), 
    // 'n' for number (21), and 'full' for the full thing ('cnst21').
    function extractPreambleParam(line: string) {
        let param: any = {};  // TODO: make an interface or class for TypeScript
        param.full = line.split("=")[0].slice(1).trim();
        // Get the word + number.
        [param.s, param.n] = splitParam(param.full);
        // Since we're going to use this for sorting, we should replace
        // the null with a zero.
        if (param.n == null) param.n = 0;
        return param;
    }
    // Take an array of strings and a key function (keyfn :: string -> key)
    // Returns a filtered array containing only strings with unique keys.
    function removeDuplicateByKey(lines: string[],
                                  keyfn: (k: string) => any) {
        let keys = lines.map(keyfn);
        let uniqueLines = lines.filter(function (l, pos) {
            let k = keyfn(l);  // grab the key corresponding to each line
            return keys.indexOf(k) == pos;
            // indexOf gets the first occurrence of k in keys,
            // so this returns true only if it's the first line with such a key.
        });
        return uniqueLines;
    }
    // Sorting function acting on strings that have the form /[A-Za-z]+\d+/.
    // Essentially sorts the tuple (stringpart, numberpart) in lexicographic order.
    function sortStrNum(pa: string, pb: string) {
        const ia = pa.search(/\d/); const ib = pb.search(/\d/);  // index of first number
        const sa = pa.slice(0, ia); const sb = pb.slice(0, ib);  // string part
        const na = (ia != -1) ? Number(pa.slice(ia)) : 0;        // number part
        const nb = (ib != -1) ? Number(pb.slice(ib)) : 0;
        const scmp = sa.localeCompare(sb);                       // compare string part
        return (scmp != 0) ? scmp : na - nb;
    }

    // Preprocess mainpp {{{2
    // Figure out which nucleus to stop decoupling on, if any.
    let stopDec = "";
    const lastModule = allModules.get(backendModules[backendModules.length - 1]);
    if (lastModule.module.includes('cpd2:f2')) stopDec = " do:f2";
    else if (lastModule.module.includes('cpd3:f3')) stopDec = " do:f3";
    mainpp.push(
        `1 ze`,
        `2 30m`,             // NS loop (go=2 phXX) goes back to here
        `3 5m${stopDec}`,    // EA loop goes back to here
        `4 50u UNBLKGRAD`,   // t1 loop goes back to here
        `  "l3 = l3 + 1"`,
        ``,
        `  ; Cleanup`,
    );
    // Context-dependent cleanup before d1.
    if (cModulePresent) mainpp.push(`  4u pl2:f2`, `  (p3 ph0):f2`);
    if (nModulePresent) mainpp.push(`  4u pl3:f3`, `  (p21 ph0):f3`);
    mainpp.push(
        `  4u pl1:f1`,
        `  p16:gp0`,
        `  d16`,
        `  (p1 ph0):f1`,
        `  4u`,
        `  p16:gp0*-1.37`,
        `  d16`,
        `  (p1 ph1):f1`,
        `  4u`,
        `  p16:gp0*0.77`,
        `  d16`,
        `  4u BLKGRAD`,
        `  d1 st0`,
        `  4u UNBLKGRAD`,
    );

    // Main pulse programme construction {{{2
    // Generator which spits out numbers to multiply purge gradients by.
    function* gradGenFunc() {
        yield* [1.77, 2.32, -1.29, 0.71];
    }
    const gradGen = gradGenFunc();
    // Iterate over modules. The hard work of constructing the pulse programme
    // is done here.
    for (let [index, module] of backendModules.entries()) {
        if (allModules.has(module)) {
            // get module object
            const mod = allModules.get(module); // module object
            // get shortCode. We postprocess this in order to get a snappy
            // name for the pulse sequence (e.g. 'MSCN').
            shortCodes.push(mod.shortCode);
            // get shortDescription. These go at the front of the pulse
            // programme.
            shortDescriptions.push(...mod.shortDescription.split("\n"));
            // get preamble lines. These are postprocessed so that they
            // appear in the right order.
            preambles.push(...mod.preamble.split("\n"));
            // here comes the main part -- the actual pulprog itself
            mainpp.push(``, ``, `  ; MODULE ${index + 1}`),
            mainpp.push(...trimNewlines(mod.module).split("\n"));
            // DIPSI-2 mixing between two 13C modules; but this isn't needed if
            // the previous module was a HSQC-TOCSY.
            if (extraDipsiMixing
                && backendModules[index].startsWith("CI_")
                && backendModules[index + 1].startsWith("C_")
            ) {
                mainpp.push(...extraDipsiMixingPPText);
            }
            // ASAP mixing if the next module is a 1H module.
            if (asapMixing
                && backendModules[index + 1] !== undefined
                && backendModules[index + 1].startsWith("H_")
            ) {
                mainpp.push(...asapMixingPPText);
            }
            // add cleanup for all but the last module
            if (index != backendModules.length - 1) {
                mainpp.push(
                    ``,
                    `  ; Cleanup`,
                    `  4u pl1:f1`,  // as a courtesy to the next module
                );
                // 15N and/or 13C purge pulses
                if (mod.nuclei.includes('C')) mainpp.push(`  4u pl2:f2`, `  (p3 ph0):f2`);
                if (mod.nuclei.includes('N')) mainpp.push(`  4u pl3:f3`, `  (p21 ph0):f3`);
                mainpp.push(
                    `  4u`,
                    `  p16:gp0*${gradGen.next().value}`,
                    `  2m st`,
                );
            }
        }
        else console.log(`makePulprogText: module ${module} not found`);
    }

    // Postprocess mainpp, including EA/t1 incrementation {{{2
    // Initialisation {{{3
    // Use a regex to find all phases in the pulse programme text
    let phases2 = new Set(mainpp.join("\n").match(/ph\d{1,2}/g));
    let phases = Array.from(phases2)   // TODO: Ugly variable name, silences TypeScript errors!
        .map(phx => Number(phx.slice(2)))  // extract the number
        .sort((a, b) => a - b);

    // Change the last goscnp to go=2
    for (let l = mainpp.length - 1; l >= 0; l--) {
        if (mainpp[l].includes("goscnp")) {
            mainpp[l] = mainpp[l].replace("goscnp", "go=2");
            break;
        }
    }
    // Check for d0, d10, d11, d20, EA1, EA2
    const mainppTemp = mainpp.join("\n");
    const d0Present = (mainppTemp.search(/\bd0\b/) != -1);
    const d10Present = (mainppTemp.search(/\bd10\b/) != -1);
    const d11Present = (mainppTemp.search(/\bd11\b/) != -1);
    const d20Present = (mainppTemp.search(/\bd20\b/) != -1);
    const ea1Present = (mainppTemp.search(/\bEA1\b/) != -1);
    const ea2Present = (mainppTemp.search(/\bEA2\b/) != -1);
    // For cnst38 it is a bit more tricky. We have not yet added the preambles so we can't simply
    // search in mainppTemp. We have to check the preamble of the module itself.
    const cnst38Present = lastModule.preamble.includes("cnst38");
    // Add in NUS redefinitions of t1 delays (to be used with -DNUS zgoptn flag)
    if (d0Present || d10Present || d11Present || d20Present) {
        let nusRedefinitions = [``, `#ifdef NUS`];
        if (d0Present) nusRedefinitions.push(`  "d0=(in0*t1list)+3u"`);
        if (d10Present) nusRedefinitions.push(`  "d10=(in10*t1list)+3u"`);
        if (d11Present) nusRedefinitions.push(`  "d11=(in11*t1list)+3u"`);
        if (d20Present) nusRedefinitions.push(`  "d20=(in20*t1list)+3u"`);
        nusRedefinitions.push(`#endif`);
        mainpp.splice(4, 0, ...nusRedefinitions);
    }
    // EA incrementation {{{3
    mainpp.push(
        ``,
        `  ; echo/antiecho loop`,
        `  "l2 = l2 + 1"`,
        `  1m igrad EA`,
    );
    if (ea1Present) mainpp.push(`  1m igrad EA1`);
    if (ea2Present) mainpp.push(`  1m igrad EA2`);
    if (d11Present) {
        // This will break NUS, but noah_nus.py will already warn the user if there is a QF
        // module, so we don't need to warn them again here.
        if (cnst38Present) {
            mainpp.push(
                `if "l2 % (l0 * 2 / cnst37) == 0"`,
                `{`,
                `  1m id11`,
                `}`,
            );
        }
        else {
            mainpp.push(`  1m id11`);
        }
    }
    const eaPhaseInstructions = phases.map(p => allPhases[p].makeInstruction("ea")).filter(Boolean);
    eaPhaseInstructions.forEach(inst => mainpp.push(`  1m ${inst}`));
    mainpp.push(
        `  30m wr #0 if #0 zd`,
        `  lo to 3 times 2`,
    );

    // 13C t1 incrementation {{{3
    // General stuff: increment l1 and NUS list, if it's being used.
    mainpp.push(
        ``,
        `  ; t1 incrementation`,
        `  "l1 = l1 + 1"`,
        `#ifdef NUS`,
        `  1m t1list.inc`,
        `#endif`,
    );

    // Actual 13C t1 incrementation.
    const ct1PhaseInstructions = phases.map(p => allPhases[p].makeInstruction("ct1")).filter(Boolean);
    ct1PhaseInstructions.forEach(inst => mainpp.push(`  1m ${inst}`));
    if (d0Present) {
        mainpp.push(
            ``,
            `  ; 13C t1 incrementation`,
            `#ifdef NUS`,
            `#else`,
            `  1m id0`,
            `#endif`,
        );
    }

    // 1H t1 incrementation {{{3
    const ht1PhaseInstructions = phases.map(p => allPhases[p].makeInstruction("ht1")).filter(Boolean);
    ht1PhaseInstructions.forEach(inst => mainpp.push(`  1m ${inst}`));
    if (d10Present) {
        // if NUS is enabled, increment the phases and don't perform the cnst37 check.
        mainpp.push(
            ``,
            `  ; 1H t1 incrementation`,
            `#ifdef NUS`,
        );
        ht1PhaseInstructions.forEach(inst => mainpp.push(`  1m ${inst}`));
        mainpp.push(`#else`);
        // here is if we don't have NUS. we need to perform the cnst37 check depending
        // on whether cnst38 is in the pulse programme (as cnst37 isn't yet in it!)
        if (cnst38Present) {
            mainpp.push(
                `if "l1 % (l0 * 2 / cnst37) == 0"`,
                `{`,
                `  1m id10`,
            );
            ht1PhaseInstructions.forEach(inst => mainpp.push(`  1m ${inst}`));
            mainpp.push(`}`);
        }
        else {
            mainpp.push(`  1m id10`);
            ht1PhaseInstructions.forEach(inst => mainpp.push(`  1m ${inst}`));
        }
        mainpp.push(`#endif /* NUS */`);
    }

    // 15N t1 incrementation {{{3
    const nt1PhaseInstructions = phases.map(p => allPhases[p].makeInstruction("nt1")).filter(Boolean);
    if (nModulePresent) {
        // if there is NUS defined then we want to disable cnst39, i.e. duplicate all of the increment
        // instructions, but outside of the 'if l1 % cnst39 == 0' check. This is because we can't handle
        // NUS and k-scaling (effectively we would need two t1lists, one for 15N and one for the rest).
        // However if NUS is defined then we don't want to id20 as d20 will be recalculated at the start
        // of the pulse programme..
        mainpp.push(
            ``,
            `  ; 15N t1 incrementation`,
            `#ifdef NUS`,
        );
        nt1PhaseInstructions.forEach(inst => mainpp.push(`  1m ${inst}`));
        // here is if we don't have NUS. we can perform the cnst39 check as before.
        mainpp.push(
            `#else`,
            `if "l1 % cnst39 == 0"`,
            `{`,
        );
        if (d20Present) mainpp.push(`  1m id20`);
        nt1PhaseInstructions.forEach(inst => mainpp.push(`  1m ${inst}`));
        mainpp.push(
            `}`,
            `#endif /* NUS */`
        );
    }

    // Final loop and exit {{{3
    mainpp.push(``);
    mainpp.push(`  lo to 4 times l0`);
    // BLKGRAD and exit.
    mainpp.push(``, `50u BLKGRAD`, `exit`);
    const mainppText = mainpp.join("\n");  // convenience string for future use

    // Postprocess preambles {{{2
    // Generate a pulse programme name by postprocessing shortCodes, as well as
    // counting the number of FID periods (i.e. the NBL parameter).
    const fidRegexes = [/goscnp ph\d{1,2}/, /go=\d ph\d{1,2}/];
    const nbl = mainpp.filter(line => fidRegexes.some(rgx => line.search(rgx) != -1)).length;
    // Return an empty string if we have less than one module.
    if (nbl < 2) return "";
    const ppShortCodeName = `; ngn_noah${nbl}-${shortCodes.join("")}`;

    // Start by removing extra whitespace and empty lines.
    preambles = preambles.map(l => l.trim()).filter(Boolean);
    // There are three types of lines that we need to deal with:
    // 1) define delay XX, 2) other parameter definitions, 3) define list<gradient>XX.
    let defineDelayLines = preambles.filter(l => l.startsWith("define delay")).sort(sortStrNum);
    let paramLines = preambles.filter(l => !(l.startsWith("define")));
    let defineGradLines = preambles.filter(l => l.startsWith("define list<gradient>")).sort(sortStrNum);
    // Sort param lines (the other two have already been sorted)
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
    // Now we can stick the preambles back together in the right order.
    preambles = defineDelayLines.concat(lowerParamLines, upperParamLines, defineGradLines);

    // Create postamble components {{{2
    // Phase definitions {{{3
    const phaseDefns = phases.map(p => `ph${p}=${allPhases[p].str}`);

    // Gradient definitions {{{3
    let gradients2 = new Set([
        mainppText.match(/gp\d{1,2}/g),
        mainppText.match(/gron\d{1,2}/g)]
        .filter(Boolean)
        .flat()
        .map(s => s.replace("gron", "").replace("gp", "")));  // extract the number
    let gradients = Array.from(gradients2, Number).sort((a, b) => a - b);
    const gpnamDefns = gradients.map(g => allGradients[g].makeGpnamInstruction()).filter(Boolean);
    const gpzDefns = gradients.map(g => allGradients[g].makeGpzInstruction());

    // WaveMaker definitions {{{3
    let shapedPulses2 = new Set(mainppText.match(/p\d{1,2}:sp\d{1,2}/g));
    let shapedPulses = Array.from(shapedPulses2)
        .map(s => Number(s.split(":")[1].slice(2)))  // extract the number
        .sort((a, b) => a - b);
    let wvmDefns = shapedPulses.map(s => allWavemakers[s]).filter(e => e !== undefined);
    // If there is 13C decoupling we should add in the pulses for adiabatic decoupling.
    if (mainpp.join("\n").includes("cpd2:f2")) {
        wvmDefns.push(";cpd2:wvm:wudec: cawurst_d-20(220 ppm, 1.4 ms; L2H)");
    }

    // Parameter definitions {{{3
    // We need to scan the preamble and mainppText with several regexes.
    const preamblePlusMainpp = preambles.join("\n") + "\n" + mainppText;
    let params2 = new Set([
        preamblePlusMainpp.match(/\bp\d{1,2}\b/g),     // pulses
        preamblePlusMainpp.match(/\bd\d{1,2}\b/g),     // delays
        preamblePlusMainpp.match(/\bl\d{1,2}\b/g),     // loop counters
        preamblePlusMainpp.match(/\bsp\d{1,2}\b/g),    // shaped pulses
        preamblePlusMainpp.match(/\bpl\d{1,2}\b/g),    // power levels
        preamblePlusMainpp.match(/\bcpd\d{1,2}\b/g),   // decoupling programme
        preamblePlusMainpp.match(/\bcnst\d{1,2}\b/g),  // constants
    ].filter(Boolean).flat());
    // Add in spnams from sp.
    let params = [...params2];
    const spParams = [...params].filter(p => p.startsWith("sp")).map(p => p.replace("sp", "spnam"));
    params.push(...spParams);
    // Sort parameters.
    params.sort(sortStrNum);
    // Add in a few bonus ones.
    params.push("aq", "ds", "FnMODE", "NBL", "ns");
    // Then map them to their definitions.
    const paramDefns = params.map(p => `;${p}: ${allParams[p]}`);

    // AU programme list {{{3
    const auProgs = backendModules.map(m => allModules.get(m).auprog);
    const auProgsStr = `; auprog: ${auProgs.join(":")}`;

    // Finally, string everything together {{{2
    pp.push(ppShortCodeName);
    pp.push(``);  // this adds a blank line
    pp.push(...shortDescriptions);
    pp.push(
        ``,
        `;$CLASS=HighRes`,
        `;$DIM=2D`,
        `;$TYPE=`,
        `;$SUBTYPE=`,
        `;$COMMENT=`,
        ``,
        `#include <Avance.incl>`,
        `#include <Grad.incl>`,
        `#include <Delay.incl>`,
        ``,
        `#ifdef NUS`,
        `define list<loopcounter> t1list=<$VCLIST>`,
        `#endif`,
        ``,
    );
    pp.push(...preambles);
    pp.push(
        `"l0      = td1/${2*nbl}"             ; Total number of 13C t1 increments`,
        `"l1      = 0"                 ; Running counter of 13C t1 increments`,
        `"l2      = 0"                 ; Counter, even for echo, odd for antiecho`,
        `"l3      = 0"                 ; Running counter for NS`,
    );
    if (asapMixing) {
        // The call to larger() silences divide-by-zero errors.
        pp.push(
            `"l6      = d15/(larger(p45,1u)*20)"  ; Number of ASAP loops`,
        );
    }
    if (extraDipsiMixing) {
        // extraDipsiMixing is true if there are two 13C modules and the first isn't
        // a HSQC-TOCSY.
        pp.push(
             `"l15    = (d29/(p6*115.112))/2"   ; half the number of DIPSI-2 loops between 13C modules`,
             `"l16    = l15*2"                  ; number of DIPSI-2 loops between 13C modules`,
        )
    }
    pp.push(
        `"acqt0   = 0"`,
        `baseopt_echo`,
    );
    pp.push(``);
    pp.push(...mainpp);
    pp.push(``);
    pp.push(...phaseDefns);
    pp.push(``);
    pp.push(...gpnamDefns);
    pp.push(...gpzDefns);
    pp.push(``);
    if (wvmDefns.length > 0) pp.push(`;WaveMaker shaped pulses (use 'wvm -a' to generate)`)
    pp.push(...wvmDefns);
    pp.push(``);
    pp.push(...paramDefns);
    pp.push(``);
    pp.push(auProgsStr);
    pp.push(`; ngn-${version}: constructed from ${backendModules.join(", ")}`);
    pp.push(`; pulse programme generated on ${(new Date()).toString()}`);
    return pp.join("\n");
}
// }}}1

// vim: foldmethod=marker
