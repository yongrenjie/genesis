class NOAHModule {
    nuclei: string;
    shortCode: string;
    auprog: string;
    shortDescription: string;
    preamble: string;
    pulprog: string;

    constructor(nuclei: string,
                shortCode: string,
                auprog: string,
                shortDescription: string,
                preamble: string,
                pulprog: string) {
        this.nuclei = nuclei;
        this.shortCode = shortCode;
        this.auprog = auprog;
        this.shortDescription = shortDescription;
        this.preamble = preamble;
        this.pulprog = pulprog;
    }
}

export default NOAHModule;
