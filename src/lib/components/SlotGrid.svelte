<script lang="ts">
	import type {
		CustomBuild,
		GearSchool,
		Skill,
		Mutagen,
		Mutation,
		GenericItem,
		SlotColor
	} from '../types';
	import {
		mutagenSlotsUnlockedAtLevel,
		skillSlotsUnlockedAtLevel,
		abilityPointsAtLevel,
		SKILL_SLOT_UNLOCK_LEVELS,
		SLOT_GROUP_SIZE,
		SLOT_GROUP_COUNT,
		MUTAGEN_SLOT_UNLOCKS
	} from '../data/slotProgression';
	import {
		pointsSpentInCategory,
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
	import { skillCategoryLabel } from '../labels';

	let { build, onUpdate }: { build: CustomBuild; onUpdate: (patch: Partial<CustomBuild>) => void } =
		$props();

	const skills = skillsData as Skill[];
	const gearSets = gearSetsData as GearSet[];
	const mutagens = mutagensData as Mutagen[];
	const mutations = mutationsData as Mutation[];
	const decoctions = decoctionsData as GenericItem[];
	const skillsById = new Map(skills.map((s) => [s.id, s]));

	const categories: { key: Skill['category']; color: SlotColor; label: string }[] = [
		{ key: 'combat', color: 'red', label: skillCategoryLabel.combat },
		{ key: 'signs', color: 'blue', label: skillCategoryLabel.signs },
		{ key: 'alchemy', color: 'green', label: skillCategoryLabel.alchemy },
		{ key: 'general', color: 'none', label: skillCategoryLabel.general }
	];

	let totalAvailable = $derived(abilityPointsAtLevel(build.level));
	let totalSpent = $derived(totalPointsSpent(build));
	let unlockedMutagenSlots = $derived(mutagenSlotsUnlockedAtLevel(build.level));
	let unlockedSkillSlots = $derived(skillSlotsUnlockedAtLevel(build.level));
	let learnedSkills = $derived(skills.filter((s) => rankOf(build, s.id) > 0));

	function setLevel(value: number) {
		onUpdate({ level: Math.max(1, Math.min(100, value)) });
	}

	function setRank(skill: Skill, rank: number) {
		onUpdate(withSkillRank(build, skill, rank));
	}

	function setEquipped(slotIndex: number, skillId: string) {
		onUpdate({ equipped: withEquippedSlot(build, slotIndex, skillId || null) });
	}

	function setMutagenSlot(index: number, mutagenId: string) {
		const next = [...build.mutagens];
		next[index] = mutagenId || null;
		onUpdate({ mutagens: next });
	}

	function setMutation(mutationId: string) {
		onUpdate({ mutation: mutationId || null });
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
	<div class="flex flex-wrap items-end gap-6">
		<div>
			<label class="block text-sm font-semibold tracking-wide text-stone-400 uppercase" for="level">
				Nível do personagem
			</label>
			<input
				id="level"
				type="number"
				min="1"
				max="100"
				value={build.level}
				oninput={(e) => setLevel(Number(e.currentTarget.value))}
				class="mt-1.5 w-24 rounded border border-stone-700 bg-stone-800 px-2 py-1 text-stone-100"
			/>
		</div>
		<p class="text-sm text-stone-400">
			Pontos de habilidade: <span class="font-semibold text-stone-100">{totalSpent}</span> / {totalAvailable}
			gastos
		</p>
	</div>

	<section>
		<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">
			Aprender habilidades
		</h2>
		<p class="mt-1 text-sm text-stone-500">
			Cada árvore desbloqueia o próximo tier ao acumular 6 / 12 / 18 pontos investidos nela.
		</p>
		<div class="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-2">
			{#each categories as cat (cat.key)}
				{@const spent = pointsSpentInCategory(build, cat.key, skillsById)}
				<div>
					<h3 class="font-semibold text-stone-200">{cat.label} — {spent} pontos investidos</h3>
					<div class="mt-2 space-y-1.5">
						{#each skills
							.filter((s) => s.category === cat.key)
							.sort((a, b) => a.tier - b.tier) as skill (skill.id)}
							{@const rank = rankOf(build, skill.id)}
							{@const unlocked = isSkillUnlocked(build, skill, skillsById)}
							<div
								class={[
									'flex items-center gap-2 rounded border p-2 text-sm',
									unlocked
										? 'border-stone-700 bg-stone-800/40'
										: 'border-stone-800 bg-stone-900/40 opacity-50'
								]}
							>
								<div class="min-w-0 flex-1">
									<span class="text-stone-100">{skill.name}</span>
									<span class="ml-1 text-xs text-stone-500">Tier {skill.tier}</span>
								</div>
								<button
									type="button"
									disabled={rank <= 0}
									onclick={() => setRank(skill, rank - 1)}
									class="rounded border border-stone-700 px-2 disabled:opacity-30"
								>
									−
								</button>
								<span class="w-10 text-center font-mono">{rank}/{skill.maxRank}</span>
								<button
									type="button"
									disabled={!unlocked || rank >= skill.maxRank || totalSpent >= totalAvailable}
									onclick={() => setRank(skill, rank + 1)}
									class="rounded border border-stone-700 px-2 disabled:opacity-30"
								>
									+
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">
			Equipar habilidades ({unlockedSkillSlots}/{SKILL_SLOT_UNLOCK_LEVELS.length} slots liberados)
		</h2>
		<p class="mt-1 text-sm text-stone-500">
			Qualquer habilidade aprendida pode ir em qualquer slot. Cada grupo de 3 slots compartilha um
			mutagênico, cujo bônus escala com habilidades da mesma cor no grupo.
		</p>
		<div class="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
			{#each Array(SLOT_GROUP_COUNT), group (group)}
				{@const mutagenLocked = group >= unlockedMutagenSlots}
				<div class="rounded-lg border border-stone-700 bg-stone-800/30 p-3">
					<h3 class="text-sm font-semibold text-stone-200">Grupo {group + 1}</h3>
					<div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
						{#each Array(SLOT_GROUP_SIZE), i (i)}
							{@const slotIndex = group * SLOT_GROUP_SIZE + i}
							{@const locked = slotIndex >= unlockedSkillSlots}
							<select
								disabled={locked}
								value={build.equipped[slotIndex] ?? ''}
								onchange={(e) => setEquipped(slotIndex, e.currentTarget.value)}
								class="rounded border border-stone-700 bg-stone-900 px-2 py-1 text-sm text-stone-100 disabled:opacity-40"
							>
								<option value="">
									{locked ? `Nível ${SKILL_SLOT_UNLOCK_LEVELS[slotIndex]}` : '— vazio —'}
								</option>
								{#each learnedSkills as skill (skill.id)}
									<option value={skill.id}>{skill.name}</option>
								{/each}
							</select>
						{/each}
					</div>
					<div class="mt-2 flex items-center gap-2">
						<span class="text-xs text-stone-500">Mutagênico</span>
						<select
							disabled={mutagenLocked}
							value={build.mutagens[group] ?? ''}
							onchange={(e) => setMutagenSlot(group, e.currentTarget.value)}
							class="flex-1 rounded border border-stone-700 bg-stone-900 px-2 py-1 text-sm text-stone-100 disabled:opacity-40"
						>
							<option value="">
								{mutagenLocked ? `Nível ${MUTAGEN_SLOT_UNLOCKS[group]}` : '— vazio —'}
							</option>
							{#each mutagens as mutagen (mutagen.id)}
								<option value={mutagen.id}>{mutagen.name}</option>
							{/each}
						</select>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">
			Mutação (Blood and Wine)
		</h2>
		<p class="mt-1 text-sm text-stone-500">
			Liberada na quest "Turn and Face the Strange" do Blood and Wine. Pesquisar mutações também
			desbloqueia até 4 slots extras de habilidade (com 2/4/8/12 mutações pesquisadas).
		</p>
		<select
			value={build.mutation ?? ''}
			onchange={(e) => setMutation(e.currentTarget.value)}
			class="mt-2 w-full max-w-sm rounded border border-stone-700 bg-stone-900 px-2 py-1 text-sm text-stone-100"
		>
			<option value="">— nenhuma —</option>
			{#each mutations as mutation (mutation.id)}
				<option value={mutation.id}>{mutation.name}</option>
			{/each}
		</select>
	</section>

	<section>
		<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">
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
		<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">Decocções</h2>
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
