<script lang="ts">
	import type { CuratedBuild } from '../types';

	let { build }: { build: CuratedBuild } = $props();

	const difficultyLabel: Record<CuratedBuild['difficulty'], string> = {
		easy: 'Fácil',
		moderate: 'Moderada',
		advanced: 'Avançada'
	};
</script>

<a
	href={`/builds/${build.id}`}
	class="block rounded-lg border border-stone-700 bg-stone-800/40 p-4 transition hover:border-red-600"
>
	<div class="flex items-center justify-between gap-2">
		<h3 class="font-semibold text-stone-100">{build.name}</h3>
		<span class="shrink-0 rounded bg-stone-700 px-2 py-0.5 text-xs text-stone-300">
			{difficultyLabel[build.difficulty]}
		</span>
	</div>
	<p class="mt-1 text-sm text-stone-400">{build.description}</p>
	<div class="mt-2 flex flex-wrap gap-1">
		{#each build.tags as tag (tag)}
			<span class="rounded-full bg-stone-700/60 px-2 py-0.5 text-xs text-stone-300">{tag}</span>
		{/each}
	</div>
</a>
