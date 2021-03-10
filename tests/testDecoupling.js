import assert from "assert";

import allModules from "../build/allModules.js";

describe("ensure that decoupling is always turned off", function() {
    // Iterate over all modules.
    const moduleNames = [...allModules.keys()];
    for (let moduleName of moduleNames) {
        const module = allModules.get(moduleName);

        // If decoupling is used at any point
        if (module.pulprog.includes("cpd")) {
            const ppLines = module.pulprog.split("\n");
            const cpdLineNo = ppLines.findIndex(line => line.includes("cpd"));
            const cpdChannel = ppLines[cpdLineNo].match(/cpd\d{1,2}:f(\d)/)[1]

            // Assert that it's turned off.
            it(moduleName, function() {
                assert(ppLines[cpdLineNo + 1].includes(`do:f${cpdChannel}`));
            });
        }
    }
});
