class NOAHModule {
    nuclei: string;
    shortCode: string;
    auprog: string;
    shortDescription: string;
    preamble: string;
    module: string;

    constructor(nuclei: string,
                shortCode: string,
                auprog: string,
                shortDescription: string,
                preamble: string,
                module: string) {
        this.nuclei = nuclei;
        this.shortCode = shortCode;
        this.auprog = auprog;
        this.shortDescription = shortDescription;
        this.preamble = preamble;
        this.module = module;
    }
}

export default NOAHModule;
