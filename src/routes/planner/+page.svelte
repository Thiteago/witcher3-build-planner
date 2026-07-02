<script lang="ts">
	import { goto } from '$app/navigation';
	import { customBuilds } from '$lib/stores/customBuilds.svelte';

	let newName = $state('');

	function createBuild() {
		const name = newName.trim() || 'Nova build';
		const build = customBuilds.create(name);
		newName = '';
		goto(`/planner/${build.id}`);
	}

	function rename(id: string, currentName: string) {
		const name = prompt('Novo nome da build:', currentName);
		if (name && name.trim()) customBuilds.update(id, { name: name.trim() });
	}

	function remove(id: string) {
		if (confirm('Excluir essa build? Essa ação não pode ser desfeita.')) {
			customBuilds.remove(id);
		}
	}
</script>

<section class="space-y-4">
	<h1 class="text-2xl font-bold">Meus Builds</h1>
	<p class="text-sm text-stone-500">
		Salvos apenas no seu navegador (localStorage) — não são enviados para nenhum servidor.
	</p>

	<div class="flex gap-2">
		<input
			type="text"
			placeholder="Nome da nova build"
			bind:value={newName}
			onkeydown={(e) => e.key === 'Enter' && createBuild()}
			class="w-full max-w-xs rounded border border-stone-700 bg-stone-800 px-3 py-1.5 text-sm text-stone-100"
		/>
		<button
			type="button"
			onclick={createBuild}
			class="rounded bg-red-700 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-red-600"
		>
			Nova build
		</button>
	</div>

	{#if customBuilds.all.length === 0}
		<p class="text-stone-400">Nenhuma build salva ainda. Crie uma acima ou copie um build recomendado.</p>
	{:else}
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
			{#each customBuilds.all as build (build.id)}
				<div class="rounded-lg border border-stone-700 bg-stone-800/40 p-4">
					<div class="flex items-start justify-between gap-2">
						<a href={`/planner/${build.id}`} class="font-semibold text-stone-100 hover:text-red-500">
							{build.name}
						</a>
						<span class="text-xs text-stone-500">Nível {build.level}</span>
					</div>
					<p class="mt-1 text-xs text-stone-500">
						Atualizado em {new Date(build.updatedAt).toLocaleString('pt-BR')}
					</p>
					<div class="mt-3 flex flex-wrap gap-2 text-sm">
						<a href={`/planner/${build.id}`} class="text-red-500 hover:underline">Editar</a>
						<button
							type="button"
							onclick={() => rename(build.id, build.name)}
							class="text-stone-400 hover:underline"
						>
							Renomear
						</button>
						<button
							type="button"
							onclick={() => customBuilds.duplicate(build.id)}
							class="text-stone-400 hover:underline"
						>
							Duplicar
						</button>
						<button
							type="button"
							onclick={() => remove(build.id)}
							class="text-red-500/80 hover:underline"
						>
							Excluir
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
