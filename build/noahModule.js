import { replaceAllPSElements } from "./elements.js";
class NOAHModule {
    constructor(name, category, shortCode, citations, auprog, shortTitle, shortDescription, acquFlags, preamble, pulprog, nfid, interleaved) {
        this.name = name;
        this.category = category;
        this.shortCode = shortCode;
        this.citations = citations;
        this.auprog = auprog;
        this.shortTitle = shortTitle;
        this.shortDescription = shortDescription;
        this.acquFlags = acquFlags;
        this.preamble = preamble;
        this.pulprog = pulprog;
        this.nfid = nfid;
        this.interleaved = interleaved;
    }
    // Parse the pulse programme to figure out which nuclei the pulse programme
    // uses. It's pretty basic, but should work.
    nuclei() {
        // First replace the pulse sequence elements.
        const [pulprogTemp, preambleTemp] = replaceAllPSElements(this.pulprog.split('\n'), this.preamble.split('\n'));
        // It seems reasonable to assume that every module has some pulse on H.
        let ns = ["H"];
        if (pulprogTemp.some(l => l.includes(":f2")))
            ns.push("C");
        if (pulprogTemp.some(l => l.includes(":f3")))
            ns.push("N");
        return ns;
    }
    // Tells us whether the module includes a DIPSI-2 block. pl10 seems like the
    // most foolproof way.
    hasDipsi() {
        return this.pulprog.includes("pl10:f1");
    }
}
export default NOAHModule;
