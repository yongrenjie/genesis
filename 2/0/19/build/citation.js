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
        if (this.volume === "" && this.issue === "")
            volIssue = `DOI: ${this.doi}`;
        else if (this.issue === "")
            volIssue = `${this.volume}`;
        else
            volIssue = `${this.volume} (${this.issue})`;
        let commaPages;
        commaPages = this.pages === "" ? "" : `, ${this.pages}`;
        const c = [
            `;${this.authors.join(", ")}`,
            `;${this.journal} ${this.year}, ${volIssue}${commaPages}`,
            `;${this.title}`,
        ].join("\n");
        return c;
    }
}
// common strings. Unfortunately, I'm pretty sure non-ASCII characters break TopSpin.
// Sorry Eriks.
const Eriks = "E. Kupce";
const Tim = "T. D. W. Claridge";
const Jon = "J. R. J. Yong";
const ACIE = "Angew. Chem. Int. Ed.";
const JMR = "J. Magn. Reson.";
const MRC = "Magn. Reson. Chem.";
const AC = "Anal. Chem.";
const CC = "Chem. Commun.";
export const Kupce2017ACIE = new Citation("NOAH: NMR Supersequences for Small Molecule Analysis and Structure Elucidation", [Eriks, Tim], ACIE, 2017, 56, 39, "11779-11783", "10.1002/anie.201705506");
export const Kupce2018CC = new Citation("Molecular Structure from a Single NMR Supersequence", [Eriks, Tim], CC, 2018, 54, 52, "7139-7142", "10.1039/C8CC03296C");
export const Claridge2019MRC = new Citation("Triplet NOAH Supersequences Optimised for Small Molecule Structure Characterisation", [Tim, "M. Mayzel", Eriks], MRC, 2019, 57, 11, "946-952", "10.1002/MRC.4887");
export const Kupce2019JMR = new Citation("New NOAH Modules for Structure Elucidation at Natural Isotopic Abundance", [Eriks, Tim], JMR, 2019, 307, "", "106568", "10.1016/j.JMR.2019.106568");
export const Hansen2021AC = new Citation("2D NMR-Based Metabolomics with HSQC/TOCSY NOAH Supersequences", ["A. L. Hansen", Eriks, "D.-W. Li", "L. Bruschweiler-Li", "R. Bruschweiler"], AC, 2021, 93, 15, "6112-6119", "10.1021/acs.analchem.0c05205");
export const Koos2016ACIE = new Citation("Clean In-Phase Experiment for the Rapid Acquisition of COSY-type Correlations", ["M. R. M. Koos", "G. Kummerlowe", "L. Kaltschnee", "C. M. Thiele", "B. Luy"], ACIE, 2016, 55, 27, "7655-7659", "10.1002/anie.201510938");
export const Thiele2009CEJ = new Citation("EASY ROESY: Reliable Cross-Peak Integration in Adiabatic Symmetrized ROESY", ["C. M. Thiele", "K. Petzold", "J. Schleucher"], "Chem. Eur. J.", 2009, 15, 3, "585-588", "10.1002/chem.200802027");
export const Foroozandeh2014ACIE = new Citation("Ultrahigh-Resolution NMR Spectroscopy", ["M. Foroozandeh", "R. W. Adams", "N. J. Meharry", "D. Jeannerat", "M. Nilsson", "G. A. Morris"], ACIE, 2014, 53, 27, "6990-6992", "10.1002/anie.201404111");
export const Foroozandeh2015CC = new Citation("Measuring Couplings in Crowded NMR Spectra: Pure Shift NMR with Multiplet Analysis", ["M. Foroozandeh", "R. W. Adams", "P. Kiraly", "M. Nilsson", "G. A. Morris"], CC, 2015, 51, 84, "15410-15413", "10.1039/C5CC06293D");
export const Moutzouri2017CC = new Citation("Ultraclean pure shift NMR", ["P. Moutzouri", "Y. Chen", "M. Foroozandeh", "P. Kiraly", "A. R. Phillips", "S. R. Coombes", "M. Nilsson", "G. A. Morris"], CC, 2017, 53, 73, "10188-10191", "10.1039/c7cc04423b");
export const Cicero2001JMR = new Citation("Sensitivity Enhancement of a Two-Dimensional Experiment for the Measurement of Heteronuclear Long-Range Coupling Constants, by a New Scheme of Coherence Selection by Gradients", ["D. O. Cicero", "G. Barbato", "R. Bazzo"], JMR, 2001, 148, 1, "209-213", "10.1006/jmre.2000.2234");
export const Gyongyosi2021AC = new Citation("Expedited Nuclear Magnetic Resonance Assignment of Small- to Medium-Sized Molecules with Improved HSQC-CLIP-COSY Experiments", ["T. Gyongyosi", "I. Timari", "D. Sinnaeve", "B. Luy", "K. E. Kover"], AC, 2021, 93, 6, "3096-3102", "10.1021/acs.analchem.0c04124");
export const Yong2021JMR = new Citation("Increasing Sensitivity and Versatility in NMR Supersequences with New HSQC-based Modules", [Jon, "A. L. Hansen", Eriks, Tim], JMR, 2021, 327, "", "107027", "10.1016/j.jmr.2021.107027");
export const Enthart2008JMR = new Citation("The CLIP/CLAP-HSQC: Pure absorptive spectra for the measurement of one-bond couplings", ["A. Enthart", "J. C. Freudenberger", "J. Furrer", "H. Kessler", "B. Luy"], JMR, 2008, 192, 2, "314-322", "10.1016/j.jmr.2008.03.009");
