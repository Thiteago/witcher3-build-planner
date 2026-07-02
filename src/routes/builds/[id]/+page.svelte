<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import buildsData from '$lib/data/builds.json';
	import skillsData from '$lib/data/skills.json';
	import gearSetsData from '$lib/data/gearSets.json';
	import mutationsData from '$lib/data/mutations.json';
	import decoctionsData from '$lib/data/decoctions.json';
	import type { CuratedBuild, Skill, GearSet, Mutation, GenericItem } from '$lib/types';
	import SkillCard from '$lib/components/SkillCard.svelte';
	import { customBuilds } from '$lib/stores/customBuilds.svelte';
	import { ABILITY_SLOT_COUNT } from '$lib/types';
	import { buildLevelingSequence } from '$lib/utils/leveling';
	import { skillCategoryLabel } from '$lib/labels';

	const builds = buildsData as CuratedBuild[];
	const skills = skillsData as Skill[];
	const gearSets = gearSetsData as GearSet[];
	const mutations = mutationsData as Mutation[];
	const decoctions = decoctionsData as GenericItem[];

	let build = $derived(builds.find((b) => b.id === page.params.id));
	let buildSkills = $derived(
		build ? build.skills.map((id) => skills.find((s) => s.id === id)).filter((s): s is Skill => !!s) : []
	);
	let levelingSequence = $derived(build ? buildLevelingSequence(build.skills, skills) : []);
	let gearSet = $derived(gearSets.find((g) => g.school === build?.gearSchool));
	let mutation = $derived(mutations.find((m) => m.id === build?.mutation));
	let buildDecoctions = $derived(
		build ? (build.decoctions ?? []).map((id) => decoctions.find((d) => d.id === id)).filter((d): d is GenericItem => !!d) : []
	);

	function copyToPlanner() {
		if (!build) return;
		const skillsArr = Array(ABILITY_SLOT_COUNT).fill(null);
		build.skills.forEach((id, i) => {
			if (i < ABILITY_SLOT_COUNT) skillsArr[i] = id;
		});
		const newBuild = customBuilds.create(build.name, {
			level: 30,
			skills: skillsArr,
			gearSchool: build.gearSchool,
			mutation: build.mutation ?? null,
			decoctions: build.decoctions ?? []
		});
		goto(`/planner/${newBuild.id}`);
	}
</script>

{#if !build}
	<p class="text-stone-400">Build não encontrado.</p>
{:else}
	<section class="space-y-6">
		<div class="flex flex-wrap items-start justify-between gap-3">
			<div>
				<h1 class="text-2xl font-bold">{build.name}</h1>
				<p class="mt-1 max-w-2xl text-stone-400">{build.description}</p>
			</div>
			<button
				type="button"
				onclick={copyToPlanner}
				class="rounded bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
			>
				Copiar para Meus Builds
			</button>
		</div>

		<div class="flex flex-wrap gap-1">
			{#each build.tags as tag (tag)}
				<span class="rounded-full bg-stone-700/60 px-2 py-0.5 text-xs text-stone-300">{tag}</span>
			{/each}
		</div>

		<div>
			<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">Habilidades</h2>
			<div class="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
				{#each buildSkills as skill (skill.id)}
					<SkillCard {skill} />
				{/each}
			</div>
		</div>

		<div>
			<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">
				Sequência de level up
			</h2>
			<p class="mt-1 text-sm text-stone-500">
				Ordem sugerida de escolha das habilidades conforme os slots são liberados por nível.
			</p>
			<ol class="mt-2 space-y-1.5">
				{#each levelingSequence as step (step.level)}
					<li
						class="flex items-center gap-3 rounded border border-stone-800 bg-stone-900/40 px-3 py-1.5 text-sm"
					>
						<span class="w-20 shrink-0 font-mono whitespace-nowrap text-stone-500">Nível {step.level}</span>
						{#if step.skill}
							<span class="text-stone-100">{step.skill.name}</span>
							<span class="text-xs text-stone-500">· {skillCategoryLabel[step.skill.category]}</span>
						{:else}
							<span class="text-stone-500 italic">— sua escolha —</span>
						{/if}
					</li>
				{/each}
			</ol>
		</div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
			{#if gearSet}
				<div>
					<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">Equipamento</h2>
					<p class="mt-1 font-medium text-stone-100">{gearSet.name}</p>
					<p class="text-sm text-stone-400">{gearSet.playstyle}</p>
				</div>
			{/if}
			{#if mutation}
				<div>
					<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">Mutação</h2>
					<p class="mt-1 font-medium text-stone-100">{mutation.name}</p>
					<p class="text-sm text-stone-400">{mutation.description}</p>
				</div>
			{/if}
		</div>

		{#if buildDecoctions.length}
			<div>
				<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">Decocções</h2>
				<div class="mt-2 flex flex-wrap gap-2">
					{#each buildDecoctions as d (d.id)}
						<span class="rounded-full bg-green-900/40 px-3 py-1 text-sm text-green-300">{d.name}</span>
					{/each}
				</div>
			</div>
		{/if}
	</section>
{/if}
