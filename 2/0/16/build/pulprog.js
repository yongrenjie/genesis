// Get the version number.
import { version } from "./version.js";
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
// 9 - 13C module second DIPSI-2
// 10 - 1H module second DIPSI-2
// 11 - DIPSI-2 between 13C modules
// String definitions {{{2
const allParams = {
    // p - Pulse widths {{{3
    "p1": "f1 channel -  90 degree high power pulse",
    "p2": "f1 channel - 180 degree high power pulse",
    "p3": "f2 channel -  90 degree high power pulse",
    "p4": "f2 channel - 180 degree high power pulse",
    "p6": "f1 channel -  90 degree low power pulse for TOCSY",
    "p12": "f1 channel - 180 degree inversion for excitation sculpting [2-8 ms]",
    "p14": "f2 channel - 180 degree inversion [500 us for Crp60,0.5,20.1]",
    "p15": "f1 channel - duration of ROESY spin lock",
    "p16": "gradient pulse [1 ms]",
    "p17": "extended gradient pulse for 15N HSQC",
    "p19": "gradient pulse 2 [600 us]",
    "p21": "f3 channel -  90 degree high power pulse",
    "p22": "f3 channel - 180 degree high power pulse",
    "p24": "f2 channel - 180 degree refocusing [2 ms for Crp60comp.4]",
    "p25": "f1 channel - 180 degree pulse at pl27 for ROESY spin lock",
    "p31": "f2 channel - 180 degree inversion with J-compensation",
    "p32": "f1 channel - 180 degree adiabatic inversion [20 msec for Crp60,20,20.10]",
    "p33": "f1 channel - 180(x) BURBOP [600 us]",
    "p34": "f2 channel - 180 pp BIBOP [600 us]",
    "p40": "f1 channel - PSYCHE double saltire pulse [30 ms]",
    "p41": "f1 channel - PSYCHE ZQS chirp pulses [40 ms]",
    "p45": "f1 channel -  180 degree CAWURST-2 pulse",
    "p50": "f1 channel -  Adiabatic pulse for ROESY (half of total mixing time)",
    // pl - Pulse power levels {{{3
    "pl0": "0 W",
    "pl1": "f1 channel - power level for pulse (default)",
    "pl2": "f2 channel - power level for pulse (default)",
    "pl3": "f3 channel - power level for pulse (default)",
    "pl9": "f1 channel - power level for presaturation",
    "pl10": "f1 channel - power level for TOCSY-spinlock",
    "pl12": "f2 channel - power level for CPD/BB decoupling",
    "pl16": "f3 channel - power level for CPD/BB decoupling",
    "pl27": "f1 channel - power level for pulsed ROESY-spinlock",
    // sp, spnam - Shaped pulses {{{3
    "sp1": "f1 channel - shaped pulse 180 degree",
    "spnam1": "1H selective inversion - Sinc1.1000 or WaveMaker",
    "sp3": "f2 channel - shaped pulse (180 degree inversion)",
    "spnam3": "13C inversion - Crp60,0.5,20.1 or WaveMaker",
    "sp7": "f2 channel - shaped pulse (180 degree refocusing)",
    "spnam7": "13C refocusing - Crp60comp.4",
    "sp18": "f2 channel - shaped pulse (180 degree with J-compensation)",
    "spnam18": "13C J-compensated inversion - Crp60_xfilt.2 or WaveMaker",
    "sp29": "f1 channel - shaped pulse (adiabatic)",
    "spnam29": "1H ZQS chirp - Crp60,20,20.10 or WaveMaker",
    "sp33": "f1 channel - 180(x) BURBOP",
    "spnam33": "BUBI_1H_600u_RF20kHz",
    "sp34": "f2 channel - 180 pp BIBOP",
    "spnam34": "BUBI_13C_600u_RF10kHz",
    "sp40": "f1 channel - PSYCHE double saltire",
    "spnam40": "Crp_psyche.20",
    "sp41": "f1 channel - PSYCHE ZQS low-to-high chirp",
    "spnam41": "wuchirpLH (generate via WaveMaker)",
    "sp42": "f1 channel - PSYCHE ZQS high-to-low chirp",
    "spnam42": "wuchirpHL (generate via WaveMaker)",
    "sp45": "f1 channel - CAWURST-2 pulse (180 degree)",
    "spnam45": "wuASAP (generate via WaveMaker)",
    "sp49": "f1 channel - first shaped pulse WURSTAM (adiabatic) for ROESY mixing (high shift)",
    "spnam49": "wu180H1SL (generate via WaveMaker)",
    "sp50": "f1 channel - second shaped pulse WURSTAM (adiabatic) for ROESY mixing (low shift)",
    "spnam50": "wu180H1SL2 (generate via WaveMaker)",
    // cnst - Constants {{{3
    "cnst2": "= 1J(CH)",
    "cnst4": "= 1J(NH)",
    "cnst6": "= minimum 1J(CH)",
    "cnst7": "= maximum 1J(CH)",
    "cnst12": "> J(HH), ca. 30 Hz for CLIP-COSY mixing",
    "cnst13": "= nJ(CH) long-range",
    "cnst14": "= second nJ(CH) long-range for interleaved HMBC",
    "cnst16": "15N CTP gradient lengthening factor",
    "cnst17": "= -0.5 for Crp60comp.4",
    "cnst20": "PSYCHE saltire flip angle (degrees)",
    "cnst21": "PSYCHE saltire RF amplitude (Hz)",
    "cnst22": "PSYCHE drop points [ca. 4]",
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
    "cnst51": "RF amplitude of ROESY spin lock (Hz)",
    // d, in - Delays and increments {{{3
    "d0": "13C t1",
    "d1": "relaxation delay",
    "d2": "1/2J(CH)",
    "d3": "13C t1 for interleaved/time-shared modules",
    "d4": "1/4J(CH)",
    "d6": "1/8J(CH) for all multiplicities, 1/4J(CH) for CH only",
    "d8": "delay for NOE buildup",
    "d9": "DIPSI-2 mixing time (TOCSY)",
    "d10": "1H t1",
    "d11": "1H t1 (magnitude-mode)",
    "d12": "<1/4J(HH) CLIP-COSY mixing time",
    "d13": "1H t1 for interleaved/time-shared modules",
    "d14": "DIPSI-2 mixing time (TOCSY 2)",
    "d15": "optional ASAP mixing time [40-60 ms] (use `wvm`)",
    "d16": "delay for homospoil/gradient recovery [200 us]",
    "d19": "DIPSI-2 mixing time (1st 13C module)",
    "d20": "15N t1",
    "d23": "15N t1 for interleaved/time-shared modules",
    "d24": "1/4J(NH)",
    "d26": "1/8J(NH) for all multiplicities, 1/4J(NH) for NH only",
    "d29": "DIPSI-2 mixing time (2nd 13C module)",
    "d30": "DIPSI-2 mixing time (between 13C modules)",
    "inf1": "1/SW(C) = 2 * DW(C)",
    "in0": "1/(2 * SW(C)) = DW(C)",
    "in3": "1/(2 * SW(C)) = DW(C)",
    "in10": "1/(SW(H)) = 2 * DW(H)",
    "in13": "1/(SW(H)) = 2 * DW(H)",
    "in20": "1/(2 * SW(N)) = DW(N)",
    "in23": "1/(2 * SW(N)) = DW(N)",
    // l - Loop counters {{{3
    "l0": "TD1 / NBL, i.e. 'true TD1'",
    "l1": "running counter from 1 to TD1/NBL, for phase/delay incrementation",
    "l2": "running counter for scan number",
    "l6": "loop for ASAP mixing",
    "l7": "loop for ROESY spinlock = p15 / p25*2",
    "l11": "DIPSI-2 (1H module): half the number of DIPSI-2 cycles",
    "l12": "DIPSI-2 (1H module): actual number of DIPSI-2 cycles",
    "l13": "DIPSI-2 (1st 13C module): half the number of DIPSI-2 cycles",
    "l14": "DIPSI-2 (1st 13C module): actual number of DIPSI-2 cycles",
    "l15": "DIPSI-2 (2nd 13C module): half the number of DIPSI-2 cycles",
    "l16": "DIPSI-2 (2nd 13C module): actual number of DIPSI-2 cycles",
    "l17": "DIPSI-2 (between 13C modules): half the number of DIPSI-2 cycles",
    "l18": "DIPSI-2 (between 13C modules): actual number of DIPSI-2 cycles",
    "l19": "DIPSI-2 (2nd 1H module): half the number of DIPSI-2 cycles",
    "l20": "DIPSI-2 (2nd 1H module): actual number of DIPSI-2 cycles",
    // Miscellaneous {{{3
    "cpd2": "13C decoupling according to sequence defined by cpdprg2",
    "cpd3": "15N decoupling according to sequence defined by cpdprg3",
    "pcpd2": "f2 channel - 90 degree pulse for decoupling sequence",
    "pcpd3": "f3 channel - 90 degree pulse for decoupling sequence",
    "aq": "acquisition time",
    "ds": ">= 16",
    "FnMODE": "echo-antiecho",
    "NBL": "number of blocks (NOAH modules)",
    "ns": "1 * n",
    // }}}3
};
// Phases {{{2
class Phase {
    constructor({ num, str, ea = "", nt1 = "", ct1 = "", ht1 = "" }) {
        this.num = num; // phXX
        this.str = str; // string describing the phases e.g. "0 0 0 0 2 2 2 2"
        this.ea = ea; // actions to take when EA / 15N t1 etc. is incremented.
        this.nt1 = nt1; //    these are stored as strings.
        this.ct1 = ct1; //    syntax: 'i' for increment (by 90deg), 'i2' for increment by 180
        this.ht1 = ht1; //            'r' for reset
    }
    makeInstruction(occasion) {
        const shortInst = this[occasion];
        if (shortInst.length === 0) {
            return ``;
        }
        else if (shortInst.length === 1) {
            return `${shortInst}p${this.num}`; // 'ip30' or 'rp30'
        }
        else if (shortInst.length === 2) {
            return `${shortInst[0]}p${this.num}*${shortInst[1]}`; // 'ip30*2'
        }
        else {
            throw new Error("invalid occasion");
        }
    }
}
const allPhases = new Array(32);
allPhases[0] = new Phase({ num: 0, str: "0" });
allPhases[1] = new Phase({ num: 1, str: "1" });
allPhases[2] = new Phase({ num: 2, str: "2" });
allPhases[3] = new Phase({ num: 3, str: "3" });
allPhases[4] = new Phase({ num: 4, str: "0 2", nt1: "i2" });
allPhases[5] = new Phase({ num: 5, str: "0 2", ct1: "i2" });
allPhases[6] = new Phase({ num: 6, str: "0 2", ea: "i", ct1: "r" });
allPhases[7] = new Phase({ num: 7, str: "0 0 2 2" });
allPhases[8] = new Phase({ num: 8, str: "2 2 0 0" });
allPhases[9] = new Phase({ num: 9, str: "1 1 3 3", ea: "i2" }); // seHSQC
allPhases[10] = new Phase({ num: 10, str: "3 3 1 1", ea: "i2" }); // seHSQC
allPhases[11] = new Phase({ num: 11, str: "0 0 0 0 2 2 2 2" });
allPhases[12] = new Phase({ num: 12, str: "0 2" });
allPhases[14] = new Phase({ num: 14, str: "0 1 2 3" });
allPhases[15] = new Phase({ num: 15, str: "0 1" });
allPhases[16] = new Phase({ num: 16, str: "1 3", ea: "i", ct1: "r" }); // DQF-COSY ph
allPhases[17] = new Phase({ num: 17, str: "1 1 3 3" });
allPhases[18] = new Phase({ num: 18, str: "0 2", ht1: "i2" }); // time-shared 13C coherence transfer (replaces ph5)
allPhases[19] = new Phase({ num: 19, str: "1 1 3 3", ct1: "i2" }); // time-shared 13C seHSQC (replaces ph9)
allPhases[20] = new Phase({ num: 20, str: "0 2", ct1: "i", ht1: "r" }); // time-shared 1H States (replaces ph6)
// ... plenty of empty slots to use
// below are for receivers
allPhases[23] = new Phase({ num: 23, str: "0 0 2 2", ht1: "i2" }); // HSQC-COSY interleaved (replaces ph25)
allPhases[24] = new Phase({ num: 24, str: "0 2 2 0", ht1: "i2" }); // 13C EA for interleaved (replaces ph30)
allPhases[25] = new Phase({ num: 25, str: "0 0 2 2", ct1: "i2" }); // HSQC-COSY
allPhases[26] = new Phase({ num: 26, str: "0 2" });
allPhases[27] = new Phase({ num: 27, str: "1 3 3 1", nt1: "i2" });
allPhases[28] = new Phase({ num: 28, str: "1 3 3 1", ct1: "i2" });
allPhases[29] = new Phase({ num: 29, str: "0 2 2 0", nt1: "i2" });
allPhases[30] = new Phase({ num: 30, str: "0 2 2 0", ct1: "i2" });
allPhases[31] = new Phase({ num: 31, str: "0 2", ct1: "i2" });
// Gradients {{{2
class Gradient {
    constructor({ num, val, comment = "", shape = "SMSQ10.100" }) {
        this.num = num; // gpzXX
        this.val = val; // float: amplitude in percentage
        this.comment = comment.trim(); // description of the gradient
        this.shape = shape; // gradient shape
    }
    makeGpnamInstruction() {
        if (Boolean(this.shape))
            return `;gpnam${this.num}: ${this.shape}`;
        else
            return ``; // no shape -- for gron/groff commands
    }
    makeGpzInstruction() {
        let s = `;gpz${this.num}: ${this.val}%`;
        if (Boolean(this.comment))
            s += ` (${this.comment})`;
        return s;
    }
}
const allGradients = new Array(32);
allGradients[0] = new Gradient({ num: 0, val: 29, comment: "for purging" });
allGradients[1] = new Gradient({ num: 1, val: 80, comment: "HMBC CTP" });
allGradients[2] = new Gradient({ num: 2, val: 80, comment: "15N CTP" });
allGradients[3] = new Gradient({ num: 3, val: 75, comment: "13C alternate module CTP" });
allGradients[4] = new Gradient({ num: 4, val: 70, comment: "13C CTP" });
allGradients[5] = new Gradient({ num: 5, val: 10, comment: "1H CTP" });
allGradients[6] = new Gradient({ num: 6, val: 11, comment: "13C spin echo CTP" });
allGradients[7] = new Gradient({ num: 7, val: -5, comment: "13C spin echo CTP" });
allGradients[8] = new Gradient({ num: 8, val: 13, comment: "15N spin echo CTP" });
allGradients[9] = new Gradient({ num: 9, val: -6, comment: "15N spin echo CTP" });
allGradients[10] = new Gradient({ num: 10, val: 5, comment: "HMBC J-filter" });
allGradients[11] = new Gradient({ num: 11, val: 43, comment: "1H purge gradient" });
allGradients[12] = new Gradient({ num: 12, val: 11, comment: "1H ZQ filter", shape: "" });
allGradients[13] = new Gradient({ num: 13, val: 19, comment: "13C DIPSI-2 purge gradients" });
allGradients[14] = new Gradient({ num: 14, val: 1, comment: "1H PSYCHE weak gradient", shape: "RECT.1" });
allGradients[15] = new Gradient({ num: 15, val: 1, comment: "1H PSYCHE ZQS weak gradient", shape: "RECT.1" });
allGradients[16] = new Gradient({ num: 16, val: 35, comment: "1H PSYCHE CTP gradient 1" });
allGradients[17] = new Gradient({ num: 17, val: 49, comment: "1H PSYCHE CTP gradient 2" });
allGradients[18] = new Gradient({ num: 18, val: 77, comment: "1H PSYCHE CTP gradient 3" });
allGradients[19] = new Gradient({ num: 19, val: 37, comment: "1H CTP" }); // stronger grad needed for e.g. DQF-COSY
allGradients[20] = new Gradient({ num: 20, val: 57, comment: "1H excitation sculpting" });
allGradients[21] = new Gradient({ num: 21, val: 32, comment: "1H excitation sculpting" });
// WaveMaker definitions {{{2
const allWavemakers = new Array(64);
allWavemakers[1] = ";sp1:wvm:wu180H1Sinc: sinc180(p12)";
allWavemakers[3] = ";sp3:wvm:wu180C13: cawurst-20(60 kHz, 0.5 ms; L2H)";
allWavemakers[18] = ";sp18:wvm:wu180Jcomp: cawurst-40(280 ppm; Jcomp, L2H)";
allWavemakers[29] = ";sp29:wvm:wu180H1ZQS: sm_chirp(60 kHz, 20 ms; H2L, Q=5)";
allWavemakers[41] = ";sp41:wvm:wuchirpLH: sm_chirp(10 kHz, 40 ms; L2H, Q=5) np=10000";
allWavemakers[42] = ";sp42:wvm:wuchirpHL: sm_chirp(10 kHz, 40 ms; H2L, Q=5) np=10000";
allWavemakers[45] = ";sp45:wvm:wuASAP: cawurst-2(30 ppm, 1.0 ms; Q=3)";
allWavemakers[49] = ";sp49:wvm:wu180H1SL: wurstAM(p50, cnst49 ppm; B1max = 5.0 kHz)";
allWavemakers[50] = ";sp50:wvm:wu180H1SL2: wurstAM(p50, cnst50 ppm; B1max = 5.0 kHz)";
// }}}1
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
function makeDipsi(label, loopCounter, delay) {
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
    ].join("\n");
    let preamble = [
        `"l${loopCounter - 1}     = (d${delay}/(p6*115.112))/2"       ; half the number of DIPSI-2 loops`,
        `"l${loopCounter}     = l${loopCounter - 1}*2"                      ; number of DIPSI-2 loops`
    ].join("\n");
    return [pulprog, preamble];
}
function* makeDipsiGenerator() {
    let n_c13_modules = 0; // Number of 13C modules seen so far.
    let n_h1_modules = 0; // Number of 1H modules seen so far.
    // Seed the generator so that the next time we call it, we can
    // pass in moduleType.
    let moduleType = yield ["", ""];
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
// Standardised ASAP mixing string {{{1
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
];
// }}}1
// Standardised solvent suppression for homonuclear modules {{{1
// Only double spin echo excitation sculpting for now...
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
function homonuclearSolvSupp(grad_factor) {
    const grad_multiply = grad_factor === 1 ? '' : `*${grad_factor}`;
    const solvSuppText = [
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
    const solvSuppPreamble = [
        `define delay DH_EXSCULPT`,
        `"DH_EXSCULPT = de+p1*2/3.1416"`
    ];
    return [solvSuppText, solvSuppPreamble];
}
// }}}1
// The Parameter class {{{1
class Parameter {
    constructor(name, definition, definitionComment) {
        const endingNumberMatch = name.match(/\d+$/);
        if (endingNumberMatch === null)
            this.str = name;
        else {
            this.num = Number(endingNumberMatch[0]);
            this.str = name.slice(0, -endingNumberMatch[0].length);
        }
        this.definition = definition;
        this.definitionComment = definitionComment;
    }
    // Regenerate the 'usual' name.
    name() {
        // Technically the cast isn't necessary, but why risk it? I really
        // don't like how JS plays so hard and fast with types.
        if (this.num !== undefined)
            return this.str + String(this.num);
        else
            return this.str;
    }
    // Comparison function for two parameters.
    // compare(p1, p2) returns negative if p1 < p2.
    static compare(param1, param2) {
        let isUpper = (char) => char === char.toUpperCase();
        let isLower = (char) => char === char.toLowerCase();
        // Note that we want the manually defined delays (which start with
        // D...) to go at the end, so we must make sure that capitalised
        // parameters always come after uncapitalised parameters.
        if (isUpper(param1.str[0]) && isLower(param2.str[0]))
            return 1;
        if (isLower(param1.str[0]) && isUpper(param2.str[0]))
            return -1;
        // Compare string part first.
        if (param1.str < param2.str)
            return -1;
        else if (param1.str > param2.str)
            return 1;
        else {
            // Compare number if the string parts are equal.
            if (param1.num === undefined && param2.num === undefined)
                return 0;
            else if (param1.num === undefined)
                return -1;
            else if (param2.num === undefined)
                return 1;
            else
                return (param1.num - param2.num);
        }
    }
    // Extract a Parameter from a preamble line / definition.
    static fromPreamble(line) {
        let name;
        let definition;
        let definitionComment;
        const [part1, part2] = line.split(";");
        if (part2)
            definitionComment = part2.trim();
        name = part1.split("=")[0].slice(1).trim();
        definition = part1.split("=")[1].split('"')[0].trim();
        return new Parameter(name, definition, definitionComment);
    }
    // Convert a Parameter back into a preamble line.
    toPreamble(nameLength = 0, definitionLength = 0) {
        let line = `"${this.name().padEnd(nameLength)}`;
        line += ` = ${(this.definition + '"').padEnd(definitionLength + 1)}`;
        if (this.definitionComment) {
            line += ` ; ${this.definitionComment}`;
        }
        return line.trimEnd();
    }
    // Convert a Parameter into a postamble line.
    toPostamble() {
        return `;${this.name()}: ${allParams[this.name()]}`;
    }
}
// }}}1
// removeDuplicateByKey(): a helper function {{{1
/**
 * Remove duplicates from a list according to a function f. In other words, if
 * a list has two elements x1 and x2 such that f(x1) = f(x2), then x2 is
 * removed from the list (this function retains only the first occurrence).
 *
 * removeDuplicateByKey(xs, f) gives the same behaviour as
 *     nubBy ((==) `on` f) xs
 * in Haskell.
 */
function removeDuplicateByKey(lines, keyfn) {
    const keys = lines.map(keyfn);
    return lines.filter((l, pos) => keys.indexOf(keyfn(l)) == pos);
}
// }}}1
// makePulprogText(): the big function {{{1
/**
 * Construct the pulse programme.
 *
 * @param {string[]} trueModuleNames - Array of strings indicating the backend
 *                                     modules to be used in pulse programme
 *                                     construction.
 * @param {Map<string, NOAHModule>} allModules - Imported from allModules.js.
 * @param {boolean} allowLoneModule - If set to False, then return the empty
 *                                    string when NBL < 2.
 * @param {boolean} allowHmbcHom - If set to False, then return the empty
 *                                 string when HMBC is followed directly by a
 *                                 homonuclear module.
 */
export function makePulprogText(trueModuleNames, allModules, allowLoneModule, allowHmbcHom) {
    // Initialisation {{{2
    // Error out if any modules don't exist.
    const missingModules = trueModuleNames.filter(name => !allModules.has(name));
    if (missingModules.length > 0) {
        const errMsg = `module(s) ${missingModules.join(", ")} not found`;
        console.error(errMsg);
        return errMsg;
    }
    // Get the modules. We need the type assertion because we've already checked above
    // that allModules *does* contain the modules, hence allModules.get(name) cannot
    // possibly return undefined. TypeScript can't figure this out, so it thinks that
    // modules has type Array<NOAHModule | undefined>.
    const modules = trueModuleNames.map(name => allModules.get(name));
    const n = modules.length;
    // Set some flags that will help us later
    const hasHmbcModule = modules.some(mod => mod.category === "hmbc");
    const hasNModule = modules.some(mod => mod.category === "n15");
    const hasHModule = modules.some(mod => mod.category === "h1");
    const asapMixing = hasHmbcModule && hasHModule;
    const CModules = modules.filter(mod => mod.category === "c13");
    const hasCModule = CModules.length > 0;
    const hasMultipleCModules = CModules.length > 1;
    const extraDipsiMixing = hasMultipleCModules && !CModules[0].hasDipsi();
    const hasInterleaved = modules.some(mod => mod.interleaved);
    // The value of this flag is hardcoded, but is placed here in anticipation
    // of other situations in which we might not want to have the NUS flag,
    // e.g. time-shared modules.
    const useNusFlag = (!hasInterleaved
        && trueModuleNames.every(name => !name.includes("H_JRES"))
        && trueModuleNames.every(name => !name.includes("H_PSYCHE"))
        && trueModuleNames.every(name => !name.includes("H_COSY_QF")));
    // Exit immediately if HMBC is followed directly by a homonuclear module.
    if (!allowHmbcHom &&
        hasHmbcModule && !hasNModule && !hasCModule && hasHModule) {
        return "HMBC + homonuclear module combinations are not very effective\nPlease use developer mode if you really want these";
    }
    // Initialise pulse programme components.
    // All these are arrays of strings.
    let nbl = 0;
    let nAdvertisedModules = 0; // may differ from NBL because of interleaved modules
    let pp = [];
    let shortCodes = [];
    let shortCodesInterleaved = [];
    let shortDescriptions = [];
    let preambles = [];
    let citations = [];
    let mainpp = []; // the bulk of the pulse programme
    // Initialise and seed DIPSI-2 generator.
    const dipsiGen = makeDipsiGenerator();
    dipsiGen.next(); // so that we can pass next() a parameter next time.
    // Construct the beginning of mainpp (ze, d1 etc.) {{{2
    // Figure out which nucleus to stop decoupling on, if any.
    let stopDec = "";
    const lastModule = modules[n - 1];
    if (lastModule.pulprog.includes('cpd2:f2'))
        stopDec = " do:f2";
    else if (lastModule.pulprog.includes('cpd3:f3'))
        stopDec = " do:f3";
    mainpp.push(`1 ze`, `2 30m`, // NS loop (go=2 phXX) goes back to here
    `3 5m${stopDec}`, // EA loop goes back to here
    `4 50u UNBLKGRAD`, // t1 loop goes back to here
    `  1m iu2`, ``, `  ; Cleanup`);
    // Context-dependent cleanup before d1.
    if (hasCModule)
        mainpp.push(`  4u pl2:f2`, `  (p3 ph0):f2`);
    if (hasNModule)
        mainpp.push(`  4u pl3:f3`, `  (p21 ph0):f3`);
    mainpp.push(`  4u pl1:f1`, `  p16:gp0`, `  d16`, `  (p1 ph0):f1`, `  4u`, `  p16:gp0*1.37`, `  d16`, `  4u BLKGRAD`);
    // Either d1 or presaturation
    mainpp.push(`#ifdef PRESAT`, `  4u pl9:f1`, `  10u st0`, `  d1 cw:f1`, `  4u do:f1`, `  4u pl1:f1`, `#else`, `  d1 st0`, `#endif /* PRESAT */`, `  4u UNBLKGRAD`);
    // Construct the body of mainpp {{{2
    // Generator which spits out numbers to multiply purge gradients by.
    function* gradGenFunc() {
        yield* [1.77, 2.32, -1.29, 0.71];
    }
    const gradGen = gradGenFunc();
    // Iterate over modules. The hard work of constructing the pulse programme
    // is done here.
    for (const [i, mod] of modules.entries()) { // n is the number of backend modules
        const nextMod = modules[i + 1];
        nbl += mod.nfid;
        const interleavedFactor = mod.interleaved ? 2 : 1;
        nAdvertisedModules += mod.nfid * interleavedFactor;
        // Collect shortCodes, shortDescriptions, and preambles.
        // The preambles will later be postprocessed.
        const codes = mod.shortCode.split(" ");
        if (codes.length == 2) { // interleaved modules
            shortCodes.push(codes[0]);
            shortCodesInterleaved.push(codes[1]);
        }
        else {
            shortCodes.push(mod.shortCode);
        }
        shortDescriptions.push(...mod.shortDescription.split("\n"));
        preambles.push(...mod.preamble
            .split("\n")
            .map(l => l.replace(/\[ID\]/g, trueModuleNames[i])));
        citations.push(...mod.citations);
        // Collect the pulse programmes themselves.
        mainpp.push(``, ``, `  ; MODULE ${i + 1}`);
        let trimNewlines = ((s) => s.replace(/^\n|\n$/g, ''));
        let ppLines = trimNewlines(mod.pulprog).split("\n");
        // Handle DIPSI-2 inside pp_lines.
        let ppDipsiLineNo = ppLines.findIndex(line => line.includes("|DIPSI|"));
        while (ppDipsiLineNo != -1) { // means it was found
            if (mod.category == "c13" || mod.category == "h1") {
                let [dipsiPP, dipsiPreamble] = dipsiGen.next(mod.category).value;
                ppLines[ppDipsiLineNo] = dipsiPP;
                preambles.push(...dipsiPreamble.split("\n"));
            }
            else {
                throw new Error("DIPSI-2 found inside wrong type of module");
            }
            ppDipsiLineNo = ppLines.findIndex(line => line.includes("|DIPSI|"));
        }
        // Handle solvent suppression string in homonuclear modules
        if (mod.category == "h1") {
            let ppSolvSuppLineNo = ppLines.findIndex(line => line.includes("|SOLVSUPP"));
            while (ppSolvSuppLineNo != -1) { // means it was found
                let line = ppLines[ppSolvSuppLineNo];
                let m = line.match(/\|SOLVSUPP(\((?<factor>\d+(\.\d+)?)\))?\|/);
                // Determine gradient strength factor
                let factor = 1;
                if (m === null || m.groups == undefined) {
                    throw new Error(`SOLVSUPP error in line: '${line}' in module: '${trueModuleNames[i]}'`);
                }
                if (m.groups.factor !== undefined) {
                    factor = Number(m.groups.factor);
                }
                let [solvSuppText, solvSuppPreamble] = homonuclearSolvSupp(factor);
                ppLines.splice(ppSolvSuppLineNo, 1, ...solvSuppText);
                preambles.push(...solvSuppPreamble);
                // Find next occurrence (if it exists)
                ppSolvSuppLineNo = ppLines.findIndex(line => line.includes("|SOLVSUPP"));
            }
        }
        // Add the current module's pulse programme to the concatenated list
        mainpp.push(...ppLines
            .map(l => l.replace(/\[ID\]/g, trueModuleNames[i])));
        // Add anything that we might need between modules: extra DIPSI-2, ASAP
        // mixing, or general purge gradients.
        if (extraDipsiMixing
            && mod.category === "c13" && !mod.hasDipsi()
            && nextMod !== undefined && nextMod.category === "c13") {
            let [extraDipsiPP, extraDipsiPreamble] = makeDipsi("11", 18, 30);
            preambles.push(...extraDipsiPreamble.split("\n"));
            mainpp.push(``, `if "d30 > 1m"`, `{`, `  50u`, `  p16:gp13`, `  d16 pl10:f1`, extraDipsiPP, `  p16:gp13*1.333`, `  d16`, `}`);
        }
        if (asapMixing
            && nextMod !== undefined && nextMod.category === "h1")
            mainpp.push(...asapMixingPPText);
        // Cleanup
        if (i < n - 1) {
            mainpp.push(``, `  ; Cleanup`, `  4u pl1:f1`);
            if (mod.nuclei().includes('C'))
                mainpp.push(`  4u pl2:f2`, `  (p3 ph0):f2`);
            if (mod.nuclei().includes('N'))
                mainpp.push(`  4u pl3:f3`, `  (p21 ph0):f3`);
            mainpp.push(`  4u`, `  p16:gp0*${gradGen.next().value}`, `  d16`, `  10u st`);
        }
    }
    // Construct the end of mainpp (EA/t1 incrementation) {{{2
    // Initialisation {{{3
    // Use a regex to find all phases in the pulse programme text
    let phasesSet = new Set(mainpp.join("\n").match(/ph\d{1,2}/g));
    let phases = Array.from(phasesSet)
        .map(phx => Number(phx.slice(2))) // extract the number
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
    const d3Present = (mainppTemp.search(/\bd3\b/) != -1);
    const d10Present = (mainppTemp.search(/\bd10\b/) != -1);
    const d11Present = (mainppTemp.search(/\bd11\b/) != -1);
    const d13Present = (mainppTemp.search(/\bd13\b/) != -1);
    const d20Present = (mainppTemp.search(/\bd20\b/) != -1);
    const ea1Present = (mainppTemp.search(/\bEA1\b/) != -1);
    const ea2Present = (mainppTemp.search(/\bEA2\b/) != -1);
    // For cnst38 it is a bit more tricky. We have not yet added the preambles so we can't simply
    // search in mainppTemp. We have to check the preamble of the module itself.
    const cnst38Present = lastModule.preamble.includes("cnst38");
    // Add in NUS redefinitions of t1 delays (to be used with -DNUS zgoptn flag)
    if (useNusFlag && (d0Present || d10Present || d11Present || d20Present)) {
        let nusRedefinitions = [``, `#ifdef NUS`];
        if (d0Present)
            nusRedefinitions.push(`  "d0=(in0*t1list)+3u"`);
        if (d10Present)
            nusRedefinitions.push(`  "d10=(in10*t1list)+3u"`);
        if (d11Present)
            nusRedefinitions.push(`  "d11=(in11*t1list)+3u"`);
        if (d20Present)
            nusRedefinitions.push(`  "d20=(in20*t1list)+3u"`);
        nusRedefinitions.push(`#endif /* NUS */`);
        mainpp.splice(4, 0, ...nusRedefinitions);
    }
    // incrementation on every round of l1 {{{3
    mainpp.push(``, `  ; incrementation on every pass`, `  1m iu1`);
    // gradients (EA, EA1, EA2) {{{4
    mainpp.push(`  1m igrad EA`);
    if (ea1Present)
        mainpp.push(`  1m igrad EA1`);
    if (ea2Present)
        mainpp.push(`  1m igrad EA2`);
    // 1H t1 for QF modules (d11) which aren't k-scaled {{{4
    if (d11Present && !cnst38Present) {
        mainpp.push(`  1m id11`);
    }
    // Some pulse phases (e.g. seHSQC) {{{4
    const eaPhaseInstructions = phases.map(p => allPhases[p].makeInstruction("ea")).filter(Boolean);
    eaPhaseInstructions.forEach(inst => mainpp.push(`  1m ${inst}`));
    // Write data to disk {{{4
    mainpp.push(`  30m wr #0 if #0 zd`);
    // incrementation every 2 rounds of l1 {{{3
    mainpp.push(``, `  ; incrementation on every second pass`, `if "l1 % 2 == 0" {`);
    // NUS list {{{4
    if (useNusFlag) {
        mainpp.push(`#ifdef NUS`, `  1m t1list.inc`, `#endif /* NUS */`);
    }
    // 13C phases (a slightly misleading name; this includes 1H phases) {{{4
    const ct1PhaseInstructions = phases.map(p => allPhases[p].makeInstruction("ct1")).filter(Boolean);
    ct1PhaseInstructions.forEach(inst => mainpp.push(`  1m ${inst}`));
    // 13C t1 {{{4
    if (d0Present) {
        if (useNusFlag) {
            mainpp.push(`#ifdef NUS`, `#else`, `  1m id0`, `#endif /* NUS */`);
        }
        else
            mainpp.push(`  1m id0`);
    }
    // 1H t1 {{{4
    if (d10Present && !cnst38Present) {
        if (useNusFlag) {
            mainpp.push(`#ifdef NUS`, `#else`, `  1m id10`, `#endif /* NUS */`);
        }
        else
            mainpp.push(`  1m id10`);
    }
    // 15N phases (but only if NUS is enabled, which disables cnst39) {{{4
    if (hasNModule && useNusFlag) {
        const nt1PhaseInstructions = phases.map(p => allPhases[p].makeInstruction("nt1")).filter(Boolean);
        mainpp.push(`#ifdef NUS`);
        nt1PhaseInstructions.forEach(inst => mainpp.push(`  1m ${inst}`));
        mainpp.push(`#endif /* NUS */`);
    }
    // EA for interleaved modules {{{4
    if (hasInterleaved) {
        mainpp.push(`  1m igrad EA_TS`);
    }
    // }}}4
    mainpp.push('}');
    // incrementation every 4 rounds of l1 {{{3
    if (hasInterleaved) {
        mainpp.push(``, `  ; incrementation on every fourth pass`, `if "l1 % 4 == 0" {`);
        const ht1PhaseInstructions = phases.map(p => allPhases[p].makeInstruction("ht1")).filter(Boolean);
        ht1PhaseInstructions.forEach(inst => mainpp.push(`  1m ${inst}`));
        if (d3Present)
            mainpp.push('  1m id3');
        if (d13Present)
            mainpp.push('  1m id13');
        mainpp.push('}');
    }
    // incrementation every (l0 / cnst37) rounds: 1H QF k-scaled modules (QF JRES / [TSE-]PSYCHE) {{{3
    if (d11Present && cnst38Present) {
        mainpp.push(`if "l1 % (l0 / cnst37) == 0"`, // TODO: TEST cnst37 modules
        `{`, `  1m id11`, `}`);
    }
    // incrementation every (2 * l0 / cnst37) rounds: 1H phase-sensitive k-scaled modules (PSYCHE JRES) {{{3
    if (d10Present && cnst38Present) {
        mainpp.push(`if "l1 % (2 * l0 / cnst37) == 0"`, /* TODO: Test cnst37 modules */ `{`, `  1m id10`, `}`);
    }
    // incrementation every (2 * cnst39) rounds: 15N modules without NUS {{{3
    if (hasNModule) {
        const nt1PhaseInstructions = phases.map(p => allPhases[p].makeInstruction("nt1")).filter(Boolean);
        if (useNusFlag) {
            mainpp.push(`#ifdef NUS`, `#else`, `if "l1 % (2 * cnst39) == 0"`, `{`, `  1m id20`);
            nt1PhaseInstructions.forEach(inst => mainpp.push(`  1m ${inst}`));
            mainpp.push(`}`, `#endif /* NUS */`);
        }
        else {
            mainpp.push(`if "l1 % (2 * cnst39) == 0"`, `{`, `  1m id20`);
            nt1PhaseInstructions.forEach(inst => mainpp.push(`  1m ${inst}`));
            mainpp.push(`}`);
        }
    }
    // Final loop and exit {{{3
    mainpp.push(`  lo to 4 times l0`); // loop TD1/NBL times
    // BLKGRAD and exit.
    mainpp.push(``, `50u BLKGRAD`, `exit`);
    const mainppText = mainpp.join("\n"); // convenience string for future use
    // Postprocess preambles {{{2
    //
    // Return an empty string if we have more than five or less than one module.
    if (nbl > 5)
        return "NBL > 5 is not currently supported by TopSpin";
    if (nbl < 2 && !allowLoneModule)
        return "";
    // Construct pulse programme name
    let ppShortCodeName = `gns_noah${nAdvertisedModules}-${shortCodes.join("")}`;
    if (shortCodesInterleaved.length > 0) {
        ppShortCodeName += `-${shortCodesInterleaved.join("")}`;
    }
    // Create citation texts.
    const citationText = [...new Set(citations)]
        .map(c => c.makePPCitation())
        .join("\n\n");
    // Start by removing extra whitespace and empty lines.
    preambles = preambles.map(l => l.trim()).filter(Boolean);
    // There are three types of lines that we need to deal with:
    // 1) define delay XX, 2) define list<gradient>XX, 3) the rest
    let defineDelayLines = preambles
        .filter(l => l.startsWith("define delay"))
        .sort((la, lb) => Parameter.compare(new Parameter(la), new Parameter(lb)));
    let defineGradLines = preambles
        .filter(l => l.startsWith("define list<gradient>"))
        .sort();
    let preambleParams = preambles
        .filter(l => !(l.startsWith("define")))
        .map(l => Parameter.fromPreamble(l));
    // Remove duplicates inside defineDelayLines and defineGradLines
    defineDelayLines = removeDuplicateByKey(defineDelayLines, (l => l));
    defineGradLines = removeDuplicateByKey(defineGradLines, (l => l));
    // Sort parameter lines. Note that Parameter.compare() automatically
    // makes sure that 'custom' delays D_XXX occur below the standard delays
    // dXX, which is necessary for TopSpin to parse the pulse programme.
    preambleParams.sort(Parameter.compare);
    // Then remove duplicates according to the full parameter name
    preambleParams = removeDuplicateByKey(preambleParams, (p => p.name()));
    // Find the lengths for pretty-printing the parameters.
    const longestName = Math.max(...preambleParams.map(p => p.name().length));
    const longestDefn = Math.max(...preambleParams.map(p => p.definition.length));
    // Now we can stick the preambles back together in the right order.
    const preamblesText = [
        ...defineDelayLines,
        ...preambleParams.map(p => p.toPreamble(longestName, longestDefn)),
        ...defineGradLines
    ].join("\n");
    // Postprocess mainpp {{{2
    // Remove st0 commands from sequences with NBL=1 (triggers warning in TS4)
    // The only lines we have to deal with are 'd1 st0' and '10u st0', so this
    // regex works for now (and possibly the conceivable future).
    if (nbl == 1) {
        mainpp = mainpp.map(line => line.replace(/ st0$/, ""));
    }
    // Create postamble components {{{2
    // Phase definitions {{{3
    const phaseDefns = phases.map(p => `ph${p}=${allPhases[p].str}`);
    // Gradient definitions {{{3
    let gradients2 = new Set([
        mainppText.match(/gp\d{1,2}/g),
        mainppText.match(/gron\d{1,2}/g)
    ]
        .filter(Boolean)
        .flat()
        .map(s => s.replace("gron", "").replace("gp", ""))); // extract the number
    // the ! in the previous line is needed because TypeScript doesn't know that
    // filter(Boolean) removes null results from str.match().
    let gradients = Array.from(gradients2, Number).sort((a, b) => a - b);
    const gpnamDefns = gradients.map(g => allGradients[g].makeGpnamInstruction()).filter(Boolean);
    const gpzDefns = gradients.map(g => allGradients[g].makeGpzInstruction());
    // WaveMaker definitions {{{3
    let shapedPulses2 = new Set(mainppText.match(/p\d{1,2}:sp\d{1,2}/g));
    let shapedPulses = Array.from(shapedPulses2)
        .map(s => Number(s.split(":")[1].slice(2))) // extract the number
        .sort((a, b) => a - b);
    let wvmDefns = shapedPulses.map(s => allWavemakers[s]).filter(e => e !== undefined);
    // If there is 13C decoupling we should add in the pulses for adiabatic decoupling.
    if (mainpp.join("\n").includes("cpd2:f2")) {
        wvmDefns.push(";cpd2:wvm:wudec: cawurst_d-20(220 ppm, 1.4 ms; L2H)");
    }
    // Parameter definitions {{{3
    // We need to scan the preamble and mainppText with several regexes. Type assertion
    // needed because TypeScript doesn't know that filter(Boolean) removes nulls.
    const preamblePlusMainpp = preamblesText + "\n" + mainppText;
    let allPpParamNames = [...new Set([
            preamblePlusMainpp.match(/\bp\d{1,2}\b/g), // pulses
            preamblePlusMainpp.match(/\bd\d{1,2}\b/g), // delays
            preamblePlusMainpp.match(/\bl\d{1,2}\b/g), // loop counters
            preamblePlusMainpp.match(/\bsp\d{1,2}\b/g), // shaped pulses
            preamblePlusMainpp.match(/\bpl\d{1,2}\b/g), // power levels
            preamblePlusMainpp.match(/\bcpd\d{1,2}\b/g), // decoupling programme
            preamblePlusMainpp.match(/\bcnst\d{1,2}\b/g), // constants
        ].filter(Boolean).flat())];
    // Add in the spnams.
    const spParams1 = allPpParamNames.filter(p => p.startsWith("sp")).map(p => p.replace("sp", "spnam"));
    allPpParamNames.push(...spParams1);
    // Sort them and throw them all into a list of Parameters, with a few bonus ones.
    const bonusParams = ["aq", "ds", "FnMODE", "NBL", "ns"];
    const paramDefns = [
        ...allPpParamNames.map(n => new Parameter(n)).sort(Parameter.compare),
        ...bonusParams.map(n => new Parameter(n)),
    ].map(p => p.toPostamble());
    // AU programme list {{{3
    const auProgs = modules.map(m => m.auprog);
    const auProgsStr = `; auprog: ${auProgs.join(":")}`;
    // Finally, string everything together {{{2
    pp.push(`; ${ppShortCodeName}`, ``, ...shortDescriptions, ``, `; set 'NBL' TopSpin parameter to ${nbl}`, `;     [use -DPRESAT for presaturation during d1]`, ``, `;$CLASS=HighRes`, `;$DIM=2D`, `;$TYPE=`, `;$SUBTYPE=`, `;$COMMENT=`, ``, citationText, ``, `#include <Avance.incl>`, `#include <Grad.incl>`, `#include <Delay.incl>`, ``);
    if (useNusFlag) {
        pp.push(`#ifdef NUS`, `define list<loopcounter> t1list=<$VCLIST>`, `#endif /* NUS */`, ``);
    }
    pp.push(preamblesText, `"l0      = td1/${nbl}"             ; TD1/NBL`, `"l1      = 0"                 ; Running counter for delay / phase incrementation`, `"l2      = 0"                 ; Running counter for NS`);
    if (hasInterleaved) {
        pp.push(`define list<gradient> EA_TS={1 -1}`);
    }
    if (asapMixing) {
        pp.push(`"l6      = d15/(larger(p45,1u)*20)"  ; Number of ASAP loops`);
    }
    pp.push(`"acqt0   = 0"`, `baseopt_echo`, ``, ...mainpp, ``, ...phaseDefns, ``, ...gpnamDefns, ...gpzDefns, ``);
    if (wvmDefns.length > 0) {
        pp.push(`;WaveMaker shaped pulses (use 'wvm -a' to generate)`);
        pp.push(...wvmDefns);
    }
    pp.push(``, ...paramDefns, ``, auProgsStr, `; module identifiers: ${trueModuleNames.join(" ")}`, `; pulse programme created by genesis-v${version}, https://nmr-genesis.co.uk`, `; ${(new Date()).toString()}`);
    return pp.join("\n");
}
// }}}1
// vim: foldmethod=marker
