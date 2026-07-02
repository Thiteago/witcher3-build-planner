<script lang="ts">
	interface Props {
		category: 'skills' | 'items' | 'mutations';
		id: string;
		alt: string;
		size?: 'sm' | 'md' | 'lg';
	}

	let { category, id, alt, size = 'md' }: Props = $props();
	let errored = $state(false);

	const sizeClasses = {
		sm: 'w-8 h-8 text-xs',
		md: 'w-10 h-10 text-sm',
		lg: 'w-16 h-16 text-lg'
	};
</script>

{#if errored}
	<div
		class="flex shrink-0 items-center justify-center rounded bg-stone-700 font-semibold text-stone-200 {sizeClasses[
			size
		]}"
		title={alt}
	>
		{alt.charAt(0).toUpperCase()}
	</div>
{:else}
	<img
		src={`/icons/${category}/${id}.png`}
		alt={alt}
		title={alt}
		class="shrink-0 rounded object-contain {sizeClasses[size]}"
		loading="lazy"
		onerror={() => (errored = true)}
	/>
{/if}
