<script lang="ts">
	import type { EquippedSlots, Mutagen, Skill } from '../types';
	import {
		MUTAGEN_SLOT_UNLOCKS,
		SKILL_SLOT_UNLOCK_LEVELS,
		SLOT_GROUP_COUNT,
		SLOT_GROUP_SIZE
	} from '../data/slotProgression';
	import Icon from './Icon.svelte';

	interface Props {
		equipped: EquippedSlots;
		mutagens: (string | null)[];
		unlockedSkillSlots: number;
		unlockedMutagenSlots: number;
		learnedSkills: Skill[];
		allMutagens: Mutagen[];
		onEquip: (slotIndex: number, skillId: string | null) => void;
		onMutagen: (group: number, mutagenId: string | null) => void;
	}

	let {
		equipped,
		mutagens,
		unlockedSkillSlots,
		unlockedMutagenSlots,
		learnedSkills,
		allMutagens,
		onEquip,
		onMutagen
	}: Props = $props();

	const skillBorder: Record<Skill['color'], string> = {
		red: 'border-red-500/80',
		blue: 'border-blue-400/80',
		green: 'border-green-500/80',
		none: 'border-amber-500/80'
	};

	const mutagenBg: Record<Mutagen['color'], string> = {
		red: 'bg-red-800/90',
		blue: 'bg-blue-800/90',
		green: 'bg-green-800/90',
		none: 'bg-stone-700'
	};

	let openPicker = $state<{ kind: 'slot' | 'mutagen'; index: number } | null>(null);

	let skillsById = $derived(new Map(learnedSkills.map((s) => [s.id, s])));

	function togglePicker(kind: 'slot' | 'mutagen', index: number) {
		openPicker = openPicker?.kind === kind && openPicker.index === index ? null : { kind, index };
	}

	function pickSkill(slotIndex: number, skillId: string | null) {
		onEquip(slotIndex, skillId);
		openPicker = null;
	}

	function pickMutagen(group: number, mutagenId: string | null) {
		onMutagen(group, mutagenId);
		openPicker = null;
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') openPicker = null;
	}}
/>

{#snippet lockIcon()}
	<svg viewBox="0 0 24 24" class="size-4 fill-current" aria-hidden="true">
		<path d="M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2Zm-8-2a3 3 0 0 1 6 0v2H9V7Z" />
	</svg>
{/snippet}

{#if openPicker}
	<button
		type="button"
		class="fixed inset-0 z-20 cursor-default"
		aria-label="Fechar seletor"
		onclick={() => (openPicker = null)}
	></button>
{/if}

<div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
	{#each Array(SLOT_GROUP_COUNT), group (group)}
		{@const mutagenLocked = group >= unlockedMutagenSlots}
		{@const mutagen = allMutagens.find((m) => m.id === mutagens[group])}
		<div class="flex items-center justify-center gap-5">
			<!-- Slot de mutagênico (losango, como no jogo) -->
			<div class="relative shrink-0">
				<button
					type="button"
					title={mutagenLocked
						? `Slot de mutagênico — libera no nível ${MUTAGEN_SLOT_UNLOCKS[group]}`
						: (mutagen?.name ?? 'Slot de mutagênico — vazio')}
					disabled={mutagenLocked}
					onclick={() => togglePicker('mutagen', group)}
					class={[
						'flex size-12 rotate-45 items-center justify-center rounded-sm border transition',
						mutagen
							? `${mutagenBg[mutagen.color]} border-stone-300/60`
							: 'border-stone-600 bg-stone-900/80',
						mutagenLocked ? 'opacity-40' : 'hover:border-stone-300'
					]}
				>
					<span class="flex -rotate-45 items-center justify-center text-stone-300">
						{#if mutagenLocked}
							{@render lockIcon()}
						{:else if mutagen}
							<span class="text-xs font-bold text-white uppercase">{mutagen.name.charAt(0)}</span>
						{/if}
					</span>
				</button>
				{#if mutagenLocked}
					<span class="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-stone-500">
						Nv. {MUTAGEN_SLOT_UNLOCKS[group]}
					</span>
				{/if}
				{#if openPicker?.kind === 'mutagen' && openPicker.index === group}
					<div
						class="absolute top-full left-1/2 z-30 mt-3 w-60 -translate-x-1/2 rounded border border-stone-600 bg-stone-900 py-1 shadow-xl"
					>
						{#if mutagen}
							<button
								type="button"
								onclick={() => pickMutagen(group, null)}
								class="block w-full px-3 py-1.5 text-left text-sm text-stone-400 hover:bg-stone-800"
							>
								— remover —
							</button>
						{/if}
						{#each allMutagens as option (option.id)}
							<button
								type="button"
								onclick={() => pickMutagen(group, option.id)}
								class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-stone-100 hover:bg-stone-800"
							>
								<span class={['size-2.5 shrink-0 rotate-45 rounded-[2px]', mutagenBg[option.color]]}
								></span>
								{option.name}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Grupo de 3 slots de habilidade -->
			<div class="flex flex-col gap-2">
				{#each Array(SLOT_GROUP_SIZE), i (i)}
					{@const slotIndex = group * SLOT_GROUP_SIZE + i}
					{@const locked = slotIndex >= unlockedSkillSlots}
					{@const skill = skillsById.get(equipped[slotIndex] ?? '')}
					<div class="relative">
						<button
							type="button"
							disabled={locked}
							title={locked
								? `Slot ${slotIndex + 1} — libera no nível ${SKILL_SLOT_UNLOCK_LEVELS[slotIndex]}`
								: (skill?.name ?? `Slot ${slotIndex + 1} — vazio`)}
							onclick={() => togglePicker('slot', slotIndex)}
							class={[
								'relative flex size-14 items-center justify-center rounded border p-1 transition',
								skill
									? `bg-stone-800 ${skillBorder[skill.color]}`
									: 'border-stone-700 bg-stone-900/70',
								locked ? 'opacity-40' : 'hover:border-stone-300'
							]}
						>
							{#if locked}
								<span class="flex flex-col items-center gap-0.5 text-stone-500">
									{@render lockIcon()}
									<span class="text-[10px] leading-none"
										>Nv. {SKILL_SLOT_UNLOCK_LEVELS[slotIndex]}</span
									>
								</span>
							{:else if skill}
								<Icon category="skills" id={skill.id} alt={skill.name} size="fill" />
							{/if}
						</button>
						{#if openPicker?.kind === 'slot' && openPicker.index === slotIndex}
							<div
								class="absolute top-0 left-full z-30 ml-2 max-h-64 w-64 overflow-y-auto rounded border border-stone-600 bg-stone-900 py-1 shadow-xl"
							>
								{#if skill}
									<button
										type="button"
										onclick={() => pickSkill(slotIndex, null)}
										class="block w-full px-3 py-1.5 text-left text-sm text-stone-400 hover:bg-stone-800"
									>
										— remover —
									</button>
								{/if}
								{#if learnedSkills.length === 0}
									<p class="px-3 py-1.5 text-sm text-stone-500">Nenhuma habilidade aprendida.</p>
								{/if}
								{#each learnedSkills as option (option.id)}
									<button
										type="button"
										onclick={() => pickSkill(slotIndex, option.id)}
										class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-stone-100 hover:bg-stone-800"
									>
										<Icon category="skills" id={option.id} alt={option.name} size="sm" />
										<span class="truncate">{option.name}</span>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
