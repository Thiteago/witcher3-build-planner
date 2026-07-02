<script lang="ts">
	import { page } from '$app/state';
	import { customBuilds } from '$lib/stores/customBuilds.svelte';
	import SlotGrid from '$lib/components/SlotGrid.svelte';
	import type { CustomBuild } from '$lib/types';

	let build = $derived(customBuilds.get(page.params.buildId ?? ''));

	function onUpdate(patch: Partial<CustomBuild>) {
		if (build) customBuilds.update(build.id, patch);
	}
</script>

{#if !build}
	<p class="text-stone-400">
		Build não encontrada. <a href="/planner" class="text-red-500 hover:underline">Voltar para Meus Builds</a>.
	</p>
{:else}
	<section class="space-y-6">
		<div>
			<a href="/planner" class="text-sm text-stone-500 hover:underline">← Meus Builds</a>
			<h1 class="mt-1 text-2xl font-bold">{build.name}</h1>
			<p class="text-sm text-stone-500">Alterações são salvas automaticamente no seu navegador.</p>
		</div>

		<SlotGrid {build} {onUpdate} />
	</section>
{/if}
