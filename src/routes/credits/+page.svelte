<section class="prose prose-invert max-w-2xl space-y-4">
	<h1 class="text-2xl font-bold">Créditos e fontes</h1>

	<p class="text-stone-400">
		Este é um projeto de fã, não oficial e sem fins lucrativos, feito sob a política de conteúdo
		de fãs da CD Projekt Red. Todos os nomes de itens, skills e mecânicas pertencem à CD Projekt
		Red / The Witcher 3: Wild Hunt.
	</p>

	<p class="text-stone-400">
		Os textos sobre skills, itens, conjuntos de equipamento e builds foram escritos com base em
		conhecimento público sobre o jogo e em guias da comunidade, incluindo a
		<a
			href="https://witcher.fandom.com/wiki/The_Witcher_3_abilities"
			target="_blank"
			rel="noopener noreferrer"
			class="text-red-500 hover:underline"
		>
			Witcher Wiki (Fandom)
		</a>
		, cujo conteúdo textual é licenciado sob
		<a
			href="https://www.fandom.com/licensing"
			target="_blank"
			rel="noopener noreferrer"
			class="text-red-500 hover:underline"
		>
			CC-BY-SA
		</a>.
	</p>

	<h2 class="text-lg font-semibold text-stone-100">Ícones</h2>
	<p class="text-stone-400">
		Este app não distribui ícones extraídos do jogo, por conta de direitos autorais. Se você quer
		ver ícones reais, pode extraí-los da sua própria cópia legítima do jogo e colocá-los na pasta
		<code>static/icons/</code> do projeto, seguindo a convenção de nomes descrita no arquivo
		<code>static/icons/README.md</code>. Sem isso, o app mostra um badge genérico com a inicial do
		nome no lugar do ícone.
	</p>
	<p class="text-stone-400">
		Isso é só para uso pessoal, na sua própria cópia do app rodando localmente — não redistribua os
		ícones extraídos publicamente (ex: não suba um build com eles para um repositório público ou
		site compartilhado), já que os arquivos do jogo são protegidos por direitos autorais da CD
		Projekt Red.
	</p>

	<h2 class="text-lg font-semibold text-stone-100">
		Tutorial: extraindo ícones com o WolvenKit
	</h2>
	<p class="text-stone-400">
		<strong class="text-amber-300">Atenção:</strong> o repositório principal
		<code>WolvenKit/WolvenKit</code> hoje é focado só em Cyberpunk 2077 (REDengine 4). Para o
		Witcher 3 (REDengine 3), existe um repositório separado, o
		<a
			href="https://github.com/WolvenKit/WolvenKit-7"
			target="_blank"
			rel="noopener noreferrer"
			class="text-red-500 hover:underline"
		>
			WolvenKit-7
		</a>
		— é esse que você precisa usar. Ele abre os arquivos empacotados do jogo
		(<code>.bundle</code>/<code>.archive</code>) e converte texturas para PNG. Você precisa da sua
		própria cópia legítima do jogo instalada (Steam, GOG, Epic).
	</p>
	<ol class="list-decimal space-y-3 pl-5 text-stone-400">
		<li>
			Baixe o WolvenKit-7 a partir das
			<a
				href="https://github.com/WolvenKit/WolvenKit-7/releases"
				target="_blank"
				rel="noopener noreferrer"
				class="text-red-500 hover:underline"
			>
				releases no GitHub
			</a>
			. O projeto recomenda usar a <strong>nightly build</strong> mais recente em vez da última
			release estável, por ter mais correções (inclusive para a versão Next-Gen do jogo). O
			WolvenKit não roda nativamente em Linux/macOS — se você estiver no WSL/Linux, rode-o em uma
			máquina/VM Windows.
		</li>
		<li>
			Abra o WolvenKit App e crie um novo projeto. Aponte a configuração de "Game Executable" para
			o executável do Witcher 3 (na versão Next-Gen, tanto <code>bin\x64\witcher3.exe</code> (DX11)
			quanto <code>bin\x64_dx12\witcher3.exe</code> (DX12) devem funcionar — se um dos dois não
			validar, tente o outro).
		</li>
		<li>
			Na aba de gerenciamento de arquivos do jogo, use a busca para localizar os arquivos de
			textura de ícones de inventário — normalmente ficam sob caminhos como
			<code>base\gameplay\gui\common\icons\</code> ou <code>base\characters\...\icons\</code>
			dentro do arquivo empacotado, com extensão <code>.xbm</code>. Os nomes de pasta podem variar
			um pouco entre versão base e Next-Gen; use a busca por texto (ex: "icon", "igni", "skill")
			para achar mais rápido.
		</li>
		<li>
			Clique com o botão direito no arquivo <code>.xbm</code> desejado e escolha a opção de
			exportar/converter para <code>.png</code> (no WolvenKit isso costuma aparecer como "Export"
			ou "Uncook"). Repita para cada ícone de skill/item que você quiser.
		</li>
		<li>
			Renomeie cada PNG exportado para bater com o <code>id</code> correspondente nos arquivos de
			dados deste projeto (<code>src/lib/data/skills.json</code>, <code>gearSets.json</code>,
			<code>mutations.json</code>, etc. — o campo <code>id</code> de cada entrada é o nome de
			arquivo esperado, ex: <code>igni-melt-armor.png</code>).
		</li>
		<li>
			Copie os arquivos renomeados para a pasta correta dentro de
			<code>static/icons/</code> deste projeto: skills em <code>static/icons/skills/</code>, itens
			(gear/runas/glifos/óleos/poções/decocções/mutagênicos) em
			<code>static/icons/items/</code>, e mutações de Blood and Wine em
			<code>static/icons/mutations/</code>.
		</li>
		<li>
			Rode <code>npm run dev</code> novamente (ou apenas dê refresh se já estiver rodando) — o
			componente de ícone do app detecta o arquivo automaticamente pelo nome, sem precisar mexer em
			nenhum código.
		</li>
	</ol>
	<p class="text-sm text-stone-500">
		Limitações conhecidas do WolvenKit-7 na versão Next-Gen: conversão de áudio
		(<code>.wem</code>) não funciona e pode haver problemas ao importar texturas de DLC — isso não
		deve afetar a extração de ícones de skills/itens do jogo base.
	</p>
</section>
