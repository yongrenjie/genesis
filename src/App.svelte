<script lang="ts">
    import Chooser from './lib/Chooser.svelte'
    import Devmode from './lib/Devmode.svelte'
    import Pulprog from './lib/Pulprog.svelte'

    let devMode = false;
    let ppValue: string = "";
    let ppPlaceholder : string = "";

    $: {
        ppValue = ""; //"You are at: " + window.location.href;
        ppPlaceholder = `Select ${devMode ? "one" : "two"} or more modules to generate pulse programme...`
    }
</script>

<div id="main-wrapper">
    <h1>GENESIS: a NOAH pulse programme generator</h1>

    <h2 id="modules_h2">Module selector</h2>

    <div id="devmode">
        <Devmode bind:checked={devMode} />
    </div>

    <div id="chooser">
        <Chooser {devMode} />
    </div>

    <div id="manual-input">
        <!-- <manualinput /> -->
    </div>

    <div id="buttons">
        <!-- <Buttons /> -->
    </div>

    <h2>Pulse programme text</h2>
    <div id="pulprog">
        <Pulprog {ppPlaceholder} {ppValue} />
    </div>

    <h2>FAQ</h2>
    <div id="faq">
        <!-- <Faq /> -->
    </div>

</div>

<style>
div#devmode {
    text-align: right;
    font-size: 70%;
}

h2#modules_h2 {
    margin-bottom: 0px;
    padding-bottom: 0px;
}
</style>
