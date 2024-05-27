// Goto labels (we manually keep track of these) {{{1
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
// }}}1
export const allParams = {
    // p - Pulse widths {{{1
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
    // pl - Pulse power levels {{{1
    "pl0": "0 W",
    "pl1": "f1 channel - power level for pulse (default)",
    "pl2": "f2 channel - power level for pulse (default)",
    "pl3": "f3 channel - power level for pulse (default)",
    "pl9": "f1 channel - power level for presaturation",
    "pl10": "f1 channel - power level for TOCSY-spinlock",
    "pl12": "f2 channel - power level for CPD/BB decoupling",
    "pl16": "f3 channel - power level for CPD/BB decoupling",
    "pl27": "f1 channel - power level for pulsed ROESY-spinlock",
    // sp, spnam - Shaped pulses {{{1
    "sp1": "1H selective inversion",
    "spnam1": "Sinc1.1000 or WaveMaker",
    "sp3": "13C adiabatic inversion",
    "spnam3": "Crp60,0.5,20.1 or WaveMaker",
    "sp7": "13C composite adiabatic refocusing",
    "spnam7": "Crp60comp.4",
    "sp18": "13C J-compensated refocusing",
    "spnam18": "Crp60_xfilt.2 or WaveMaker",
    "sp29": "1H ZQS chirp",
    "spnam29": "Crp60,20,20.10 or WaveMaker",
    "sp33": "1H 180(x) BURBOP",
    "spnam33": "BUBI_1H_600u_RF20kHz",
    "sp34": "13C 180 pp BIBOP",
    "spnam34": "BUBI_13C_600u_RF10kHz",
    "sp40": "1H PSYCHE saltire",
    "spnam40": "Crp_psyche.20",
    "sp41": "1H TSE-PSYCHE low-to-high chirp",
    "spnam41": "wuchirpLH - generate via WaveMaker",
    "sp42": "1H TSE-PSYCHE high-to-low chirp",
    "spnam42": "wuchirpHL - generate via WaveMaker",
    "sp45": "1H CAWURST-2 pulse (180 degree)",
    "spnam45": "wuASAP (generate via WaveMaker)",
    "sp49": "1H first WURSTAM (adiabatic) for ROESY mixing (high shift)",
    "spnam49": "wu180H1SL (generate via WaveMaker)",
    "sp50": "1H second WURSTAM (adiabatic) for ROESY mixing (low shift)",
    "spnam50": "wu180H1SL2 (generate via WaveMaker)",
    // cnst - Constants {{{1
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
    "cnst52": "HMBC gradient free parameter (alpha)",
    "cnst53": "HMBC gradient ratio",
    "cnst54": "HMBC gradient ratio",
    // d, in - Delays and increments {{{1
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
    // l - Loop counters {{{1
    "l0": "TD1 / NBL, i.e. 'true TD1'",
    "l1": "running counter for true TD1 (0 on first increment)",
    "l2": "running counter for NS (1 on first scan)",
    "l3": "running counter for TD1 for k-scaled 1H modules (0 on first increment)",
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
    // Miscellaneous {{{1
    "cpd2": "13C decoupling according to sequence defined by cpdprg2",
    "cpd3": "15N decoupling according to sequence defined by cpdprg3",
    "pcpd2": "f2 channel - 90 degree pulse for decoupling sequence",
    "pcpd3": "f3 channel - 90 degree pulse for decoupling sequence",
    "aq": "acquisition time",
    "ds": ">= 16",
    "FnMODE": "echo-antiecho",
    "NBL": "number of blocks (NOAH modules)",
    "ns": "1 * n",
    // }}}1
};
// Phase class {{{1
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
// }}}1
// Phase definitions {{{1
export const allPhases = new Array(32);
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
// }}}1
// Gradient class {{{1
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
// }}}1
// Gradient definitions {{{1
export const allGradients = new Array(32);
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
// }}}1
// WaveMaker definitions {{{1
export const allWavemakers = new Array(64);
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
// The Parameter class {{{1
export class Parameter {
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
// vim: foldmethod=marker
