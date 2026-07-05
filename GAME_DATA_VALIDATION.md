# Validação contra os dados oficiais do jogo (Next-Gen)

Fonte da verdade: arquivos extraídos da instalação Steam do Witcher 3 Next-Gen
(jul/2026), agora em `game_data/`:

- `geralt_skills.xml` — seção `<custom><skills>` com **tier** (`requiredPointsSpent`
  0/6/12/18), **ranque máximo** (`maxLevel`), árvore e coluna de cada habilidade;
  seções `<skill_slots>` e `<mutagen_slots>` com os níveis de desbloqueio.
- `geralt_levelups.xml` — XP e pontos de habilidade por nível.
- `geralt_skills_ep1.xml` / `geralt_skills_ep2.xml` — perks Gerais adicionados
  por Hearts of Stone e Blood and Wine (extraídos direto dos bundles dos DLCs).
- `geralt_mutations.xml` — sistema de mutações do B&W (custos, pré-requisitos,
  thresholds dos slots extras).
- Nomes oficiais EN/PT-BR decodificados de `en.w3strings` / `br.w3strings`.

O resultado consolidado e legível por máquina está em
**`game_data/skills_official.json`** (80 habilidades: 20 Combate, 20 Signos,
20 Alquimia, 20 Geral incluindo 10 de DLC — mais as 12 mutações do B&W).

A identificação id-interno → nome foi feita casando os modificadores de stats de
cada ability com as descrições oficiais, e é auto-validada por vários pontos
distintivos (Glifos Sustentados é a única de Yrden com maxLevel 2; Golpes
Esmagadores é Strong tier 2, como você confirmou no jogo; os ícones dos perks de
DLC nomeiam o perk; etc.).

## Confirmações estruturais (tudo bateu ou foi corrigido)

| Item | Jogo (oficial) | App antes | Status |
|---|---|---|---|
| Limiares de tier | 0 / 6 / 12 / 18 pontos na árvore | igual | ✅ já estava certo |
| Pontos por nível | 1/nível a partir do nível 2 (nível 1 = 0) | igual | ✅ já estava certo |
| Slots de skill | **pool único de 12 slots genéricos**, 4 grupos de 3 (mutagênio por grupo), níveis 1,2,4,6,8,10,12,15,18,22,26,30 | 3 slots *por cor*, níveis chutados | ⚠️ níveis corrigidos; **modelo por-cor continua errado** (ver "Pendências") |
| Slots extras 13–16 | desbloqueados por mutações pesquisadas (B&W), não por nível | modelado via `MUTATION_SLOT_UNLOCKS_BY_RESEARCHED_COUNT` | ✅ |
| Slots de mutagênio | níveis **2**, 9, 16, 28 | 3, 9, 16, 28 | ✅ corrigido (era 2, não 3 nem 4) |
| Slots extras por mutações | 2 / 4 / 8 / 12 pesquisadas | igual | ✅ confirmado no XML do DLC |
| Mutações (B&W) | têm cadeia de pré-requisitos (ex.: mutation1 requer mutation6) e custos em pontos de mutagênio R/G/B + skill points | não modelado | ℹ️ dados agora em `skills_official.json` |
| Skills Gerais | **todas** tier 1, custo 1, ranque máximo 1 (20 no total: 10 base + 5 HoS + 5 B&W) | várias com maxRank 3 | ✅ corrigido nas existentes |

## Correções aplicadas em `skills.json` (tier / maxRank)

| Skill (app) | Nome oficial (EN / BR) | Antes | Jogo |
|---|---|---|---|
| precise-blows | Precise Blows / Golpes Precisos | T1 | **T2** |
| crippling-strikes | Crippling Strikes / Golpes Paralisantes | T1 | **T4** |
| sunder-armor | Sunder Armor / Romper Armadura | T1 | **T4** |
| counterattack | Counterattack / Contra-ataque | T2 | **T3** |
| flood-of-anger | Flood of Anger / Enxurrada de Fúria | T2 | **T4** |
| undying | Undying / Imortal | T4, max 1 | **T2, max 3** |
| deadly-precision | Deadly Precision / Precisão Letal | max 1 | **max 2** |
| igni-melt-armor | Melt Armor / Derreter Armadura | T4 | **T1** |
| pyromaniac | Pyromaniac / Piromaníaco | T3 | **T4** |
| heightened-tolerance | Heightened Tolerance / Tolerância Aumentada | T3 | **T1** |
| refreshment | Refreshment / Refresco | T1 | **T2** |
| tissue-transmutation | Tissue Transmutation / Transmutação de Tecido | T4 | **T2** |
| fixative | Fixative / Solidificador | T2, max 1 | **T3, max 3** |
| cluster-bombs | Cluster Bombs / Bombas Enxame | T3 | **T4** |
| efficiency | Efficiency / Eficiência | T2 | **T3** |
| cat/griffin/ursine-school-techniques | Técnicas da Escola... | max 3 | **max 1** |
| steady-shot | Steady Shot / Olhos de Águia | max 3 | **max 1** |

Já estavam corretos: muscle-memory, crushing-blows, whirl (max 3 confirmado —
a dúvida "whirl/rend rank 1?" está resolvida, ambos têm 3 ranques no Next-Gen),
rend, resolve, razor-focus, aard-sweep, aard-intensity, delusion,
exploding-shield, active-shield, sustained-glyphs (T1 max 2 ✓),
supercharged-glyphs, yrden-magic-trap, axii-intensity (T3 max 3 — o mapeamento
que estava marcado como baixa confiança era correto), axii-puppet,
quen-discharge, acquired-tolerance, synergy, protective-coating, poisoned-blade,
side-effects.

## Problemas estruturais — TODOS CORRIGIDOS na sequência (jul/2026)

> A regeneração completa foi aplicada: `skills.json` agora tem as 80
> habilidades reais (com `gameId` e nomes oficiais PT-BR), o planner usa o
> pool único de 12 slots em 4 grupos de 3 pareados com mutagênios (schema v3,
> com migração automática das builds v2 salvas no localStorage), e as builds
> curadas foram expandidas para caminhos de ~38-56 pontos validados por
> simulação. As seções abaixo ficam como registro do que estava errado.

### 1. Skills do app que NÃO existem no jogo (8)

- `synthesis` (alquimia) — não existe.
- `wolf-school-techniques` e `manticore-school-techniques` — só existem
  técnicas das escolas do Gato, Grifo e Urso.
- `sixth-sense`, `strengthened-synapses`, `clever-fingers`, `battle-trance`
  (geral) — não existem como skills. Os slots extras de mutação/skill vêm do
  sistema de mutações do B&W, não de uma skill.
- `fleet-footed` existe, mas é de **Combate** (coluna Defesa, T2, max 1), não
  Geral — e o efeito real é "reduz dano recebido durante esquivas", não
  penalidade de terreno.

### 2. Skills do jogo que faltam no app (29)

- Combate: Strength Training, Arrow Deflection (T1, max 2), Fleet Footed
  (recategorizar), Lightning Reflexes (max 1), Cold Blood, Anatomical
  Knowledge, Crippling Shot.
- Signos: Far-Reaching Aard (T1), Firestream (T2), Igni Intensity (T3),
  Yrden Intensity (T3), Quen Intensity (T3), Shock Wave (T4), Domination (T4).
- Alquimia: Delayed Recovery (T3), Adaptation (T4), Hunter Instinct (T4),
  Steady Aim (T1, max 1), Pyrotechnics (T2), Frenzy (T1), Endure Pain (T2),
  Fast Metabolism (T3), Killing Spree (T4).
- Geral: Sun and Stars, Survival Instinct, Rage Management, Adrenaline Burst,
  Focus, Metabolic Control (o app tem esse como alquimia T4 — é perk Geral),
  e os 10 de DLC (Metabolism Boosts, Trick Shot, Advanced Pyrotechnics,
  Battle Frenzy, Strong Back — HoS; Gorged on Power, Gourmet, In Combat's
  Fires, Heavy Artillery, Attack is the Best Defense — B&W).

### 3. Descrições erradas em skills existentes

- `efficiency` — real: +1 bomba por slot por ranque (não decocções).
- `synergy` — real: +bônus do mutagênio equipado no slot (não sinais por óleos).
- `tissue-transmutation` — real: decocções dão +vitalidade máxima enquanto ativas.
- `side-effects` — real: beber poção pode ativar de graça o efeito de outra
  poção aleatória (não crítico/status).
- `fixative` — real (Next-Gen): +33% cargas de óleo por ranque.
- `acquired-tolerance` — real: cada fórmula de alquimia conhecida (nv 1/2/3
  conforme o ranque) dá +0,5 toxicidade máxima.
- `aard-intensity` ("Impacto de Aard") — real: +intensidade do Sinal Aard;
  nome oficial BR: "Intensidade do Aard".

### 4. Modelo de slots do planner

O jogo usa **pool único de 12 slots** (qualquer skill em qualquer slot; a cor
só importa pro casamento skill↔mutagênio no grupo de 3). O app modela 3 slots
por cor (`SLOTS_PER_COLOR`, `ABILITY_SLOT_UNLOCK_LEVELS_BY_COLOR`,
`SlotGrid.svelte` etc.). Os *níveis* de desbloqueio já foram corrigidos, mas a
estrutura precisa de refactor.

## Curiosidades / notas

- A tradução oficial PT-BR tem escolhas questionáveis mas válidas (confirmado
  em jogo): Protective Coating = "Aterrorizar", Whirl = "Espira",
  Rend = "Despedaçar", Steady Shot = "Olhos de Águia".
- Existem strings de skills cortadas no jogo ("Volley", "Aegis", "Druid
  Techniques", "Predatory Instinct") — não estão na árvore, ignorar se
  aparecerem em wikis.
- XP por nível (`geralt_levelups.xml`): 1000 XP fixo até o nível ~10, depois
  1500, depois 2000/nível; nível 51+ usa "infinite leveling" (2000/nível).
