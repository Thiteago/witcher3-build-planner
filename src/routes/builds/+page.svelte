<script lang="ts">
	import buildsData from '$lib/data/builds.json';
	import type { CuratedBuild } from '$lib/types';
	import BuildCard from '$lib/components/BuildCard.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import { groupTagsByPrefix, matchesAllTags } from '$lib/utils/filter';

	const builds = buildsData as CuratedBuild[];

	const allTags = [...new Set(builds.flatMap((b) => b.tags))];
	const groups = groupTagsByPrefix(allTags);

	const groupLabels: Record<string, string> = {
		focus: 'Foco',
		role: 'Papel',
		stage: 'Estágio do jogo',
		requires: 'Requer',
		gear: 'Escola de equipamento'
	};

	let selectedTags = $state<string[]>([]);

	let filtered = $derived(builds.filter((b) => matchesAllTags(b.tags, selectedTags)));
</script>

<section class="space-y-4">
	<h1 class="text-2xl font-bold">Builds recomendados</h1>

	<div class="space-y-3">
		{#each Object.entries(groups) as [group, tags] (group)}
			<FilterBar
				label={groupLabels[group] ?? group}
				options={tags.map((t) => ({ value: t, label: t.split(':')[1] }))}
				bind:selected={selectedTags}
			/>
		{/each}
	</div>

	<p class="text-sm text-stone-500">{filtered.length} de {builds.length} builds</p>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		{#each filtered as build (build.id)}
			<BuildCard {build} />
		{/each}
	</div>
</section>
