# The Witcher 3 Build Planner

SPA em SvelteKit (Svelte 5 runes) para planejar builds do Witcher 3 **Next-Gen
(patch 4.0+)**, em PT-BR. Deploy estático (Vercel). Builds customizadas ficam
no localStorage (`src/lib/storage.ts` + `src/lib/stores/customBuilds.svelte.ts`).

## Comandos

- `npm run dev` / `npm run build` / `npm run check` (svelte-check) / `npm run lint`

## Fonte da verdade dos dados de jogo

**Não use wikis/guia de memória para dados de skills — já temos os dados
oficiais extraídos do jogo** em `game_data/`:

- `game_data/skills_official.json` — as 80 habilidades reais (id interno do
  jogo, árvore, coluna, tier, maxRank, nomes oficiais EN e PT-BR, DLC), mais
  slots, mutagênios e as 12 mutações do B&W com custos/pré-requisitos.
- `GAME_DATA_VALIDATION.md` — relatório do cruzamento app × jogo e o que ainda
  falta corrigir no app (refactor do modelo de slots, skills faltantes etc.).
- `game_data/*.xml` — XMLs crus extraídos dos bundles (UTF-8, convertidos).
- `DADOS_PENDENTES.md` — o que resta é decisão de produto, não pesquisa.

Regras do jogo já confirmadas (não re-pesquisar): tiers desbloqueiam com
0/6/12/18 pontos gastos na mesma árvore; 1 ponto de habilidade por nível a
partir do nível 2; 12 slots de skill num pool único (grupos de 3 compartilham
1 mutagênio) nos níveis 1,2,4,6,8,10,12,15,18,22,26,30 + 4 slots extras via
mutações (2/4/8/12 pesquisadas); slots de mutagênio nos níveis 2/9/16/28;
skills Gerais são todas tier 1 / ranque 1.

## Como re-extrair dados do jogo (se sair patch)

Instalação do jogo (Steam, via WSL):
`/mnt/f/SteamLibrary/steamapps/common/The Witcher 3`

- **Scripts do jogo** (lógica, .ws): texto plano (UTF-16) em
  `content/content0/scripts/` — dá pra ler direto, sem ferramenta.
- **XMLs de gameplay**: dentro de `content/content0/bundles/xml.bundle` e dos
  `blob.bundle` dos DLCs (`DLC/ep1`, `DLC/bob`). Formato de bundle: magic
  `POTATO70`, header em `u32@16`, entradas de 0x140 bytes (path 0x100 bytes,
  `size/zsize/offset` em u32 @+0x114, compressão u32 @+0x13C: 0=none, 1=zlib).
  Há um extrator pronto embutido no histórico e a lógica em
  `game_data/tools/`. Alternativa GUI: WolvenKit 7 (marcar arquivo → "Add
  marked files to mod" → sai em `<projeto>/files/Mod/...`).
- **Localização**: `content/content0/{en,br}.w3strings` — decodificar com
  `game_data/tools/w3strings_decode.py` (suporta versão 162/163; strings
  XOR-cifradas com chave por idioma; `br` do next-gen vem em claro). O hash
  que liga a chave textual (`skill_name_*`) ao id numérico é desconhecido —
  o mapeamento foi feito por clusters de ids (nomes de skills ≈ 1066820-1066909,
  perks de DLC ≈ 1129065-1129126, mutações ≈ 1188298-1188320) e casando
  stats das abilities com as descrições.
- `game_data/tools/build_official.py` regenera o `skills_official.json`
  (contém o mapeamento id-interno → str_id validado).

## Armadilhas conhecidas

- Os XMLs do jogo são UTF-16; converta antes de grep (`iconv -f UTF-16 -t UTF-8`).
- Comentários nos XMLs usam nomes de desenvolvimento desatualizados (ex.:
  "Fiery Dancer" para Muscle Memory) — nunca confiar neles, só nos stats.
- A tradução PT-BR oficial tem nomes contraintuitivos porém corretos
  (Protective Coating = "Aterrorizar", Whirl = "Espira") — confirmado no jogo.
- Skills cortadas existem nas strings mas não na árvore: Volley, Aegis,
  Druid Techniques, Predatory Instinct.
- Remover/renomear ids em `skills.json` quebra builds salvas no localStorage —
  há um seam de migração por `schemaVersion` em `src/lib/storage.ts` (v2→v3 já
  implementada); bump `CUSTOM_BUILD_SCHEMA_VERSION` e adicione um passo lá.
- O planner modela o sistema real: 12 slots genéricos em 4 grupos de 3, cada
  grupo pareado com 1 slot de mutagênico; skills têm `gameId` ligando ao id
  interno do jogo.
