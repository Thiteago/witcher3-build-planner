<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();

	const links = [
		{ href: '/', label: 'Início' },
		{ href: '/skills', label: 'Habilidades' },
		{ href: '/items', label: 'Itens' },
		{ href: '/builds', label: 'Builds' },
		{ href: '/planner', label: 'Meus Builds' },
		{ href: '/credits', label: 'Créditos' }
	];
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-stone-950 text-stone-100">
	<header class="border-b border-stone-800 bg-stone-900/60">
		<nav class="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
			<a href="/" class="mr-2 font-bold tracking-wide text-red-600">Witcher 3 Build Planner</a>
			{#each links as link (link.href)}
				{@const active =
					link.href === '/'
						? page.url.pathname === '/'
						: page.url.pathname.startsWith(link.href)}
				<a
					href={link.href}
					class={['text-sm transition', active ? 'text-red-500' : 'text-stone-400 hover:text-stone-100']}
				>
					{link.label}
				</a>
			{/each}
		</nav>
	</header>
	<main class="mx-auto max-w-5xl px-4 py-6">
		{@render children()}
	</main>
</div>
