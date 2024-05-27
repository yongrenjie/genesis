export class AcquFlag {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
    // generate a comment for the pulse programme containing the citation
    makeComment() {
        return `;     [zgoptns: use -D${this.name} for ${this.description}]`;
    }
}
// Reusable flags.
export const AF_EDIT = new AcquFlag("EDIT", "multiplicity editing");
export const AF_INVERT = new AcquFlag("INVERT", "editing of direct/indirect peaks");
export const AF_EDIT1 = new AcquFlag("EDIT1", "multiplicity editing");
export const AF_INVERT1 = new AcquFlag("INVERT1", "editing of direct/indirect peaks");
export const AF_ES = new AcquFlag("ES", "excitation sculpting");
export const AF_PRESAT_D1 = new AcquFlag("PRESAT", "presaturation during d1");
export const AF_PRESAT_NOE = new AcquFlag("PRESAT", "presaturation during NOE mixing time (and d1)");
export const AF_NOZQS = new AcquFlag("NOZQS", "no zero-quantum suppression");
export const AF_LP3 = new AcquFlag("LP3", "'upgrade' to third-order LPJF");
export const AF_NLP3 = new AcquFlag("NLP3", "'upgrade' to third-order LPJF");
