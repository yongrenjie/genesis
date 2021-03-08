import assert from "assert";
import fs from "fs";

import { makePulprogText } from "../build/pulprog.js";
import allModules from "../build/allModules.js";


/**
 * Removes lines that only contain whitespace and comments from pulse programmes.
 * However, it leaves the 'auprog' line in because that has actual ramifications
 * on the pulse sequence that is being run.
 */
function filterPulprog(text) {
    return text
        .split("\n")
        .filter(line => line.includes("auprog") || !(!!line.trim() || line.trim().startsWith(";")))
        .join("\n");
}


describe("regression tests against v2.0.5", function() {
    it("NOAH-2 SCc: HSQC + CLIP-COSY", function() {
        const v205_pp = fs.readFileSync("./tests/pp_v2.0.5/ngn_noah2-SCc", "utf8");
        const new_pp = makePulprogText(["C_HSQC", "H_CLIP_COSY"], allModules);
        assert.equal(filterPulprog(v205_pp), filterPulprog(new_pp));
    });
    it("NOAH-3 SSjCc: HSQC + coupled HSQC + CLIP-COSY", function() {
        const v205_pp = fs.readFileSync("./tests/pp_v2.0.5/ngn_noah3-SSjCc", "utf8");
        const new_pp = makePulprogText(["CI_HSQC", "C_HSQC_F2J", "H_CLIP_COSY"], allModules);
        assert.equal(filterPulprog(v205_pp), filterPulprog(new_pp));
    });
    it("NOAH-4 SpnSpCT: 15N seHSQC + 13C seHSQC + COSY + TOCSY", function() {
        const v205_pp = fs.readFileSync("./tests/pp_v2.0.5/ngn_noah4-SpnSpCT", "utf8");
        const new_pp = makePulprogText(["N_SEHSQC", "C_SEHSQC", "H_COSY_TOCSY"], allModules);
        assert.equal(filterPulprog(v205_pp), filterPulprog(new_pp));
    });
    it("NOAH-5 BSpnSpCT: 13C HMBC + 15N seHSQC + 13C seHSQC + COSY + TOCSY", function() {
        const v205_pp = fs.readFileSync("./tests/pp_v2.0.5/ngn_noah5-BSpnSpCT", "utf8");
        const new_pp = makePulprogText(["C_HMBC_CNF", "N_SEHSQC", "C_SEHSQC", "H_COSY_TOCSY"], allModules);
        assert.equal(filterPulprog(v205_pp), filterPulprog(new_pp));
    });
});
