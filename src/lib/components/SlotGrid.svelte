<script lang="ts">
	import type { CustomBuild, GearSchool, Skill, Mutagen, Mutation, GenericItem } from '../types';
	import {
		mutagenSlotsUnlockedAtLevel,
		skillSlotsUnlockedAtLevel,
		abilityPointsAtLevel
	} from '../data/slotProgression';
	import {
		totalPointsSpent,
		isSkillUnlocked,
		rankOf,
		withSkillRank,
		withEquippedSlot
	} from '../utils/economy';
	import skillsData from '../data/skills.json';
	import gearSetsData from '../data/gearSets.json';
	import mutagensData from '../data/mutagens.json';
	import mutationsData from '../data/mutations.json';
	import decoctionsData from '../data/decoctions.json';
	import type { GearSet } from '../types';
	import SkillTreePanel from './SkillTreePanel.svelte';
	import EquipPanel from './EquipPanel.svelte';

	let { build, onUpdate }: { build: CustomBuild; onUpdate: (patch: Partial<CustomBuild>) => void } =
		$props();

	const skills = skillsData as Skill[];
	const gearSets = gearSetsData as GearSet[];
	const mutagens = mutagensData as Mutagen[];
	const mutations = mutationsData as Mutation[];
	const decoctions = decoctionsData as GenericItem[];
	const skillsById = new Map(skills.map((s) => [s.id, s]));
	const mutationsById = new Map(mutations.map((m) => [m.id, m]));

	const mutationDot: Record<'red' | 'blue' | 'green', string> = {
		red: 'bg-red-600',
		blue: 'bg-blue-500',
		green: 'bg-green-600'
	};

	let totalAvailable = $derived(abilityPointsAtLevel(build.level));
	let totalSpent = $derived(totalPointsSpent(build));
	let unlockedMutagenSlots = $derived(mutagenSlotsUnlockedAtLevel(build.level));
	let unlockedSkillSlots = $derived(skillSlotsUnlockedAtLevel(build.level));
	let learnedSkills = $derived(skills.filter((s) => rankOf(build, s.id) > 0));
	let ranks = $derived(
		Object.fromEntries(build.learnedSkills.map((inv) => [inv.skillId, inv.rank]))
	);

	function setLevel(value: number) {
		onUpdate({ level: Math.max(1, Math.min(100, value)) });
	}

	function canIncrement(skill: Skill): boolean {
		return (
			isSkillUnlocked(build, skill, skillsById) &&
			rankOf(build, skill.id) < skill.maxRank &&
			totalSpent < totalAvailable
		);
	}

	function onRankChange(skill: Skill, delta: 1 | -1) {
		onUpdate(withSkillRank(build, skill, rankOf(build, skill.id) + delta));
	}

	function setEquipped(slotIndex: number, skillId: string | null) {
		onUpdate({ equipped: withEquippedSlot(build, slotIndex, skillId) });
	}

	function setMutagenSlot(index: number, mutagenId: string | null) {
		const next = [...build.mutagens];
		next[index] = mutagenId;
		onUpdate({ mutagens: next });
	}

	function setMutation(mutationId: string | null) {
		onUpdate({ mutation: build.mutation === mutationId ? null : mutationId });
	}

	function setGearSchool(school: string) {
		onUpdate({ gearSchool: (school as GearSchool) || null });
	}

	function toggleDecoction(id: string) {
		const has = build.decoctions.includes(id);
		onUpdate({
			decoctions: has ? build.decoctions.filter((d) => d !== id) : [...build.decoctions, id]
		});
	}
</script>

<div class="space-y-8">
	<!-- Cabeçalho no estilo da tela de personagem: nível + pontos -->
	<div
		class="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-stone-800 bg-stone-900/40 px-4 py-3"
	>
		<div class="flex items-center gap-3">
			<label class="text-sm font-semibold tracking-widest text-amber-200/80 uppercase" for="level">
				Nível
			</label>
			<input
				id="level"
				type="number"
				min="1"
				max="100"
				value={build.level}
				oninput={(e) => setLevel(Number(e.currentTarget.value))}
				class="w-20 rounded border border-stone-700 bg-stone-800 px-2 py-1 text-center text-lg font-bold text-stone-100"
			/>
		</div>
		<p class="text-sm text-stone-400">
			Pontos de habilidade:
			<span class="font-semibold text-stone-100">{totalSpent}</span> / {totalAvailable} gastos
		</p>
	</div>

	<!-- Árvores (esquerda) + slots equipados (direita), como no jogo -->
	<div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
		<SkillTreePanel
			{skills}
			{ranks}
			{onRankChange}
			{canIncrement}
			availablePoints={totalAvailable - totalSpent}
		/>

		<section class="rounded-lg border border-stone-800 bg-stone-900/30 p-4">
			<h2 class="text-sm font-semibold tracking-widest text-stone-400 uppercase">
				Habilidades equipadas ({unlockedSkillSlots}/12 slots)
			</h2>
			<p class="mt-1 mb-5 text-sm text-stone-500">
				Qualquer habilidade aprendida pode ir em qualquer slot. Cada grupo de 3 compartilha um
				mutagênico, cujo bônus escala com habilidades da mesma cor no grupo.
			</p>
			<EquipPanel
				equipped={build.equipped}
				mutagens={build.mutagens}
				{unlockedSkillSlots}
				{unlockedMutagenSlots}
				{learnedSkills}
				allMutagens={mutagens}
				onEquip={setEquipped}
				onMutagen={setMutagenSlot}
			/>
		</section>
	</div>

	<section>
		<h2 class="text-sm font-semibold tracking-widest text-stone-400 uppercase">
			Mutação (Blood and Wine)
		</h2>
		<p class="mt-1 text-sm text-stone-500">
			Liberada na quest "Turn and Face the Strange". Pesquisar mutações também desbloqueia até 4
			slots extras de habilidade (com 2/4/8/12 mutações pesquisadas). Clique para ativar.
		</p>
		<div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
			{#each mutations as mutation (mutation.id)}
				{@const selected = build.mutation === mutation.id}
				<button
					type="button"
					onclick={() => setMutation(mutation.id)}
					title={mutation.description}
					class={[
						'rounded border p-2.5 text-left transition',
						selected
							? 'border-amber-500 bg-amber-950/40'
							: 'border-stone-700 bg-stone-900/50 hover:border-stone-500'
					]}
				>
					<div class="flex items-center gap-2">
						<span class="flex gap-1">
							{#each mutation.colors as color (color)}
								<span class={['size-2.5 rotate-45 rounded-[2px]', mutationDot[color]]}></span>
							{/each}
						</span>
						<span class="font-medium text-stone-100">{mutation.name}</span>
					</div>
					<p class="mt-1 line-clamp-2 text-xs text-stone-400">{mutation.description}</p>
					<p class="mt-1 text-xs text-stone-500">
						Custo: {mutation.cost.skillPoints} pts
						{#if mutation.requires.length}
							· requer {mutation.requires.map((id) => mutationsById.get(id)?.name ?? id).join(', ')}
						{/if}
					</p>
				</button>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="text-sm font-semibold tracking-widest text-stone-400 uppercase">
			Escola de equipamento
		</h2>
		<div class="mt-2 flex flex-wrap gap-2">
			{#each gearSets as set (set.id)}
				<button
					type="button"
					onclick={() => setGearSchool(set.school)}
					class={[
						'rounded-full border px-3 py-1 text-sm transition',
						build.gearSchool === set.school
							? 'border-red-600 bg-red-700 text-white'
							: 'border-stone-700 bg-stone-800 text-stone-300 hover:border-stone-500'
					]}
				>
					{set.name}
				</button>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="text-sm font-semibold tracking-widest text-stone-400 uppercase">Decocções</h2>
		<div class="mt-2 flex flex-wrap gap-2">
			{#each decoctions as decoction (decoction.id)}
				<button
					type="button"
					onclick={() => toggleDecoction(decoction.id)}
					class={[
						'rounded-full border px-3 py-1 text-sm transition',
						build.decoctions.includes(decoction.id)
							? 'border-green-600 bg-green-800 text-white'
							: 'border-stone-700 bg-stone-800 text-stone-300 hover:border-stone-500'
					]}
				>
					{decoction.name}
				</button>
			{/each}
		</div>
	</section>
</div>
