<script>
    import { token, isTokenValid } from "../store";
    import { navigate } from "svelte-routing";

    $: password = "";
    $: error = "";

    const onSubmit = async () => {
        error = "";

        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: password }),
        });

        switch (response.status) {
            case 200: {
                await response.json().then((body) => {
                    const accessToken = body?.accessToken;

                    if (accessToken) {
                        $token = accessToken;
                        $isTokenValid = true;

                        navigate("/", { replace: true });
                    }
                });
                break;
            }
            case 401: {
                error = "Incorrect Password";
                break;
            }
            default: {
                error = "Unknown Error, Try Again";
                break;
            }
        }
    };
</script>

<main class="container w-screen flex justify-center mt-60 px-8">
    <form
        class="w-96 self-center bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        on:submit|preventDefault={onSubmit}
    >
        <div class="mb-6">
            <label class="block text-sm font-bold mb-2" for="password">
                Password
            </label>
            <input
                class="border-2 hover:border-pink-600 focus:border-pink-600 rounded w-full py-2 px-3 mb-3"
                id="password"
                type="password"
                placeholder="******************"
                bind:value={password}
            />
            <p class="text-red-600 italic">{error}</p>
        </div>
        <div class="items-center justify-between">
            <button
                class="bg-pink-600 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded"
                type="submit"
            >
                Submit
            </button>
        </div>
    </form>
</main>
