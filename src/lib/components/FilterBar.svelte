<script lang="ts">
	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		label: string;
		options: Option[];
		selected: string[];
	}

	let { label, options, selected = $bindable() }: Props = $props();

	function toggle(value: string) {
		selected = selected.includes(value)
			? selected.filter((v) => v !== value)
			: [...selected, value];
	}
</script>

<div>
	<span class="text-sm font-semibold tracking-wide text-stone-400 uppercase">{label}</span>
	<div class="mt-1.5 flex flex-wrap gap-2">
		{#each options as opt (opt.value)}
			<button
				type="button"
				onclick={() => toggle(opt.value)}
				class={[
					'rounded-full border px-3 py-1 text-sm transition',
					selected.includes(opt.value)
						? 'border-red-600 bg-red-700 text-white'
						: 'border-stone-700 bg-stone-800 text-stone-300 hover:border-stone-500'
				]}
			>
				{opt.label}
			</button>
		{/each}
	</div>
</div>
