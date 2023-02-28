class NOAHModule {
    constructor(category, shortCode, auprog, shortDescription, preamble, pulprog) {
        this.category = category;
        this.shortCode = shortCode;
        this.auprog = auprog;
        this.shortDescription = shortDescription;
        this.preamble = preamble;
        this.pulprog = pulprog;
    }
    // Parse the pulse programme to figure out which nuclei the pulse programme
    // uses. It's pretty basic, but should work.
    nuclei() {
        // It seems reasonable to assume that every module has some pulse on H.
        let ns = ["H"];
        if (this.pulprog.includes(":f2"))
            ns.push("C");
        if (this.pulprog.includes(":f3"))
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
