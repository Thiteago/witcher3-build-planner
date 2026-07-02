<script lang="ts">
	import gearSetsData from '$lib/data/gearSets.json';
	import runesData from '$lib/data/runes.json';
	import glyphsData from '$lib/data/glyphs.json';
	import oilsData from '$lib/data/oils.json';
	import potionsData from '$lib/data/potions.json';
	import decoctionsData from '$lib/data/decoctions.json';
	import mutagensData from '$lib/data/mutagens.json';
	import type { GearSet, GenericItem, Mutagen } from '$lib/types';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import { matchesSearch } from '$lib/utils/filter';

	const gearSets = gearSetsData as GearSet[];
	const runes = runesData as GenericItem[];
	const glyphs = glyphsData as GenericItem[];
	const oils = oilsData as GenericItem[];
	const potions = potionsData as GenericItem[];
	const decoctions = decoctionsData as GenericItem[];
	const mutagens = mutagensData as Mutagen[];

	const tabs = [
		{ id: 'gear', label: 'Conjuntos de equipamento' },
		{ id: 'runes', label: 'Runas' },
		{ id: 'glyphs', label: 'Glifos' },
		{ id: 'oils', label: 'Óleos' },
		{ id: 'potions', label: 'Poções' },
		{ id: 'decoctions', label: 'Decocções' },
		{ id: 'mutagens', label: 'Mutagênicos' }
	] as const;

	let activeTab = $state<(typeof tabs)[number]['id']>('gear');
	let search = $state('');
</script>

<section class="space-y-4">
	<h1 class="text-2xl font-bold">Itens</h1>

	<div class="flex flex-wrap gap-2">
		{#each tabs as tab (tab.id)}
			<button
				type="button"
				onclick={() => (activeTab = tab.id)}
				class={[
					'rounded-full border px-3 py-1 text-sm transition',
					activeTab === tab.id
						? 'border-red-600 bg-red-700 text-white'
						: 'border-stone-700 bg-stone-800 text-stone-300 hover:border-stone-500'
				]}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<input
		type="search"
		placeholder="Buscar..."
		bind:value={search}
		class="w-full rounded border border-stone-700 bg-stone-800 px-3 py-1.5 text-sm text-stone-100 sm:w-64"
	/>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		{#if activeTab === 'gear'}
			{#each gearSets.filter((g) => matchesSearch(g.name + ' ' + g.playstyle, search)) as set (set.id)}
				<ItemCard
					id={set.id}
					name={set.name}
					description={set.playstyle}
					requiresDLC={set.requiresDLC}
					badge={set.tiers[set.tiers.length - 1]?.name}
				/>
			{/each}
		{:else if activeTab === 'runes'}
			{#each runes.filter((i) => matchesSearch(i.name + ' ' + i.effect, search)) as item (item.id)}
				<ItemCard id={item.id} name={item.name} description={item.effect} requiresDLC={item.requiresDLC} />
			{/each}
		{:else if activeTab === 'glyphs'}
			{#each glyphs.filter((i) => matchesSearch(i.name + ' ' + i.effect, search)) as item (item.id)}
				<ItemCard id={item.id} name={item.name} description={item.effect} requiresDLC={item.requiresDLC} />
			{/each}
		{:else if activeTab === 'oils'}
			{#each oils.filter((i) => matchesSearch(i.name + ' ' + i.effect, search)) as item (item.id)}
				<ItemCard id={item.id} name={item.name} description={item.effect} requiresDLC={item.requiresDLC} />
			{/each}
		{:else if activeTab === 'potions'}
			{#each potions.filter((i) => matchesSearch(i.name + ' ' + i.effect, search)) as item (item.id)}
				<ItemCard id={item.id} name={item.name} description={item.effect} requiresDLC={item.requiresDLC} />
			{/each}
		{:else if activeTab === 'decoctions'}
			{#each decoctions.filter((i) => matchesSearch(i.name + ' ' + i.effect, search)) as item (item.id)}
				<ItemCard id={item.id} name={item.name} description={item.effect} requiresDLC={item.requiresDLC} />
			{/each}
		{:else if activeTab === 'mutagens'}
			{#each mutagens.filter((i) => matchesSearch(i.name + ' ' + i.effect, search)) as item (item.id)}
				<ItemCard id={item.id} name={item.name} description={item.effect} badge={item.rarity} />
			{/each}
		{/if}
	</div>
</section>
