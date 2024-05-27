export class Citation {
    constructor(title, authors, journal, year, volume, issue, pages, doi) {
        this.title = title;
        this.authors = authors;
        this.journal = journal;
        this.year = year;
        this.volume = volume;
        this.issue = issue;
        this.pages = pages;
        this.doi = doi;
    }
    // generate a comment for the pulse programme containing the citation
    makePPCitation() {
        let volIssue;
        if (this.issue === "")
            volIssue = `${this.volume}`;
        else
            volIssue = `${this.volume} (${this.issue})`;
        const c = [
            `;${this.authors.join(", ")}`,
            `;${this.journal} ${this.year}, ${volIssue}, ${this.pages}`,
            `;${this.title}`,
        ].join("\n");
        return c;
    }
}
// common strings. Unfortunately, I'm pretty sure non-ASCII characters break TopSpin.
// Sorry Eriks.
const Eriks = "E. Kupce";
const Tim = "T. D. W. Claridge";
const ACIE = "Angew. Chem. Int. Ed.";
const JMR = "J. Magn. Reson.";
const MRC = "Magn. Reson. Chem.";
export const Kupce2017ACIE = new Citation("NOAH: NMR Supersequences for Small Molecule Analysis and Structure Elucidation", [Eriks, Tim], ACIE, 2017, 56, 39, "11779-11783", "10.1002/anie.201705506");
export const Kupce2018CC = new Citation("Molecular structure from a single NMR supersequence", [Eriks, Tim], "Chem. Commun.", 2018, 54, 52, "7139-7142", "10.1039/C8CC03296C");
export const Claridge2019MRC = new Citation("Triplet NOAH supersequences opTimised for small molecule structure characterisation", [Tim, "M. Mayzel", Eriks], MRC, 2019, 57, 11, "946-952", "10.1002/MRC.4887");
export const Kupce2019JMR = new Citation("New NOAH modules for structure elucidation at natural isotopic abundance", [Eriks, Tim], JMR, 2019, 307, "", "106568", "10.1016/j.JMR.2019.106568");
export const Hansen2021AC = new Citation("2D NMR-Based Metabolomics with HSQC/TOCSY NOAH Supersequences", ["A. L. Hansen", Eriks, "D.-W. Li", "L. Bruschweiler-Li", "R. Bruschweiler"], "Analytical Chemistry", 2021, 93, 15, "6112-6119", "10.1021/acs.analchem.0c05205");
export const Koos2016ACIE = new Citation("Clean In-Phase Experiment for the Rapid Acquisition of COSY-type Correlations", ["M. R. M. Koos", "G. Kummerlowe", "L. Kaltschnee", "C. M. Thiele", "B. Luy"], ACIE, 2016, 55, 27, "7655-7659", "10.1002/anie.201510938");
export const Thiele2009CEJ = new Citation("EASY ROESY: Reliable Cross-Peak Integration in Adiabatic Symmetrized ROESY", ["C. M. Thiele", "K. Petzold", "J. Schleucher"], "Chem. Eur. J.", 2009, 15, 3, "585-588", "10.1002/chem.200802027");
export const Foroozandeh2014ACIE = new Citation("Ultrahigh-Resolution NMR Spectroscopy", ["M. Foroozandeh", "R. W. Adams", "N. J. Meharry", "D. Jeannerat", "M. Nilsson", "G. A. Morris"], ACIE, 2014, 53, 27, "6990-6992", "10.1002/anie.201404111");
export const Foroozandeh2015CC = new Citation("Measuring couplings in crowded NMR spectra: pure shift NMR with multiplet analysis", ["M. Foroozandeh", "R. W. Adams", "P. Kiraly", "M. Nilsson", "G. A. Morris"], "Chem. Commun.", 2015, 51, 84, "15410-15413", "10.1039/C5CC06293D");
export const Cicero2001JMR = new Citation("Sensitivity Enhancement of a Two-Dimensional Experiment for the Measurement of Heteronuclear Long-Range Coupling Constants, by a New Scheme of Coherence Selection by Gradients", ["D. O. Cicero", "G. Barbato", "R. Bazzo"], JMR, 2001, 148, 1, "209-213", "10.1006/jmre.2000.2234");
export const Gyongyosi2021AC = new Citation("Expedited Nuclear Magnetic Resonance Assignment of Small- to Medium-Sized Molecules with Improved HSQC−CLIP−COSY Experiments", ["T. Gyongyosi", "I. Timari", "D. Sinnaeve", "B. Luy", "K. E. Kover"], "Anal. Chem.", 2021, 93, 6, "3096-3102", "10.1021/acs.analchem.0c04124");
