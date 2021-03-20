import assert from "assert";
import { readdirSync } from "fs";

import allModules from "../build/allModules.js";

describe("check that allModules really has every module TS file", function() {
    const moduleNames = [...allModules.keys()];
    const moduleFiles = readdirSync("src/modules")
        .filter(fname => fname.endsWith(".ts"))
        .map(fname => fname.replace(".ts", ""))

    // If this fails, then there is some module in allModules that doesn't have
    // a corresponding module.ts file.
    it("all module names in allModules exist", function() {
        moduleNames.forEach(name => assert(moduleFiles.includes(name),
            `the module ${name} was in allModules, but ${name}.ts does not exist`)
        );
    });

    // If this fails, then there is some module.ts file that wasn't included in
    // allModules. This seems to be the more likely failing case (i.e. forgot
    // to add it to allModules).
    it("all module files are included in allModules", function() {
        moduleFiles.forEach(file => assert(moduleNames.includes(file),
            `the file ${file}.ts was found, but was not added to allModules`)
        );
    });
});
