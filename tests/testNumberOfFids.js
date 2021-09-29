import assert from "assert";

import allModules from "../build/allModules.js";

describe("check that shortcodes match number of FIDs", function() {
    // Iterate over all modules.
    const moduleNames = [...allModules.keys()];
    for (let moduleName of moduleNames) {
        const module = allModules.get(moduleName);

        // Count number of capital letters in module short code.
        const nExpts = [...module.shortCode]
            .filter(c => c.toUpperCase() === c && c.toLowerCase() !== c)
            .length;

        const interleavedFactor = module.interleaved ? 2 : 1;

        it(moduleName, function() {
            assert.equal(module.nfid * interleavedFactor, nExpts);
        });
    }
});
