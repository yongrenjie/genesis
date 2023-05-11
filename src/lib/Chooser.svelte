<script lang="ts">
    export let devMode = false;

    class ModuleSelector {
        nonDevModules : {"id": string, "name": string}[];
        devModules : string[];
        cssClass : string;
        heading : string;
        constructor(nonDevModules, devModules, cssClass, heading) {
            this.nonDevModules = nonDevModules;
            this.devModules = devModules;
            this.cssClass = cssClass;
            this.heading = heading;
        }
        getGridRows() : number {
            // add 1 for None
            let nModules = 1 + (devMode ? this.devModules.length : this.nonDevModules.length);

            // Set to constant for 1H modules
            if (this.cssClass === "h1") {
                return Math.ceil((nModules - 1)/2) + 1;
            }
            else {
                return nModules;
            }
        }
    }

    // TODO: Pull module lists from allModules.ts
    // TODO: How to make 13C superscript?

    const hmbcNonDevModules = [
        {id: "hmbc_hmbc", name: "HMBC"}
    ];
    const hmbcDevModules = ["C_HMBC_CNF", "C_HMBC_CF", "C_HMBC_NOF", "C_HMBC_CFDD",
        "C_HMBC_CF_K", "C_HMBC_CFGA", "C_HMBC_CFGB", "C_HMBC_CFGC",
        "N_HMBC_CF", "N_HMBC_CFQDD", "N_HMBC_CFQF", "N_HMBC_CFIM", "N_HMBC_CNF"];
    const hmbc = new ModuleSelector(hmbcNonDevModules, hmbcDevModules, "hmbc", "<sup>13</sup>C HMBC");

    const n15NonDevModules = [
        {id: "n15_hmqc", name: "HMQC"},
        {id: "n15_sehsqc", name: "seHSQC"},
    ];
    const n15DevModules = ["N_HMQC", "N_HSQC", "N_SEHSQC", "N_SEHSQC_OR", "N_SEHSQC_DP"];
    const n15 = new ModuleSelector(n15NonDevModules, n15DevModules, "n15", "<sup>15</sup>N–<sup>1</sup>H");

    const ci13NonDevModules = [
        {id: "ci13_hsqc", name: "HSQC"},
        {id: "ci13_hsqc_f2j", name: "F2 J-HSQC"},
        {id: "ci13_hsqc_cosy", name: "HSQC-COSY"},
        {id: "ci13_hsqc_tocsy", name: "HSQC-TOCSY"},
    ];
    const ci13DevModules = ["CI_HSQCT", "CI_HSQCC", "CI_HSQCC_CLIP", "CI_HSQCC_DSE",
        "CI_HSQC", "CI_HSQCJ", "CI_HSQCC_IA"];
    const ci13 = new ModuleSelector(ci13NonDevModules, ci13DevModules, "ci13", "<sup>13</sup>C–<sup>1</sup>H #1");

    const c13NonDevModules = [
        {id: "c13_hsqc", name: "HSQC"},
        {id: "c13_hsqc_f2j", name: "F2 J-HSQC"},
        {id: "c13_hsqc_cosy", name: "HSQC-COSY"},
        {id: "c13_hsqc_tocsy", name: "HSQC-TOCSY"},
        {id: "c13_hmqc", name: "HMQC"},
        {id: "c13_sehsqc", name: "seHSQC"},
        {id: "c13_sehsqc_f2j", name: "F2 J-seHSQC"},
        {id: "c13_sehsqc_tocsy", name: "seHSQC-TOCSY"},
    ];
    const c13DevModules = ["C_HSQC", "C_HSQCJ", "C_HSQCC", "C_HSQCC_CLIP",
        "C_HSQCC_DSE", "C_HSQCT", "C_SEHSQC", "C_SEHSQCJ", "C_SEHSQC_OR",
        "C_SEHSQCJ_OR", "C_SEHSQC_DP", "C_HSQCC_CIA", "C_HSQCC_DIA",
        "C_HSQCC_IA", "C_HSQCT_IA", "C_SEHSQC_IA", "C_SEHSQCT", "C_SEHSQCT_OR",
        "C_HMQC", "C_HSQC_K", "C_HSQCJ_K", "C_SEHSQCJ", "C_SEHSQCJ_K", "C_ADEQ"];
    const c13 = new ModuleSelector(c13NonDevModules, c13DevModules, "c13", "<sup>13</sup>C–<sup>1</sup>H #2");

    const h1NonDevModules = [
        {id: "h1_cosy", name: "COSY"},
        {id: "h1_cosy_qf", name: "COSY (QF)"},
        {id: "h1_clip_cosy", name: "CLIP-COSY"},
        {id: "h1_dqf_cosy", name: "DQF-COSY"},
        {id: "h1_tocsy", name: "TOCSY"},
        {id: "h1_noesy", name: "NOESY"},
        {id: "h1_roesy", name: "ROESY"},
        {id: "h1_roesy_ad", name: "ROESY (ad.)"},
        {id: "h1_cosy_roesy", name: "COSY·ROESY EA"},
        {id: "h1_cosy_roesy_st", name: "COSY·ROESY St"},
        {id: "h1_cosy_noesy", name: "COSY·NOESY EA"},
        {id: "h1_cosy_noesy_st", name: "COSY·NOESY St"},
        {id: "h1_cosy_tocsy", name: "COSY·TOCSY EA"},
        {id: "h1_cosy_tocsy_st", name: "COSY·TOCSY St"},
        {id: "h1_jres", name: "2DJ (QF)"},
        {id: "h1_psyche_jres", name: "PSYCHE 2DJ"},
        {id: "h1_psyche", name: "1D PSYCHE"},
        {id: "h1_tse_psyche", name: "1D TSE-PSYCHE"},
    ];
    const h1DevModules = ["H_COSY", "H_COSY_QF", "H_CLIP_COSY", "H_DQFCOSY",
        "H_TOCSY", "H_NOESY", "H_ROESY", "H_ROESY_AD", "H_CORO",
        "H_CORO_ST", "H_CONO", "H_CONO_ST", "H_COTO", "H_COTO_ST",
        "H_COTO_STDS", "H_JRES", "H_JRES_PS", "H_PSYCHE", "H_PSYCHE_SAP",
        "H_PSYCHE_TSE", "H_PSYCHE_TSAP", "H_TT_CN", "H_TT_CR", "H_TT_DM",
        "H_CC_T", "H_N_T", "H_R_T", "H_TOCSY_K", "H_ZG"];
    const h1 = new ModuleSelector(h1NonDevModules, h1DevModules, "h1", "<sup>1</sup>H–<sup>1</sup>H");

    const allModuleSelectors : ModuleSelector[] = [hmbc, n15, ci13, c13, h1];
    
    let gridRows : number[] = [];

    $: {
        devMode = devMode; // Forces this block to be run when devMode is changed
        gridRows = allModuleSelectors.map(ms => ms.getGridRows());
    }
</script>

{#each allModuleSelectors as selector, i}
<div class="chooser-overall {selector.cssClass}"> <!-- {{{1 -->
    <div class="chooser_text {selector.cssClass}">{@html selector.heading}</div>
    <div class="chooser_modules {selector.cssClass}">
        <ul style="grid-template-rows: repeat({gridRows[i]}, auto);">
            <li id="li_{selector.cssClass}_none">
                <input type="radio" name="{selector.cssClass}" id="{selector.cssClass}_none" checked />
                <label for="{selector.cssClass}_none">None</label>
            </li>
            {#if !devMode}
                {#each selector.nonDevModules as mod}
                <li><input type="radio" name="{selector.cssClass}" id={mod.id} />
                <label for={mod.id}>{mod.name}</label></li>
                {/each}
            {:else}
                {#each selector.devModules as mod}
                <li class="chooser-code"><input type="radio" name="{selector.cssClass}" id={mod} />
                <label for={mod}>{mod}</label></li>
                {/each}
            {/if}
        </ul>
    </div>
</div>
{/each}


<style>
li.chooser-code {
    font-size: 80%;
    font-family: "Inconsolata";
}

li#li_h1_none {
    grid-column: 1/3;
}
</style>
