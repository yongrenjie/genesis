<script lang="ts">
    import { makePulprogText } from "./pulprog.ts";

    const manualInput = document.getElementById("manual-modules") as HTMLInputElement;
    const devModeButton = document.getElementById("devmode_button") as HTMLInputElement;

    function updatePulprogText() {
        const moduleNames = manualInput.value
            .toUpperCase().split(/\s+/).filter(m => m !== "");
        if (moduleNames.length == 0) {
            return "";
        }
        let ppText: string;
        try {
            ppText = makePulprogText(moduleNames,
                devModeButton.checked,
                devModeButton.checked
            ); 
        }
        catch (error) { console.error(error); ppText = ""; }
        return ppText;
    }

    let pulprogText = "";
    let placeholder = "";
    let minModules = devModeButton.checked ? "one" : "two";

    placeholder = `Select ${minModules} or more modules to generate pulse programme...`;
    pulprogText = updatePulprogText();
</script>

<textarea id="pulprog_text" rows=30 readonly {placeholder} bind:value={pulprogText}></textarea>
