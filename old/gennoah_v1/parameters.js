export const descriptions = {
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
    "cnst9": "actual TOCSY mixing time (display only)",
    "cnst12": "> J(HH), ca. 30 Hz for CLIP-COSY mixing",
    "cnst13": "= nJ(CH) long-range",
    "cnst16": "15N CTP gradient lengthening factor",
    "cnst17": "= -0.5 for Crp60comp.4",
    "cnst33": "= rf amplitude 20000 Hz for BUBI_1H_600u_RF20kHz",
    "cnst34": "= rf amplitude 10000 Hz for BUBI_13C_600u_RF10kHz",
    "cnst39": "15N HSQC sensitivity factor",
    "cnst40": "15N SW (ppm)",

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
    "d11": "ASAP mixing time [0 (no mixing) or 40-60 ms]",
    "d12": "<1/4J(HH) CLIP-COSY mixing time",
    "d16": "delay for homospoil/gradient recovery [200 us]",
    "d20": "15N t1",
    "d24": "1/4J(NH)",
    "d26": "1/8J(NH) for all multiplicities, 1/4J(NH) for NH only",

    "inf1": "1/SW(C) = 2 * DW(C)",
    "in0": "1/(2 * SW(C)) = DW(C)",
    "in10": "1/(SW(H)) = 2 * DW(H)",
    "in20": "1/(2 * SW(N)) = DW(N)",

    "l0": "total number of t1 increments",
    "l1": "running counter of t1 increments",
    "l2": "loop for ASAP mixing",
    "l4": "loop for ROESY spinlock = p15 / p25*2",
    "l11": "half the number of DIPSI-2 cycles",
    "l12": "actual number of DIPSI-2 cycles",

    "cpd2": "13C decoupling according to sequence defined by cpdprg2",
    "cpd3": "15N decoupling according to sequence defined by cpdprg3",
    "pcpd2": "f2 channel - 90 degree pulse for decoupling sequence",
    "pcpd3": "f3 channel - 90 degree pulse for decoupling sequence",
}

/* Thought about putting pulse phases in a lookup table, 
 * but I feel like it's more hassle than it's worth. */
/*
export const phases = {
    // There's no ph0.
    0: undefined,
    // ph1 and ph2 are always present.
    1: "0",
    2: "1",
    // ph3 through ph10 are reserved for 13C experiments.
    3: "0 2              ; coherence transfer H -> C",
    4: "0 0 0 0 2 2 2 2",
    5: "0 0 2 2",
    6: "1 1 3 3          ; seHSQC 13C 90 without editing",
    7: "3 3 1 1          ; seHSQC 13C 90 with editing",
    8: "2",
    9: "3",
    10: undefined,      // still available!
    // ph11 through ph18 are reserved for 1H experiments
    11: "0 2",            ; for echo-antiecho
    12: "0 0 2 2",
    13: "0 2",            ; for States
    14: "0 0 2 2",
    15: "2 2 0 0",
    16: "1",              ; mainly for DIPSI2, but can be overloaded
    17: "2",
    18: "3",              ; mainly for DIPSI2, but can be overloaded
    // ph19 through ph26 are reserved for 15N experiments
    19: "2",
    20: "0 2              ; coherence transfer H -> N",
    21: "0 0 0 0 2 2 2 2",
    22: "0 0 2 2",
    23: "1 1 3 3          ; seHSQC 15N 90",
    24: "3",
    25: undefined,
    26: undefined,
    // ph27 through ph31 are receiver phases. These are read
    // directly from the module files.
}
*/



/* GRADIENTS - an overview of what's what */
/*
gpz0 is generic purging gradient = 17.13%

gpz1-10 for 13C
  - gpz1-4 for HSQCs
  - gpz5-7 for HMBC

gpz11-20 for 1H
  - gpz11 for COSY/NOESY CTP
  - gpz12 for homospoil/purging gradients
  - gpz13 for zero-quantum filters
  - gpz14-16 for DQF-COSY CTP

gpz21-30 for 15N
  - gpz21-24 for HSQCs
*/
