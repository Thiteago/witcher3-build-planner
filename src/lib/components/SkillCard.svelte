<script lang="ts">
	import Icon from './Icon.svelte';
	import type { Skill } from '../types';

	let { skill }: { skill: Skill } = $props();

	const colorClasses: Record<Skill['color'], string> = {
		red: 'border-red-800/60 bg-red-950/20',
		blue: 'border-blue-800/60 bg-blue-950/20',
		green: 'border-green-800/60 bg-green-950/20',
		none: 'border-stone-700 bg-stone-800/40'
	};
</script>

<div class={['flex gap-3 rounded-lg border p-3', colorClasses[skill.color]]}>
	<Icon category="skills" id={skill.id} alt={skill.name} />
	<div class="min-w-0">
		<h3 class="font-semibold text-stone-100">{skill.name}</h3>
		<p class="text-sm text-stone-400">{skill.description}</p>
		{#if skill.requiresDLC}
			<span class="mt-1 inline-block rounded bg-amber-900/50 px-2 py-0.5 text-xs text-amber-300">
				Blood and Wine
			</span>
		{/if}
	</div>
</div>
