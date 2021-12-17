import assert from "assert";

import allModules from "../build/allModules.js";

describe("ensure that acquisition flags match pulse programme", function() {
    // Iterate over all modules.
    const moduleNames = [...allModules.keys()];
    for (let moduleName of moduleNames) {
        const module = allModules.get(moduleName);

        if (module.acquFlags.length > 0) {
            it(moduleName, function() {
                for (const flag of module.acquFlags) {
                    const re = new RegExp(`# *ifdef +${flag.name}\n`);
                    // A bit hacky, but we need to check ES flag separately as it's not
                    // always directly included in the pulse programme
                    if (flag.name === "ES") {
                        assert(re.test(module.pulprog) || module.pulprog.includes("|SOLVSUPP|"),
                            "ES not found");
                    }
                    else {
                        assert(re.test(module.pulprog), `${flag.name} not found`);
                    }
                };
            });
        }
    }
});
