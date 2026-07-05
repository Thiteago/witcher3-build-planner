# Dados oficiais do jogo — fontes, metodologia e pendências

Fonte da verdade: arquivos extraídos da instalação Steam do Witcher 3 Next-Gen
(jul/2026), em `game_data/`:

- `geralt_skills.xml` — seção `<custom><skills>` com **tier** (`requiredPointsSpent`
  0/6/12/18), **ranque máximo** (`maxLevel`), árvore e coluna de cada habilidade;
  seções `<skill_slots>` e `<mutagen_slots>` com os níveis de desbloqueio.
- `geralt_levelups.xml` — XP e pontos de habilidade por nível.
- `geralt_skills_ep1.xml` / `geralt_skills_ep2.xml` — perks Gerais adicionados
  por Hearts of Stone e Blood and Wine (extraídos direto dos bundles dos DLCs).
- `geralt_mutations.xml` — sistema de mutações do B&W (custos, pré-requisitos,
  thresholds dos slots extras, chaves de localização por mutação).
- Nomes oficiais EN/PT-BR decodificados de `en.w3strings` / `br.w3strings`.

O resultado consolidado e legível por máquina está em
**`game_data/skills_official.json`** (80 habilidades: 20 Combate, 20 Signos,
20 Alquimia, 20 Geral incluindo 10 de DLC — mais as 12 mutações do B&W).
Tudo isso já está aplicado no app (`skills.json` com `gameId`, `mutations.json`,
`slotProgression.ts`, pool único de 12 slots, schema v4 com migrações).

## Metodologia de identificação (útil se sair patch novo)

- **Skills**: a identificação id-interno → nome foi feita casando os
  modificadores de stats de cada ability com as descrições oficiais, e é
  auto-validada por pontos distintivos (Glifos Sustentados é a única de Yrden
  com maxLevel 2; Golpes Esmagadores é Strong tier 2, confirmado em jogo; os
  ícones dos perks de DLC nomeiam o perk). O hash chave-textual → id-numérico
  do w3strings é desconhecido; o mapeamento usa clusters de ids (nomes de
  skills ≈ 1066820–1066909, perks de DLC ≈ 1129065–1129126).
- **Mutações (VERIFICADO jul/2026)**: `geralt_mutations.xml` referencia
  `skill_name_mutation_N` por mutação, e os str_ids dos nomes seguem a ordem
  N no cluster 1188298–1188321 (exceção: nome de Magic Sensibilities em
  1193282, descrição em 1188301). Pinos independentes nos stats confirmam:
  `mut5_dmg_red_perc` = Pele Transformada, `full_freeze_chance` = Frio
  Congelante, crit de Sinais = Sensibilidade Mágica, decocções = Metamorfose,
  `dmg_bonus`/`hp_perc_trigger` 0.25 = Contagem Fatal. Cores e cadeia de
  pré-requisitos fecham a árvore de pesquisa de forma consistente (iniciais:
  Sensibilidade Mágica/azul, Sangue Tóxico/verde, Contagem Fatal/vermelho).

## Regras estruturais confirmadas

| Item | Valor oficial |
|---|---|
| Limiares de tier | 0 / 6 / 12 / 18 pontos gastos na mesma árvore |
| Pontos por nível | 1/nível a partir do nível 2 (nível 1 = 0); Locais de Poder dão bônus |
| Slots de skill | pool único de **12 slots genéricos**, 4 grupos de 3 (1 mutagênio por grupo), níveis 1,2,4,6,8,10,12,15,18,22,26,30 |
| Slots extras 13–16 | via mutações pesquisadas do B&W: 2/4/8/12 |
| Slots de mutagênio | níveis 2 / 9 / 16 / 28 |
| Skills Gerais | todas tier 1, custo 1, ranque máximo 1 (10 base + 5 HoS + 5 B&W) |
| Whirl / Rend | 3 ranques no Next-Gen |
| XP por nível | 1000 até ~10, depois 1500, depois 2000/nível; 51+ "infinite leveling" (2000) |

## Pendências

- **Slots extras 13–16** (mutações pesquisadas) — dados prontos em
  `skills_official.json`/`mutations.json`, mas o planner para nos 12 base.
- **Pontos bônus de Locais de Poder** — a simulação usa só 1 ponto/nível.
- **Itens nunca validados contra o jogo** — `decoctions/oils/potions/gearSets/
  runes/glyphs/mutagens.json` vieram de pesquisa em wiki, sem cruzamento com
  os bundles (a extração oficial cobriu só skills/slots/mutações).

## Curiosidades / notas

- A tradução oficial PT-BR tem escolhas questionáveis mas válidas (confirmado
  em jogo): Protective Coating = "Aterrorizar", Whirl = "Espira",
  Rend = "Despedaçar", Steady Shot = "Olhos de Águia".
- Existem strings de skills cortadas no jogo ("Volley", "Aegis", "Druid
  Techniques", "Predatory Instinct") — não estão na árvore, ignorar se
  aparecerem em wikis.
- Comentários nos XMLs usam nomes de desenvolvimento desatualizados (ex.:
  "Fiery Dancer" para Muscle Memory) — confiar só nos stats.
