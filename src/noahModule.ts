import { Citation } from "./citation.js";
import { AcquFlag } from "./acquFlag.js";
type ModuleCategory = "hmbc" | "n15" | "c13" | "h1";
type Nucleus = "N" | "C" | "H";
import { replaceAllPSElements } from "./elements.js";

class NOAHModule {
    name: string;
    category: ModuleCategory;
    shortCode: string;
    citations: Citation[];
    auprog: string;
    shortTitle: string;
    shortDescription: string;
    acquFlags: AcquFlag[];
    preamble: string;
    pulprog: string;
    nfid: number;
    interleaved: boolean;

    constructor(name: string,
                category: ModuleCategory,
                shortCode: string,
                citations: Citation[],
                auprog: string,
                shortTitle: string,
                shortDescription: string,
                acquFlags: AcquFlag[],
                preamble: string,
                pulprog: string,
                nfid: number,
                interleaved: boolean) {
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
    nuclei(): Nucleus[] {
        // First replace the pulse sequence elements.
        const [pulprogTemp, preambleTemp] = replaceAllPSElements(
            this.pulprog.split('\n'),
            this.preamble.split('\n')
        );
        // It seems reasonable to assume that every module has some pulse on H.
        let ns: Nucleus[] = ["H"];
        if (pulprogTemp.some(l => l.includes(":f2"))) ns.push("C");
        if (pulprogTemp.some(l => l.includes(":f3"))) ns.push("N");
        return ns;
    }

    // Tells us whether the module includes a DIPSI-2 block. pl10 seems like the
    // most foolproof way.
    hasDipsi(): boolean {
        return this.pulprog.includes("pl10:f1");
    }
}

export default NOAHModule;
