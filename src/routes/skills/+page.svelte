<script lang="ts">
	import skillsData from '$lib/data/skills.json';
	import type { Skill } from '$lib/types';
	import SkillCard from '$lib/components/SkillCard.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import { matchesAllTags, matchesSearch } from '$lib/utils/filter';

	const skills = skillsData as Skill[];

	const categoryOptions = [
		{ value: 'category:combat', label: 'Combate' },
		{ value: 'category:signs', label: 'Signos' },
		{ value: 'category:alchemy', label: 'Alquimia' },
		{ value: 'category:general', label: 'Geral' }
	];

	let selectedCategories = $state<string[]>([]);
	let search = $state('');

	let filtered = $derived(
		skills.filter(
			(skill) =>
				matchesAllTags([`category:${skill.category}`], selectedCategories) &&
				matchesSearch(`${skill.name} ${skill.description}`, search)
		)
	);
</script>

<section class="space-y-4">
	<h1 class="text-2xl font-bold">Habilidades</h1>

	<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<FilterBar label="Categoria" options={categoryOptions} bind:selected={selectedCategories} />
		<input
			type="search"
			placeholder="Buscar..."
			bind:value={search}
			class="w-full rounded border border-stone-700 bg-stone-800 px-3 py-1.5 text-sm text-stone-100 sm:w-64"
		/>
	</div>

	<p class="text-sm text-stone-500">{filtered.length} de {skills.length} habilidades</p>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		{#each filtered as skill (skill.id)}
			<SkillCard {skill} />
		{/each}
	</div>
</section>
