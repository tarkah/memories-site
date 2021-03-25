<script>
    import { fade } from "svelte/transition";
    import Zooming from "zooming";
    import Blur from "./Blur.svelte";
    import Lazy from "./Lazy.svelte";
    import { token } from "../store";

    export let src = "";
    export let img_alt = "";
    export let title: String = "Placeholder";
    export let body = "";
    export let blurHash;

    let isImgLoaded = false;
    let imgElement: HTMLImageElement;
    let imgClassShown = "object-cover w-full h-96";
    let imgClassHidden = "hidden";

    $: overflowClass = "overflow-hidden";
    $: encodedToken = encodeURIComponent($token);

    const onImgLoad = (node) => {
        const zooming = new Zooming({
            enableGrab: false,
            bgOpacity: 0.9,
            bgColor: "rgb(253, 242, 248)",
            scaleBase: 1.0,
            onBeforeOpen: (target: HTMLImageElement) => {
                target.className = "object-contain";
                overflowClass = "overflow-visible";
            },
            onBeforeClose: (target) => {
                target.className = imgClassShown;
            },

            onClose: (target) => {
                overflowClass = "overflow-hidden";
            },
        });

        zooming.listen(imgElement);

        isImgLoaded = true;
    };

    const onBlurDrop = (node) => {
        return {
            destroy() {
                imgElement.className = imgClassShown;
            },
        };
    };
</script>

<div class="w-full pt-8">
    <div class="wedding-font text-pink-600 text-7xl font-medium ml-4">
        {title}
    </div>

    <div class="shadow-xl rounded-xl">
        <div
            class="h-96 w-full rounded-t-xl border-l border-r border-pink-600 {overflowClass}"
        >
            <Lazy height={384}>
                <div>
                    {#if !isImgLoaded}
                        <div use:onBlurDrop>
                            <Blur width={734} height={384} {blurHash} />
                        </div>
                    {/if}

                    <img
                        bind:this={imgElement}
                        in:fade
                        on:load={onImgLoad}
                        src="{src}?token={encodedToken}"
                        class={imgClassHidden}
                        alt={img_alt}
                    />
                </div>
            </Lazy>
        </div>
        <div
            class="whitespace-pre-line rounded-b-xl border-l border-r border-pink-600 bg-white p-4"
        >
            <div>{body}</div>
        </div>
    </div>
</div>
