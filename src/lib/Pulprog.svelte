<script lang="ts">
    export let ppPlaceholder;
    export let ppValue;
</script>

<textarea rows=30 readonly placeholder={ppPlaceholder} bind:value={ppValue} />

<style>
textarea {
    width: 100%;
    resize: none;
    font-family: "Inconsolata", monospace;
    background-color: inherit;
}
</style>
