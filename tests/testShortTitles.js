import assert from "assert";

import allModules from "../build/allModules.js";

describe("ensure that short titles contain the right number of colons", function() {
    // Iterate over all modules.
    const moduleNames = [...allModules.keys()];
    for (let moduleName of moduleNames) {
        const module = allModules.get(moduleName);
        it(moduleName, function() {
            assert(module.shortTitle.split(":").length == module.nfid);
        });
    }
});
