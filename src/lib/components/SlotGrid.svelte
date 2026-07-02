<script lang="ts">
	import type { CustomBuild, GearSchool, Skill, Mutagen, Mutation, GenericItem } from '../types';
	import {
		ABILITY_SLOT_COUNT,
		MUTAGEN_SLOT_COUNT
	} from '../types';
	import {
		abilitySlotsUnlockedAtLevel,
		mutagenSlotsUnlockedAtLevel,
		ABILITY_SLOT_UNLOCKS
	} from '../data/slotProgression';
	import skillsData from '../data/skills.json';
	import gearSetsData from '../data/gearSets.json';
	import mutagensData from '../data/mutagens.json';
	import mutationsData from '../data/mutations.json';
	import decoctionsData from '../data/decoctions.json';
	import type { GearSet } from '../types';
	import { skillColorLabel } from '../labels';

	let { build, onUpdate }: { build: CustomBuild; onUpdate: (patch: Partial<CustomBuild>) => void } =
		$props();

	const skills = skillsData as Skill[];
	const gearSets = gearSetsData as GearSet[];
	const mutagens = mutagensData as Mutagen[];
	const mutations = mutationsData as Mutation[];
	const decoctions = decoctionsData as GenericItem[];

	let unlockedAbilitySlots = $derived(abilitySlotsUnlockedAtLevel(build.level));
	let unlockedMutagenSlots = $derived(mutagenSlotsUnlockedAtLevel(build.level));
	let mutationsUnlocked = $derived(build.skills.includes('strengthened-synapses'));

	function setLevel(value: number) {
		onUpdate({ level: Math.max(1, Math.min(100, value)) });
	}

	function setSkillSlot(index: number, skillId: string) {
		const next = [...build.skills];
		next[index] = skillId || null;
		onUpdate({ skills: next });
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

	<section>
		<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">
			Habilidades ({unlockedAbilitySlots}/{ABILITY_SLOT_COUNT} slots liberados)
		</h2>
		<div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
			{#each Array(ABILITY_SLOT_COUNT) as _, i (i)}
				{@const locked = i >= unlockedAbilitySlots}
				<div class="rounded border border-stone-700 bg-stone-800/40 p-2">
					<span class="text-xs text-stone-500">Nível {ABILITY_SLOT_UNLOCKS[i]}</span>
					<select
						disabled={locked}
						value={build.skills[i] ?? ''}
						onchange={(e) => setSkillSlot(i, e.currentTarget.value)}
						class="mt-1 w-full rounded border border-stone-700 bg-stone-900 px-2 py-1 text-sm text-stone-100 disabled:opacity-40"
					>
						<option value="">{locked ? 'Bloqueado' : '— vazio —'}</option>
						{#each skills as skill (skill.id)}
							<option value={skill.id}>{skill.name} · {skillColorLabel[skill.color]}</option>
						{/each}
					</select>
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">
			Mutagênicos ({unlockedMutagenSlots}/{MUTAGEN_SLOT_COUNT} slots liberados)
		</h2>
		<div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
			{#each Array(MUTAGEN_SLOT_COUNT) as _, i (i)}
				{@const locked = i >= unlockedMutagenSlots}
				<div class="rounded border border-stone-700 bg-stone-800/40 p-2">
					<span class="text-xs text-stone-500">Slot {i + 1}</span>
					<select
						disabled={locked}
						value={build.mutagens[i] ?? ''}
						onchange={(e) => setMutagenSlot(i, e.currentTarget.value)}
						class="mt-1 w-full rounded border border-stone-700 bg-stone-900 px-2 py-1 text-sm text-stone-100 disabled:opacity-40"
					>
						<option value="">{locked ? 'Bloqueado' : '— vazio —'}</option>
						{#each mutagens as mutagen (mutagen.id)}
							<option value={mutagen.id}>{mutagen.name}</option>
						{/each}
					</select>
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">
			Mutação (Blood and Wine)
		</h2>
		{#if !mutationsUnlocked}
			<p class="mt-1 text-sm text-stone-500">
				Escolha a skill "Sinapses Fortalecidas" para liberar o slot de mutação.
			</p>
		{:else}
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
		{/if}
	</section>

	<section>
		<h2 class="text-sm font-semibold tracking-wide text-stone-400 uppercase">Escola de equipamento</h2>
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
