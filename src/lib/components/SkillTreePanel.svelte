<script lang="ts">
	import type { Skill, SkillCategory, SkillTier } from '../types';
	import { TIER_POINT_THRESHOLDS, tierUnlockedByPoints } from '../data/slotProgression';
	import { skillCategoryLabel } from '../labels';
	import Icon from './Icon.svelte';

	interface Props {
		skills: Skill[];
		/** Rank investido por skill id (ausente = 0). */
		ranks: Record<string, number>;
		/** Sem handler o painel é somente leitura (ex.: página de builds curadas). */
		onRankChange?: (skill: Skill, delta: 1 | -1) => void;
		canIncrement?: (skill: Skill) => boolean;
		/** Quando presente, mostra a caixa "Pontos disponíveis" como no jogo. */
		availablePoints?: number;
	}

	let { skills, ranks, onRankChange, canIncrement, availablePoints }: Props = $props();

	const TIERS: SkillTier[] = [1, 2, 3, 4];

	// Ordem das colunas de cada árvore, como na tela de personagem do jogo.
	const COLUMN_ORDER: Record<Exclude<SkillCategory, 'general'>, string[]> = {
		combat: [
			'Sword_StyleFast',
			'Sword_StyleStrong',
			'Sword_Utility',
			'Sword_Crossbow',
			'Sword_BattleTrance'
		],
		signs: ['Signs_Aard', 'Signs_Igni', 'Signs_Yrden', 'Signs_Quen', 'Signs_Axi'],
		alchemy: [
			'Alchemy_Potions',
			'Alchemy_Oils',
			'Alchemy_Bombs',
			'Alchemy_Mutagens',
			'Alchemy_Grasses'
		]
	};

	const TREE_STYLE: Record<
		SkillCategory,
		{ chip: string; header: string; tile: string; ring: string }
	> = {
		combat: {
			chip: 'bg-red-700',
			header: 'from-red-900/90 to-red-950/40 border-red-800',
			tile: 'from-red-700/90 to-red-950 border-red-500/60',
			ring: 'outline-red-500'
		},
		signs: {
			chip: 'bg-blue-700',
			header: 'from-blue-900/90 to-blue-950/40 border-blue-800',
			tile: 'from-blue-700/90 to-blue-950 border-blue-400/60',
			ring: 'outline-blue-400'
		},
		alchemy: {
			chip: 'bg-green-700',
			header: 'from-green-900/90 to-green-950/40 border-green-800',
			tile: 'from-green-700/90 to-green-950 border-green-500/60',
			ring: 'outline-green-500'
		},
		general: {
			chip: 'bg-amber-700',
			header: 'from-amber-900/80 to-amber-950/40 border-amber-800',
			tile: 'from-amber-700/90 to-amber-950 border-amber-500/60',
			ring: 'outline-amber-500'
		}
	};

	const CATEGORIES: SkillCategory[] = ['combat', 'signs', 'alchemy', 'general'];

	// Abre na árvore com mais pontos investidos (empate favorece a ordem do jogo).
	function initialCategory(): SkillCategory {
		const spent = { combat: 0, signs: 0, alchemy: 0, general: 0 };
		for (const s of skills) spent[s.category] += ranks[s.id] ?? 0;
		return CATEGORIES.reduce((best, cat) => (spent[cat] > spent[best] ? cat : best), 'combat');
	}

	let active = $state<SkillCategory>(initialCategory());
	let interactive = $derived(!!onRankChange);

	let rankOf = $derived((id: string) => ranks[id] ?? 0);

	let spentByCategory = $derived(
		skills.reduce(
			(acc, s) => {
				acc[s.category] += ranks[s.id] ?? 0;
				return acc;
			},
			{ combat: 0, signs: 0, alchemy: 0, general: 0 } as Record<SkillCategory, number>
		)
	);

	/** Linhas da grade da árvore ativa: 4 tiers × 5 colunas (ou 4 fileiras de perks na Geral). */
	let rows = $derived.by((): { tier: SkillTier | null; cells: (Skill | null)[] }[] => {
		if (active === 'general') {
			const base = COLUMN_ORDER.combat.map((_, i) =>
				skills.filter((s) => s.category === 'general' && s.column === `Perks_col${i + 1}`)
			);
			const baseRows = [0, 1].map((r) => ({
				tier: null,
				cells: base.map((col) => col[r] ?? null)
			}));
			const dlc = skills.filter((s) => s.category === 'general' && s.column === 'Perks');
			const dlcRows = [];
			for (let i = 0; i < dlc.length; i += 5) {
				const chunk: (Skill | null)[] = dlc.slice(i, i + 5);
				while (chunk.length < 5) chunk.push(null);
				dlcRows.push({ tier: null, cells: chunk });
			}
			return [...baseRows, ...dlcRows];
		}
		const columns = COLUMN_ORDER[active];
		return TIERS.map((tier) => ({
			tier,
			cells: columns.map(
				(col) =>
					skills.find((s) => s.category === active && s.column === col && s.tier === tier) ?? null
			)
		}));
	});

	let unlockedTier = $derived(tierUnlockedByPoints(spentByCategory[active]));

	function tileTitle(skill: Skill): string {
		const dlc = skill.requiresDLC
			? skill.requiresDLC === 'blood-and-wine'
				? ' · Blood and Wine'
				: ' · Hearts of Stone'
			: '';
		return `${skill.name} — tier ${skill.tier} · ranque ${rankOf(skill.id)}/${skill.maxRank}${dlc}\n${skill.description}`;
	}

	function handleClick(skill: Skill) {
		if (!interactive) return;
		if (canIncrement && !canIncrement(skill)) return;
		onRankChange?.(skill, 1);
	}

	function handleContextMenu(event: MouseEvent, skill: Skill) {
		if (!interactive) return;
		event.preventDefault();
		if (rankOf(skill.id) > 0) onRankChange?.(skill, -1);
	}
</script>

<div class="rounded-lg border border-stone-800 bg-stone-900/30">
	<!-- Abas das árvores, com contador de pontos gastos como no jogo -->
	<div class="flex gap-1 border-b border-stone-800 px-2 pt-2" role="tablist">
		{#each CATEGORIES as cat (cat)}
			<button
				type="button"
				role="tab"
				aria-selected={active === cat}
				onclick={() => (active = cat)}
				class={[
					'flex min-w-16 flex-col items-center gap-1 rounded-t border-x border-t px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition',
					active === cat
						? 'border-stone-500 bg-stone-800 text-stone-100'
						: 'border-transparent text-stone-400 hover:text-stone-200'
				]}
			>
				<span>{skillCategoryLabel[cat]}</span>
				<span
					class={['min-w-8 rounded px-1 text-center text-[11px] text-white', TREE_STYLE[cat].chip]}
				>
					{spentByCategory[cat]}
				</span>
			</button>
		{/each}
	</div>

	<!-- Cabeçalho da árvore ativa -->
	<div
		class={[
			'flex items-center justify-between border-b bg-gradient-to-r px-4 py-2',
			TREE_STYLE[active].header
		]}
	>
		<span class="font-bold tracking-widest text-stone-100 uppercase">
			{skillCategoryLabel[active]}
		</span>
		<span class="text-sm tracking-wide text-stone-300 uppercase">
			Pontos gastos: <span class="font-semibold text-stone-100">{spentByCategory[active]}</span>
		</span>
	</div>

	<!-- Grade de habilidades -->
	<div class="p-3 sm:p-4">
		<div class="space-y-2">
			{#each rows as row, rowIndex (rowIndex)}
				{@const tierLocked = row.tier !== null && row.tier > unlockedTier}
				<div class="flex items-center gap-2">
					<div class="grid flex-1 grid-cols-5 gap-2">
						{#each row.cells as skill, cellIndex (skill?.id ?? `empty-${rowIndex}-${cellIndex}`)}
							{#if skill}
								{@const rank = rankOf(skill.id)}
								{@const blocked =
									tierLocked || (interactive && canIncrement && !canIncrement(skill))}
								<button
									type="button"
									title={tileTitle(skill)}
									aria-label={`${skill.name} — ranque ${rank}/${skill.maxRank}`}
									onclick={() => handleClick(skill)}
									oncontextmenu={(e) => handleContextMenu(e, skill)}
									class={[
										'relative aspect-square rounded border p-1 transition select-none',
										rank > 0
											? `bg-gradient-to-b ${TREE_STYLE[active].tile}`
											: tierLocked
												? 'border-stone-800/80 bg-stone-950/60 opacity-40'
												: 'border-stone-700 bg-stone-900/80',
										interactive &&
											!blocked &&
											'hover:outline-2 hover:outline-offset-1 ' + TREE_STYLE[active].ring,
										interactive && blocked && rank === 0 && 'cursor-not-allowed',
										!interactive && 'cursor-default'
									]}
								>
									<Icon category="skills" id={skill.id} alt={skill.name} size="fill" />
									{#if rank > 0}
										<span
											class="absolute right-0 bottom-0 rounded-tl bg-black/80 px-1 text-[11px] leading-4 font-semibold text-white"
										>
											{rank}{#if rank < skill.maxRank}<span class="text-stone-400"
													>/{skill.maxRank}</span
												>{/if}
										</span>
									{/if}
									{#if skill.requiresDLC && rank === 0}
										<span
											class="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-amber-500/80"
											title={skill.requiresDLC === 'blood-and-wine'
												? 'Blood and Wine'
												: 'Hearts of Stone'}
										></span>
									{/if}
								</button>
							{:else}
								<div class="aspect-square"></div>
							{/if}
						{/each}
					</div>
					<!-- Cadeado de tier na borda direita, como no jogo -->
					<div class="flex w-8 shrink-0 flex-col items-center text-stone-500">
						{#if tierLocked && row.tier !== null}
							<svg viewBox="0 0 24 24" class="size-4 fill-current" aria-hidden="true">
								<path d="M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2Zm-8-2a3 3 0 0 1 6 0v2H9V7Z" />
							</svg>
							<span class="text-xs font-semibold">{TIER_POINT_THRESHOLDS[row.tier]}</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		{#if interactive}
			<p class="mt-3 text-xs text-stone-500">
				Clique: +1 ranque · clique direito: −1 · tiers abrem com
				{TIER_POINT_THRESHOLDS[2]}/{TIER_POINT_THRESHOLDS[3]}/{TIER_POINT_THRESHOLDS[4]} pontos na árvore
			</p>
		{/if}

		{#if availablePoints !== undefined}
			<div
				class="mx-auto mt-4 max-w-60 rounded border border-stone-700 bg-stone-900/80 px-4 py-2 text-center"
			>
				<p class="text-xs font-semibold tracking-widest text-stone-400 uppercase">
					Pontos disponíveis
				</p>
				<p class="text-3xl font-bold text-stone-100">{availablePoints}</p>
			</div>
		{/if}
	</div>
</div>
