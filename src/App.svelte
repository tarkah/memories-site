<script>
    import { onMount } from "svelte";
    import { Router, Route, navigate } from "svelte-routing";
    import Home from "./pages/Home.svelte";
    import Login from "./pages/Login.svelte";
    import { token, isTokenValid } from "./store";
    import { readJsonBody } from "./util/util";

    onMount(async () => {
        const response = await fetch("/validToken", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: $token }),
        });

        const valid =
            (await readJsonBody<{ valid: boolean }>(response))?.valid || false;

        if (valid === true) {
            $isTokenValid = true;
        } else {
            $token = "";
            $isTokenValid = false;
        }

        if (!$token) {
            console.log("Token not set, redirecting to login page");

            navigate("/login", { replace: true });
        }
    });
</script>

<Router>
    <Route path="/login"><Login /></Route>
    {#if $isTokenValid}
        <Route path="*"><Home /></Route>
    {/if}
</Router>

<style global>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
