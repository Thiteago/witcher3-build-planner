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
	import SkillTreePanel from '$lib/components/SkillTreePanel.svelte';
	import { customBuilds } from '$lib/stores/customBuilds.svelte';
	import { emptyEquippedSlots } from '$lib/utils/economy';
	import { SKILL_SLOT_COUNT } from '$lib/data/slotProgression';
	import { simulateLevelingSequence } from '$lib/utils/leveling';
	import { skillCategoryLabel } from '$lib/labels';

	const builds = buildsData as CuratedBuild[];
	const skills = skillsData as Skill[];
	const gearSets = gearSetsData as GearSet[];
	const mutations = mutationsData as Mutation[];
	const decoctions = decoctionsData as GenericItem[];

	let build = $derived(builds.find((b) => b.id === page.params.id));
	let buildSkills = $derived(
		build
			? build.skills.map((id) => skills.find((s) => s.id === id)).filter((s): s is Skill => !!s)
			: []
	);
	let levelingSequence = $derived(build ? simulateLevelingSequence(build.skills, skills) : []);
	let gearSet = $derived(gearSets.find((g) => g.school === build?.gearSchool));
	let mutation = $derived(mutations.find((m) => m.id === build?.mutation));
	let buildDecoctions = $derived(
		build
			? (build.decoctions ?? [])
					.map((id) => decoctions.find((d) => d.id === id))
					.filter((d): d is GenericItem => !!d)
			: []
	);
	let ranks = $derived(Object.fromEntries(buildSkills.map((s) => [s.id, s.maxRank])));

	function copyToPlanner() {
		if (!build) return;
		const equipped = emptyEquippedSlots(SKILL_SLOT_COUNT);
		let nextSlot = 0;
		const learnedSkills = build.skills
			.map((id) => skills.find((s) => s.id === id))
			.filter((s): s is Skill => !!s)
			.map((skill) => {
				if (nextSlot < SKILL_SLOT_COUNT) equipped[nextSlot++] = skill.id;
				return { skillId: skill.id, rank: skill.maxRank };
			});

		const totalRanks = learnedSkills.reduce((sum, inv) => sum + inv.rank, 0);
		const newBuild = customBuilds.create(build.name, {
			// enough levels to afford every point in the build (1 point/level from level 2)
			level: Math.min(100, totalRanks + 1),
			learnedSkills,
			equipped,
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
			<p class="mt-1 text-sm text-stone-500">
				Como fica a árvore com a build completa (passe o mouse numa habilidade para ver a
				descrição).
			</p>
			<div class="mt-2 max-w-2xl">
				<SkillTreePanel {skills} {ranks} />
			</div>
			<details class="mt-3">
				<summary class="cursor-pointer text-sm text-stone-400 hover:text-stone-200">
					Ver descrições das {buildSkills.length} habilidades
				</summary>
				<div class="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
					{#each buildSkills as skill (skill.id)}
						<SkillCard {skill} />
					{/each}
				</div>
			</details>
		</div>

		<div>
			<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">
				Sequência de level up
			</h2>
			<p class="mt-1 text-sm text-stone-500">
				Simulação de quando dá pra investir cada ponto, usando as regras confirmadas do jogo: 1
				ponto por nível a partir do nível 2 e tiers liberados com 6/12/18 pontos na árvore (pontos
				bônus de Locais de Poder não são contados).
			</p>
			<ol class="mt-2 space-y-1.5">
				{#each levelingSequence as step, i (i)}
					<li
						class="flex items-center gap-3 rounded border border-stone-800 bg-stone-900/40 px-3 py-1.5 text-sm"
					>
						<span class="w-20 shrink-0 font-mono whitespace-nowrap text-stone-500"
							>Nível {step.level}</span
						>
						<span class="text-stone-100">{step.skill.name}</span>
						<span class="text-xs text-stone-500">
							· {skillCategoryLabel[step.skill.category]} · rank {step.rank}/{step.skill.maxRank}
						</span>
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
						<span class="rounded-full bg-green-900/40 px-3 py-1 text-sm text-green-300"
							>{d.name}</span
						>
					{/each}
				</div>
			</div>
		{/if}
	</section>
{/if}
