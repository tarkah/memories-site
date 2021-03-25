<script>
    import { onMount } from "svelte";

    export let onload = null;
    export let height = 0;

    let divElement;
    let inView;

    const checkInView = () => {
        if (!inView && divElement && isInViewport(divElement)) {
            inView = true;

            removeListeners();

            onload && onload();
        }
    };

    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();

        return (
            (rect.top >= 0 &&
                rect.top <=
                    (window.innerHeight ||
                        document.documentElement.clientHeight)) ||
            (rect.bottom >= -height &&
                rect.bottom <=
                    (window.innerHeight ||
                        document.documentElement.clientHeight))
        );
    };

    const removeListeners = () => {
        window.removeEventListener("scroll", checkInView, true);
        window.removeEventListener("resize", checkInView);
    };

    const addListeners = () => {
        window.addEventListener("scroll", checkInView, true);
        window.addEventListener("resize", checkInView);
    };

    const action = (node) => {
        addListeners();

        return {
            destroy() {
                removeListeners();
            },
        };
    };

    onMount(() => {
        checkInView();
    });
</script>

<div use:action bind:this={divElement}>
    {#if inView}
        <slot />
    {/if}
</div>
