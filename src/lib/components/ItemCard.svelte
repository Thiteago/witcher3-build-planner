<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		id: string;
		name: string;
		description: string;
		requiresDLC?: 'blood-and-wine';
		badge?: string;
	}

	let { id, name, description, requiresDLC, badge }: Props = $props();
</script>

<div class="flex gap-3 rounded-lg border border-stone-700 bg-stone-800/40 p-3">
	<Icon category="items" {id} alt={name} />
	<div class="min-w-0">
		<div class="flex flex-wrap items-center gap-2">
			<h3 class="font-semibold text-stone-100">{name}</h3>
			{#if badge}
				<span class="rounded bg-stone-700 px-2 py-0.5 text-xs text-stone-300">{badge}</span>
			{/if}
		</div>
		<p class="text-sm text-stone-400">{description}</p>
		{#if requiresDLC}
			<span class="mt-1 inline-block rounded bg-amber-900/50 px-2 py-0.5 text-xs text-amber-300">
				Blood and Wine
			</span>
		{/if}
	</div>
</div>
