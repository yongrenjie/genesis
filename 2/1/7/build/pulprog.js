// Get the version number.
import { version } from "./version.js";
import allModules from "./allModules.js";
import { replaceAllPSElements, makeDipsi, makeDipsiGenerator, asapMixingPPText } from "./elements.js";
import { allDelays, allPhases, allGradients, allWavemakers, Parameter } from "./parameters.js";
import { AF_PRESAT_D1 } from "./acquFlag.js";
import { Yong2021AC, Kupce2017ACIE, Kupce2021JACSA } from "./citation.js";
// removeDuplicateByKey(): a helper function {{{1
/**
 * Remove duplicates from a list according to a function f. In other words, if
 * a list has two elements x1 and x2 such that f(x1) = f(x2), then x2 is
 * removed from the list (this function retains only the first occurrence).
 *
 * removeDuplicateByKey(xs, f) gives the same behaviour as
 *     nubBy ((==) `on` f) xs
 * in Haskell.
 */
function removeDuplicateByKey(lines, keyfn) {
    const keys = lines.map(keyfn);
    return lines.filter((l, pos) => keys.indexOf(keyfn(l)) == pos);
}
// }}}1
/**
 * Construct the pulse programme.
 *
 * @param {string[]} trueModuleNames - Array of strings indicating the backend
 *                                     modules to be used in pulse programme
 *                                     construction.
 * @param {boolean} allowLoneModule - If set to False, then return the empty
 *                                    string when NBL < 2.
 * @param {boolean} allowHmbcHom - If set to False, then return the empty
 *                                 string when HMBC is followed directly by a
 *                                 homonuclear module.
 */
export function makePulprogText(trueModuleNames, allowLoneModule, allowHmbcHom) {
    // Initialisation {{{1
    // Error out if any modules don't exist.
    const missingModules = trueModuleNames.filter(name => !allModules.has(name));
    if (missingModules.length > 0) {
        const errMsg = `module(s) ${missingModules.join(", ")} not found`;
        console.error(errMsg);
        return errMsg;
    }
    // Get the modules. We need the type assertion because we've already checked above
    // that allModules *does* contain the modules, hence allModules.get(name) cannot
    // possibly return undefined. TypeScript can't figure this out, so it thinks that
    // modules has type Array<NOAHModule | undefined>.
    const modules = trueModuleNames.map(name => allModules.get(name));
    const n = modules.length;
    // Set some flags that will help us later
    const hasHmbcModule = modules.some(mod => mod.category === "hmbc");
    const hasNModule = modules.some(mod => mod.category === "n15");
    const hasHModule = modules.some(mod => mod.category === "h1");
    const asapMixing = hasHmbcModule && hasHModule;
    const CModules = modules.filter(mod => mod.category === "c13");
    const hasCModule = CModules.length > 0;
    const hasMultipleCModules = CModules.length > 1;
    const extraDipsiMixing = hasMultipleCModules && !CModules[0].hasDipsi();
    const hasInterleaved = modules.some(mod => mod.interleaved);
    // The value of this flag is hardcoded, but is placed here in anticipation
    // of other situations in which we might not want to have the NUS flag,
    // e.g. time-shared modules.
    const useNusFlag = (!hasInterleaved
        && trueModuleNames.every(name => !name.includes("H_JRES"))
        && trueModuleNames.every(name => !name.includes("H_PSYCHE"))
        && trueModuleNames.every(name => !name.includes("H_COSY_QF")));
    // Exit immediately if HMBC is followed directly by a homonuclear module.
    if (!allowHmbcHom &&
        hasHmbcModule && !hasNModule && !hasCModule && hasHModule) {
        return "HMBC + homonuclear module combinations are not very effective\nPlease use developer mode if you really want these";
    }
    // Initialise pulse programme components.
    // All these are arrays of strings.
    let nbl = 0;
    let nAdvertisedModules = 0; // may differ from NBL because of interleaved modules
    let pp = [];
    let shortCodes = [];
    let shortCodesInterleaved = [];
    let shortDescriptions = [];
    let preambles = [];
    let citations = [Yong2021AC, Kupce2017ACIE];
    if (hasInterleaved)
        citations.push(Kupce2021JACSA);
    let mainpp = []; // the bulk of the pulse programme
    // Initialise and seed DIPSI-2 generator.
    const dipsiGen = makeDipsiGenerator();
    dipsiGen.next(); // so that we can pass next() a parameter next time.
    // Construct the beginning of mainpp (ze, d1 etc.) {{{1
    // Figure out which nucleus to stop decoupling on, if any.
    let stopDec = "";
    const lastModule = modules[n - 1];
    if (lastModule.pulprog.includes('cpd2:f2'))
        stopDec = " do:f2";
    else if (lastModule.pulprog.includes('cpd3:f3'))
        stopDec = " do:f3";
    mainpp.push(`1 ze`, `2 30m`, // NS loop (go=2 phXX) goes back to here
    `3 5m${stopDec}`, // EA loop goes back to here
    `4 50u UNBLKGRAD`, // t1 loop goes back to here
    `  1m iu2`, ``, `  ; Cleanup`);
    // Context-dependent cleanup before d1.
    if (modules.some(m => m.nuclei().includes("C")))
        mainpp.push(`  4u pl2:f2`, `  (p3 ph0):f2`);
    if (modules.some(m => m.nuclei().includes("N")))
        mainpp.push(`  4u pl3:f3`, `  (p21 ph0):f3`);
    mainpp.push(`  4u pl1:f1`, `  p16:gp0`, `  d16`, `  (p1 ph0):f1`, `  4u`, `  p16:gp0*1.37`, `  d16`, `  4u BLKGRAD`);
    // Either d1 or presaturation
    mainpp.push(`#ifdef PRESAT`, `  4u pl9:f1`, `  2m st0`, `  d1 cw:f1`, `  4u do:f1`, `  4u pl1:f1`, `#else`, `  d1 st0`, `#endif /* PRESAT */`, `  4u UNBLKGRAD`);
    // Construct the body of mainpp {{{1
    // Generator which spits out numbers to multiply purge gradients by.
    function* gradGenFunc() {
        yield* [1.77, 2.32, -1.29, 0.71];
    }
    const gradGen = gradGenFunc();
    // Iterate over modules. The hard work of constructing the pulse programme
    // is done here.
    for (const [i, mod] of modules.entries()) { // n is the number of backend modules
        const nextMod = modules[i + 1];
        nbl += mod.nfid;
        const interleavedFactor = mod.interleaved ? 2 : 1;
        nAdvertisedModules += mod.nfid * interleavedFactor;
        // Collect shortCodes, shortDescriptions, and preambles.
        // The preambles will later be postprocessed.
        const codes = mod.shortCode.split(" ");
        if (codes.length == 2) { // interleaved modules
            shortCodes.push(codes[0]);
            shortCodesInterleaved.push(codes[1]);
        }
        else {
            shortCodes.push(mod.shortCode);
        }
        shortDescriptions.push(...mod.shortDescription.split("\n"));
        for (const flag of mod.acquFlags) {
            shortDescriptions.push(flag.makeComment());
        }
        const moduleDefineDelays = [...mod.preamble
                .split("\n")
                .map(l => l.match(/(?<=^")D\[ID\].(?=\s*=)/))
                .filter(a => a !== null && a.length > 0)
                .map(a => `define delay ${a[0]}`)
                .map(l => l.replace(/\[ID\]/g, trueModuleNames[i]))
        ];
        preambles.push(...moduleDefineDelays);
        preambles.push(...mod.preamble
            .split("\n")
            .map(l => l.replace(/\[ID\]/g, trueModuleNames[i])));
        citations.push(...mod.citations);
        // Collect the pulse programmes themselves.
        mainpp.push(``, ``, `  ; MODULE ${i + 1}`);
        let trimNewlines = ((s) => s.replace(/^\n|\n$/g, ''));
        let ppLines = trimNewlines(mod.pulprog).split("\n");
        // Handle DIPSI-2 inside pp_lines.
        let ppDipsiLineNo = ppLines.findIndex(line => line.includes("|DIPSI|"));
        while (ppDipsiLineNo != -1) { // means it was found
            if (mod.category == "c13" || mod.category == "h1") {
                let [dipsiPP, dipsiPreamble] = dipsiGen.next(mod.category).value;
                ppLines.splice(ppDipsiLineNo, 1, ...dipsiPP);
                preambles.push(...dipsiPreamble);
            }
            else {
                throw new Error("DIPSI-2 found inside wrong type of module");
            }
            ppDipsiLineNo = ppLines.findIndex(line => line.includes("|DIPSI|"));
        }
        // Handle pulse sequence abbreviations
        [ppLines, preambles] = replaceAllPSElements(ppLines, preambles);
        // Add the current module's pulse programme to the concatenated list
        mainpp.push(...ppLines
            .map(l => l.replace(/\[ID\]/g, trueModuleNames[i])));
        // Add anything that we might need between modules: extra DIPSI-2, ASAP
        // mixing, or general purge gradients.
        if (extraDipsiMixing
            && mod.category === "c13" && !mod.hasDipsi()
            && nextMod !== undefined && nextMod.category === "c13") {
            let [extraDipsiPP, extraDipsiPreamble] = makeDipsi("11", 18, 30);
            preambles.push(...extraDipsiPreamble);
            mainpp.push(``, `if "d30 > 1m"`, `{`, `  50u`, `  p16:gp13`, `  d16 pl10:f1`, ...extraDipsiPP, `  p16:gp13*1.333`, `  d16`, `}`);
        }
        if (asapMixing
            && nextMod !== undefined && nextMod.category === "h1")
            mainpp.push(...asapMixingPPText);
        // Cleanup
        if (i < n - 1) {
            mainpp.push(``, `  ; Cleanup`, `  4u pl1:f1`);
            if (mod.nuclei().includes('C'))
                mainpp.push(`  4u pl2:f2`, `  (p3 ph0):f2`);
            if (mod.nuclei().includes('N'))
                mainpp.push(`  4u pl3:f3`, `  (p21 ph0):f3`);
            mainpp.push(`  4u`, `  p16:gp0*${gradGen.next().value}`, `  d16`, `  2m st`);
        }
    }
    // Construct the end of mainpp (EA/t1 incrementation) {{{1
    // Initialisation {{{2
    // Use a regex to find all phases in the pulse programme text
    let phasesSet = new Set(mainpp.join("\n").match(/\bph\d{1,2}/g));
    let phases = Array.from(phasesSet)
        .map(phx => Number(phx.slice(2))) // extract the number
        .sort((a, b) => a - b);
    // and (builtin) delays
    let delaysSet = new Set(mainpp.join("\n").match(/\bd\d{1,2}/g));
    let delays = Array.from(delaysSet)
        .map(dx => Number(dx.slice(1))) // extract the number
        .sort((a, b) => a - b);
    // Change the last goscnp to go=2
    for (let l = mainpp.length - 1; l >= 0; l--) {
        if (mainpp[l].includes("goscnp")) {
            mainpp[l] = mainpp[l].replace("goscnp", "go=2");
            break;
        }
    }
    // Check for EA1, EA2
    const mainppTemp = mainpp.join("\n");
    const ea1Present = (mainppTemp.search(/\bEA1\b/) != -1);
    const ea2Present = (mainppTemp.search(/\bEA2\b/) != -1);
    // For cnst38 we need to check preambles, not mainpp.
    const cnst38Present = preambles.some(l => l.includes("cnst38"));
    // Add in NUS redefinitions of t1 delays (to be used with -DNUS zgoptn flag)
    if (useNusFlag && [0, 10, 11, 20].some(d => delays.includes(d))) {
        let nusRedefinitions = [``, `#ifdef NUS`];
        if (delays.includes(0))
            nusRedefinitions.push(`  "d0=(in0*t1list)+3u"`);
        if (delays.includes(10))
            nusRedefinitions.push(`  "d10=(in10*t1list)+3u"`);
        if (delays.includes(11))
            nusRedefinitions.push(`  "d11=(in11*t1list)+3u"`);
        if (delays.includes(20))
            nusRedefinitions.push(`  "d20=(in20*t1list)+3u"`);
        nusRedefinitions.push(`#endif /* NUS */`);
        mainpp.splice(4, 0, ...nusRedefinitions);
    }
    // (type A) incrementation on every round of l1 {{{2
    mainpp.push(``, `  ; incrementation on every pass`, `  1m iu1`);
    // gradients (EA, EA1, EA2) {{{3
    mainpp.push(`  1m igrad EA`);
    if (ea1Present)
        mainpp.push(`  1m igrad EA1`);
    if (ea2Present)
        mainpp.push(`  1m igrad EA2`);
    // Phases and delays (e.g. seHSQC) {{{3
    const phaseInstructionsA = phases.map(p => allPhases[p].makeInstruction("incrA")).filter(Boolean);
    const delayInstructionsA = delays.map(d => allDelays[d].makeInstruction("incrA")).filter(Boolean);
    phaseInstructionsA.forEach(inst => mainpp.push(`  1m ${inst}`));
    delayInstructionsA.forEach(inst => mainpp.push(`  1m ${inst}`));
    // Write data to disk {{{3
    mainpp.push(`  30m wr #0 if #0 zd`);
    // (type B) incrementation every 2 rounds of l1 (13C t1 and 1H t1 for non-scaled modules) {{{2
    const phaseInstructionsB = phases.map(p => allPhases[p].makeInstruction("incrB")).filter(Boolean);
    const delayInstructionsB = delays.map(d => allDelays[d].makeInstruction("incrB")).filter(Boolean);
    mainpp.push(``, `  ; incrementation on every second pass`, `if "l1 % 2 == 0" {`);
    phaseInstructionsB.forEach(inst => mainpp.push(`  1m ${inst}`));
    if (useNusFlag) {
        mainpp.push(`#ifdef NUS`, `  1m t1list.inc`, `#else`);
        delayInstructionsB.forEach(inst => mainpp.push(`  1m ${inst}`));
        mainpp.push(`#endif /* NUS */`);
    }
    else {
        delayInstructionsB.forEach(inst => mainpp.push(`  1m ${inst}`));
    }
    // 15N phases (but only if NUS is enabled, which disables cnst39) {{{3
    const phaseInstructionsD = phases.map(p => allPhases[p].makeInstruction("incrD")).filter(Boolean);
    if (phaseInstructionsD.length > 0 && useNusFlag) {
        mainpp.push(`#ifdef NUS`);
        phaseInstructionsD.forEach(inst => mainpp.push(`  1m ${inst}`));
        mainpp.push(`#endif /* NUS */`);
    }
    // EA for interleaved modules {{{3
    if (hasInterleaved) {
        mainpp.push(`  1m igrad EA_TS`);
    }
    // }}}3
    mainpp.push('}');
    // (type C) incrementation every 4 rounds of l1 {{{2
    const phaseInstructionsC = phases.map(p => allPhases[p].makeInstruction("incrC")).filter(Boolean);
    const delayInstructionsC = delays.map(d => allDelays[d].makeInstruction("incrC")).filter(Boolean);
    if (phaseInstructionsC.length > 0 || delayInstructionsC.length > 0) {
        console.log('hi');
        mainpp.push(``, `  ; incrementation on every fourth pass`, `if "l1 % 4 == 0" {`);
        phaseInstructionsC.forEach(inst => mainpp.push(`  1m ${inst}`));
        delayInstructionsC.forEach(inst => mainpp.push(`  1m ${inst}`));
        mainpp.push('}');
    }
    // (manual) incrementation every (l0 / cnst37) rounds: 1H QF k-scaled modules (QF JRES / [TSE-]PSYCHE) {{{2
    if (delays.includes(17) && cnst38Present) {
        mainpp.push(`if "l1 % (l0 / cnst37) == 0"`, `{`, `  1m id17`, `  1m iu3`, `}`);
    }
    // (manual) incrementation every (2 * l0 / cnst37) rounds: 1H phase-sensitive k-scaled modules (PSYCHE JRES) {{{2
    if (delays.includes(18) && cnst38Present) {
        mainpp.push(`if "l1 % (2 * l0 / cnst37) == 0"`, `{`, `  1m id18`, `}`);
    }
    // (type D) incrementation every (2 * cnst39) rounds: 15N modules without NUS {{{2
    const delayInstructionsD = delays.map(d => allDelays[d].makeInstruction("incrD")).filter(Boolean);
    if (phaseInstructionsD.length > 0 || delayInstructionsD.length > 0) {
        if (useNusFlag) {
            mainpp.push(`#ifdef NUS`, `#else`, `if "l1 % (2 * cnst39) == 0"`, `{`);
            phaseInstructionsD.forEach(inst => mainpp.push(`  1m ${inst}`));
            delayInstructionsD.forEach(inst => mainpp.push(`  1m ${inst}`));
            mainpp.push(`}`, `#endif /* NUS */`);
        }
        else {
            mainpp.push(`if "l1 % (2 * cnst39) == 0"`, `{`);
            phaseInstructionsD.forEach(inst => mainpp.push(`  1m ${inst}`));
            delayInstructionsD.forEach(inst => mainpp.push(`  1m ${inst}`));
            mainpp.push(`}`);
        }
    }
    // Final loop and exit {{{2
    mainpp.push(`  lo to 4 times l0`); // loop TD1/NBL times
    // BLKGRAD, label to quick exit, and exit.
    mainpp.push(``, `end, 4u`, `50u BLKGRAD`, `exit`);
    const mainppText = mainpp.join("\n"); // convenience string for future use
    // Postprocess preambles {{{1
    //
    // Return an empty string if we have more than five or less than one module.
    if (nbl > 5)
        return "NBL > 5 is not currently supported by TopSpin";
    if (nbl < 2 && !allowLoneModule)
        return "";
    // Construct pulse programme name
    let ppShortCodeName = `gns_noah${nAdvertisedModules}-${shortCodes.join("")}`;
    if (shortCodesInterleaved.length > 0) {
        ppShortCodeName += `-${shortCodesInterleaved.join("")}`;
    }
    // Create citation texts.
    const citationText = [...new Set(citations)]
        .map(c => c.makePPCitation())
        .join("\n\n");
    // Start by removing extra whitespace and empty lines.
    preambles = preambles.map(l => l.trim()).filter(Boolean);
    // There are three types of lines that we need to deal with:
    // 1) define delay XX, 2) define list<gradient>XX, 3) the rest
    let defineDelayLines = preambles
        .filter(l => l.startsWith("define delay"))
        .sort((la, lb) => Parameter.compare(new Parameter(la), new Parameter(lb)));
    let defineGradLines = preambles
        .filter(l => l.startsWith("define list<gradient>"))
        .sort();
    let preambleParams = preambles
        .filter(l => !(l.startsWith("define")))
        .map(l => Parameter.fromPreamble(l));
    // Remove duplicates inside defineDelayLines and defineGradLines
    defineDelayLines = removeDuplicateByKey(defineDelayLines, (l => l));
    defineGradLines = removeDuplicateByKey(defineGradLines, (l => l));
    // Sort parameter lines. Note that Parameter.compare() automatically
    // makes sure that 'custom' delays D_XXX occur below the standard delays
    // dXX, which is necessary for TopSpin to parse the pulse programme.
    preambleParams.sort(Parameter.compare);
    // Then remove duplicates according to the full parameter name
    preambleParams = removeDuplicateByKey(preambleParams, (p => p.name()));
    // Find the lengths for pretty-printing the parameters.
    const longestName = Math.max(...preambleParams.map(p => p.name().length));
    const longestDefn = Math.max(...preambleParams.map(p => p.definition.length));
    // Now we can stick the preambles back together in the right order.
    const preamblesText = [
        ...defineDelayLines,
        ...preambleParams.map(p => p.toPreamble(longestName, longestDefn)),
        ...defineGradLines
    ].join("\n");
    // Postprocess mainpp {{{1
    // Remove st0 commands from sequences with NBL=1 (triggers warning in TS4)
    // The only lines we have to deal with are 'd1 st0' and '2m st0', so this
    // quick replacement works for now.
    if (nbl == 1) {
        mainpp = mainpp.map(line => line.replace(/ st0$/, ""));
    }
    // Create postamble components {{{1
    // Phase definitions {{{2
    const phaseDefns = phases.map(p => `ph${p}=${allPhases[p].str}`);
    // Gradient definitions {{{2
    let gradients2 = new Set([
        mainppText.match(/gp\d{1,2}/g),
        mainppText.match(/gron\d{1,2}/g)
    ]
        .filter(Boolean)
        .flat()
        .map(s => s.replace("gron", "").replace("gp", ""))); // extract the number
    // the ! in the previous line is needed because TypeScript doesn't know that
    // filter(Boolean) removes null results from str.match().
    let gradients = Array.from(gradients2, Number).sort((a, b) => a - b);
    const gpnamDefns = gradients.map(g => allGradients[g].makeGpnamInstruction()).filter(Boolean);
    const gpzDefns = gradients.map(g => allGradients[g].makeGpzInstruction());
    // WaveMaker definitions {{{2
    let shapedPulses2 = new Set(mainppText.match(/p\d{1,2}:sp\d{1,2}/g));
    let shapedPulses = Array.from(shapedPulses2)
        .map(s => Number(s.split(":")[1].slice(2))) // extract the number
        .sort((a, b) => a - b);
    let wvmDefns = shapedPulses.map(s => allWavemakers[s]).filter(e => e !== undefined);
    // If there is 13C decoupling we should add in the pulses for adiabatic decoupling.
    if (mainpp.join("\n").includes("cpd2:f2")) {
        wvmDefns.push(";cpd2:wvm:wudec: cawurst_d-20(220 ppm, 1.4 ms; L2H)");
    }
    // Parameter definitions {{{2
    // We need to scan the preamble and mainppText with several regexes. Type assertion
    // needed because TypeScript doesn't know that filter(Boolean) removes nulls.
    const preamblePlusMainpp = preamblesText + "\n" + mainppText;
    let allPpParamNames = [...new Set([
            preamblePlusMainpp.match(/\bp\d{1,2}\b/g), // pulses
            preamblePlusMainpp.match(/\bl\d{1,2}\b/g), // loop counters
            preamblePlusMainpp.match(/\bsp\d{1,2}\b/g), // shaped pulses
            preamblePlusMainpp.match(/\bpl\d{1,2}\b/g), // power levels
            preamblePlusMainpp.match(/\bcpd\d{1,2}\b/g), // decoupling programme
            preamblePlusMainpp.match(/\bcnst\d{1,2}\b/g), // constants
        ].filter(Boolean).flat())];
    // Add in the spnams.
    const spParams1 = allPpParamNames.filter(p => p.startsWith("sp")).map(p => p.replace("sp", "spnam"));
    allPpParamNames.push(...spParams1);
    // Separately get the delays. Note that this is different from the 'delays'
    // array, which only counts stuff in the main section.
    const allPpDelays = [...new Set(preamblePlusMainpp.match(/d\d{1,2}/g))];
    // Sort them and throw them all into a list of Parameters, with a few bonus ones.
    const bonusParams = ["aq", "ds", "FnMODE", "NBL", "ns"];
    const paramDefns = [
        ...allPpDelays
            .map(dx => Number(dx.slice(1)))
            .map(n => allDelays[n].toFooter()),
        ...allPpParamNames
            .map(n => new Parameter(n))
            .sort(Parameter.compare)
            .map(p => p.toPostamble()),
        ...bonusParams
            .map(n => new Parameter(n))
            .map(p => p.toPostamble()),
    ];
    // AU programme list {{{2
    const auProgs = modules.map(m => m.auprog);
    const auProgsStr = `; auprog: ${auProgs.join(":")}`;
    // Finally, string everything together {{{1
    pp.push(`; ${ppShortCodeName}`, ``, `; =========================================================================`, `; set 'NBL' TopSpin parameter to ${nbl}`, `; `, AF_PRESAT_D1.makeComment(), ...shortDescriptions, `; =========================================================================`, ``, `;$CLASS=HighRes`, `;$DIM=2D`, `;$TYPE=`, `;$SUBTYPE=`, `;$COMMENT=`, ``, citationText, ``, `#include <Avance.incl>`, `#include <Grad.incl>`, `#include <Delay.incl>`, ``);
    if (useNusFlag) {
        pp.push(`#ifdef NUS`, `define list<loopcounter> t1list=<$VCLIST>`, `#endif /* NUS */`, ``);
    }
    pp.push(preamblesText, `"l0      = td1/${nbl}"             ; TD1/NBL (i.e. TD1 for ordinary modules)`, `"l1      = 0"                 ; Running counter for TD1 for ordinary modules (0 on first increment)`, `"l2      = 0"                 ; Running counter for NS (1 on first scan)`);
    if (delays.includes(17)) {
        pp.push(`"l3      = 0"                 ; Running counter for TD1 for QF k-scaled 1H modules, e.g. PSYCHE (0 on first increment)`);
    }
    if (hasInterleaved) {
        pp.push(`define list<gradient> EA_TS={1 -1}`);
    }
    if (asapMixing) {
        pp.push(`"l6      = d15/(larger(p45,1u)*20)"  ; Number of ASAP loops`);
    }
    pp.push(`"acqt0   = 0"`, `baseopt_echo`, ``, ...mainpp, ``, ...phaseDefns, ``, ...gpnamDefns, ...gpzDefns, ``);
    if (wvmDefns.length > 0) {
        pp.push(`;WaveMaker shaped pulses (use 'wvm -a' to generate)`);
        pp.push(...wvmDefns);
    }
    pp.push(``, ...paramDefns, ``, auProgsStr, `; module identifiers: ${trueModuleNames.join(" ")}`, `; pulse programme created by genesis-v${version}, https://nmr-genesis.co.uk`, `; ${(new Date()).toString()}`);
    return pp.join("\n");
    // }}}1
}
// vim: foldmethod=marker
