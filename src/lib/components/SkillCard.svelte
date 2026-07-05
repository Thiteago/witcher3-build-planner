<script lang="ts">
	import Icon from './Icon.svelte';
	import type { Skill } from '../types';

	let { skill }: { skill: Skill } = $props();

	// Cores baseadas nas abas do menu de habilidades do jogo: Combate (vermelho),
	// Signos (azul), Alquimia (verde) e Geral (dourado/marrom).
	const colorClasses: Record<Skill['color'], string> = {
		red: 'border-red-800/60 border-l-4 border-l-red-600 bg-red-950/20',
		blue: 'border-blue-800/60 border-l-4 border-l-blue-500 bg-blue-950/20',
		green: 'border-green-800/60 border-l-4 border-l-green-500 bg-green-950/20',
		none: 'border-amber-800/60 border-l-4 border-l-amber-600 bg-amber-950/20'
	};
</script>

<div class={['flex gap-3 rounded-lg border p-3', colorClasses[skill.color]]}>
	<Icon category="skills" id={skill.id} alt={skill.name} />
	<div class="min-w-0">
		<div class="flex flex-wrap items-center gap-2">
			<h3 class="font-semibold text-stone-100">{skill.name}</h3>
			<span class="rounded bg-stone-700/60 px-1.5 py-0.5 text-xs text-stone-300">
				Tier {skill.tier} · {skill.maxRank}x
			</span>
		</div>
		<p class="text-sm text-stone-400">{skill.description}</p>
		{#if skill.requiresDLC}
			<span class="mt-1 inline-block rounded bg-amber-900/50 px-2 py-0.5 text-xs text-amber-300">
				{skill.requiresDLC === 'blood-and-wine' ? 'Blood and Wine' : 'Hearts of Stone'}
			</span>
		{/if}
	</div>
</div>
