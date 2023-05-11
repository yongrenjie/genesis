<script lang="ts">
    export let checked = false
</script>

Developer mode 
<div id="devmode-inner">
    <input id="devmode-button" type="checkbox" bind:checked={checked} />
    <label for="devmode-button" id="devmode-label" tabindex="0"></label>
</div>

<style>
/* checkbox hack */
/* https://css-tricks.com/the-checkbox-hack/ */
/* This is known to have accessibility issues. */
div#devmode-inner {
    position: relative;
    top: 0.18em;
    display: inline-block;
    margin-left: 0.3em;
}
input#devmode-button {
    display: none;
}
#devmode-label {
    display: block;
    width: 2em;
    height: 1em;
    text-indent: -150%;
    clip: rect(0 0 0 0);
    color: transparent;
    user-select: none;
}

#devmode-label::before,
#devmode-label::after {
    content: "";
    display: block;
    position: absolute;
    cursor: pointer;
}

#devmode-label::before {
    width: 100%;
    height: 100%;
    background-color: #dedede;
    border-radius: 9999em;
    -webkit-transition: background-color 0.25s ease;
    transition: background-color 0.25s ease;
}

#devmode-label::after {
    top: 0;
    left: 0;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.45);
    -webkit-transition: left 0.25s ease;
    transition: left 0.25s ease;
}

#devmode-button:checked + #devmode-label::before {
    background-color: #46d13f;
}
#devmode-button:checked + #devmode-label::after {
    left: 1em;
}
</style>
