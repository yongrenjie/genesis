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

describe("makePulprogText regression tests", function() {
    it("NOAH-2 SCc: HSQC + CLIP-COSY", function() {
        const v206_pp = fs.readFileSync("./tests/pp_latest/gns_noah2-SCc", "utf8");
        const new_pp = makePulprogText(["C_HSQC", "H_CLIP_COSY"], allModules);
        assertPPEqual(v206_pp, new_pp);
    });
    it("NOAH-3 SSjCc: HSQC + coupled HSQC + CLIP-COSY", function() {
        const v206_pp = fs.readFileSync("./tests/pp_latest/gns_noah3-SSjCc", "utf8");
        const new_pp = makePulprogText(["CI_HSQC", "C_HSQC_F2J", "H_CLIP_COSY"], allModules);
        assertPPEqual(v206_pp, new_pp);
    });
    it("NOAH-3 StST: HSQC-TOCSY + HSQC + TOCSY", function() {
        const v206_pp = fs.readFileSync("./tests/pp_latest/gns_noah3-StST", "utf8");
        const new_pp = makePulprogText(["CI_HSQC_TOCSY", "C_HSQC", "H_TOCSY"], allModules);
        assertPPEqual(v206_pp, new_pp);
    });
    it("NOAH-4 SpnSpCT: 15N seHSQC + 13C seHSQC + COSY + TOCSY", function() {
        const v206_pp = fs.readFileSync("./tests/pp_latest/gns_noah4-SpnSpCT", "utf8");
        const new_pp = makePulprogText(["N_SEHSQC", "C_SEHSQC", "H_COSY_TOCSY"], allModules);
        assertPPEqual(v206_pp, new_pp);
    });
    it("NOAH-5 BSpnSpCT: 13C HMBC + 15N seHSQC + 13C seHSQC + COSY + TOCSY", function() {
        const v206_pp = fs.readFileSync("./tests/pp_latest/gns_noah5-BSpnSpCT", "utf8");
        const new_pp = makePulprogText(["C_HMBC_CNF", "N_SEHSQC", "C_SEHSQC", "H_COSY_TOCSY"], allModules);
        assertPPEqual(v206_pp, new_pp);
    });
});
