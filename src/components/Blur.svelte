<script>
    import { fade } from "svelte/transition";
    import { decode } from "blurhash";

    export let width;
    export let height;
    export let blurHash = "UHFFaXYk^6#M@-5b,1J5@[or[R6.};FxngOZ";

    const buildCanvas = (node) => {
        const pixels = decode(blurHash, width, height);
        const ctx = node.getContext("2d");
        const imageData = ctx.createImageData(width, height);
        imageData.data.set(pixels);
        ctx.putImageData(imageData, 0, 0);
    };
</script>

<canvas transition:fade {width} {height} use:buildCanvas />
