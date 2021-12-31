import assert from "assert";
import fs from "fs";

import { makePulprogText } from "../build/pulprog.js";
import allModules from "../build/allModules.js";


/**
 * Removes lines that only contain whitespace and comments from pulse programmes.
 * However, it leaves the 'auprog' line in because that has actual ramifications
 * on the pulse sequence that is being run.
 */

/**
 * Assert that two pulse programmes are equal, up to non-leading whitespace.
 */
function assertPPEqual(pp1, pp2) {
    // Filter out comments from both.
    function filterPulprog(text) {
        return text
            .split("\n")
            .filter(line => !line.trim().startsWith(";") || line.includes("auprog"))
            .filter(line => !!line.trim())  // removes empty lines
            .join("\n");
    }
    let pp1Lines = filterPulprog(pp1).split("\n");
    let pp2Lines = filterPulprog(pp2).split("\n");

    // Replace consecutive non-leading whitespace with single spaces. I'm not sure
    // whether there are any instances where TopSpin cares about leading whitespace,
    // but we won't replace it to be safe.
    pp1Lines = pp1Lines.map(l => l.replace(/(?<=.)\s+/g, " "));
    pp2Lines = pp2Lines.map(l => l.replace(/(?<=.)\s+/g, " "));
    // Rermove trailing whitespace.
    pp1Lines = pp1Lines.map(l => l.trimEnd());
    pp2Lines = pp2Lines.map(l => l.trimEnd());

    // Remove space around equals signs but only if it's a preamble line.
    function removeEqualsSpaceIfPreamble(line) {
        if (line.trim()[0] === '"') return line.replace(/\s*=\s*/g, "=");
        else return line;
    }
    pp1Lines = pp1Lines.map(removeEqualsSpaceIfPreamble);
    pp2Lines = pp2Lines.map(removeEqualsSpaceIfPreamble);

    assert.equal(pp1Lines.join("\n"), pp2Lines.join("\n"))
}


function makeTest(fname, moduleCodes) {
    function theTest() {
        const old_pp = fs.readFileSync(fname, "utf8");
        const new_pp = makePulprogText(moduleCodes, allModules);
        assertPPEqual(old_pp, new_pp);
    }
    return theTest;
}

describe("makePulprogText regression tests", function() {
    describe("standard experiments", function() {
        it("NOAH-2 SCc: HSQC + CLIP-COSY",
            makeTest("./tests/pp_latest/gns_noah2-SCc",
                ["C_HSQC", "H_CLIP_COSY"]));
        it("NOAH-2 SjPt: F2 CLIP-HSQC + TSE-PSYCHE",
            makeTest("./tests/pp_latest/gns_noah2-SjPt",
                ["C_HSQCJ", "H_PSYCHE_TSAP"]));
        it("NOAH-2 ABn: 1,1-ADEQUATE + 15N HMBC",
            makeTest("./tests/pp_latest/gns_noah2-ABn",
                ["C_ADEQ", "N_HMBC_CF"]));
        it("NOAH-3 SSjCc: HSQC + coupled HSQC + CLIP-COSY",
            makeTest("./tests/pp_latest/gns_noah3-SSjCc",
                ["CI_HSQC", "C_HSQCJ", "H_CLIP_COSY"]));
        it("NOAH-3 StST: HSQC-TOCSY + HSQC + TOCSY",
            makeTest("./tests/pp_latest/gns_noah3-StST",
                ["CI_HSQCT", "C_HSQC", "H_TOCSY"]));
        it("NOAH-4 SpnSpCT: 15N seHSQC + 13C seHSQC + COSY + TOCSY",
            makeTest("./tests/pp_latest/gns_noah4-SpnSpCT",
                ["N_SEHSQC", "C_SEHSQC", "H_COTO"]));
        it("NOAH-4 BSCRst: HMBC + HSQC + States COSY + States ROESY",
            makeTest("./tests/pp_latest/gns_noah4-BSCRst",
                ["C_HMBC_CF", "C_HSQC", "H_CORO_ST"]));
        it("NOAH-4 BnSnScPt: 15N HMBC + 15N HSQC + 13C HSQC-COSY + SAPPHIRE-TSE-PSYCHE",
            makeTest("./tests/pp_latest/gns_noah4-BnSnScPt",
                ["N_HMBC_CNF", "N_HSQC", "C_HSQCC", "H_PSYCHE_TSAP"]));
        it("NOAH-5 BSpnSpCT: 13C HMBC + 15N seHSQC + 13C seHSQC + COSY + TOCSY",
            makeTest("./tests/pp_latest/gns_noah5-BSpnSpCT",
                ["C_HMBC_CNF", "N_SEHSQC", "C_SEHSQC", "H_COTO"]));
    });
    describe("TS/interleaved experiments", function() {
        it("p-NOAH 5",
            makeTest("./tests/pp_latest/gns_noah5-BScSpjT-S",
                ["C_HMBC_CF_K", "C_HSQCC_DIA", "C_SEHSQCJ", "H_TOCSY"]));
        it("p-NOAH 6",
            makeTest("./tests/pp_latest/gns_noah6-BScSipT-SSap",
                ["C_HMBC_CF", "C_HSQCC_DIA", "C_SEHSQC_IA", "H_TOCSY"]));
        it("p-NOAH 8",
            makeTest("./tests/pp_latest/gns_noah8-BScSipT-BSSapT",
                ["C_HMBC_CFDD", "C_HSQCC_DIA", "C_SEHSQC_IA", "H_TT_DM"]));
        it("p-NOAH 10",
            makeTest("./tests/pp_latest/gns_noah10-BSccSipTT-BSSapCR",
                ["C_HMBC_CFDD", "C_HSQCC_CIA", "C_SEHSQC_IA", "H_TT_CR"]));
    });
});

