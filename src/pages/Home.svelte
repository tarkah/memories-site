<script>
	import { onMount, afterUpdate } from "svelte";
	import Card from "../components/Card.svelte";
	import type { HomeData, ImageHash, Memory } from "../types/home";
	import emojiCursor from "../util/emoji-cursor";
	import { readJsonBody } from "../util/util";
	import { token, y } from "../store";

	let title = "";
	let message = "";

	onMount(async () => {
		history.replaceState({}, "", "/");

		emojiCursor();
	});

	const loadMemories = async () => {
		const homeResponse = await fetch(
			`/private/home.json?token=${encodeURIComponent($token)}`
		);
		const homeData: HomeData = await readJsonBody(homeResponse);
		title = homeData.title;
		message = homeData.message;

		const hashResponse = await fetch(
			`/private/hashes.json?token=${encodeURIComponent($token)}`
		);
		const hashes: ImageHash[] = await readJsonBody(hashResponse);

		const memoryResponse = await fetch(
			`/private/memories.json?token=${encodeURIComponent($token)}`
		);
		const memories: Memory[] = await readJsonBody(memoryResponse);

		memories.sort((a, b) => (a.image > b.image ? 1 : -1));

		memories.forEach((memory) => {
			const hash = hashes.find((hash) => hash.image === memory.image)
				?.hash;

			memory.blurHash = hash;
		});

		return memories;
	};

	const listenScroll = (event) => {
		$y = window.scrollY;
	};

	const setScroll = (node) => {
		window.scrollTo(0, $y);

		window.addEventListener("scroll", listenScroll, true);

		return {
			destroy() {
				window.removeEventListener("scroll", listenScroll, true);
			},
		};
	};
</script>

<main>
	<div class="container mx-auto my-auto md:w-10/12 max-w-screen-md">
		<h1 class="wedding-font text-center text-9xl text-pink-600 mb-8">
			{title}
		</h1>
		<div class="px-4">
			<p class="pb-4 border-b-2 border-pink-600">
				{message}
			</p>
		</div>
		<div class="flex flex-col space-y-4 px-4">
			{#await loadMemories() then memories}
				{#each memories as { title, image, blurHash, body }, i}
					<Card {title} src={image} {blurHash} {body} />
					{#if i === 0}
						<p class="pl-2 italic">
							hint: click on the photos to make them BIGGER
						</p>
					{/if}
				{/each}
				<div use:setScroll />
			{/await}
		</div>
		<div class="mb-12" />
	</div>
</main>
