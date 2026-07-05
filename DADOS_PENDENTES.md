# Dados pendentes de verificação

> **ATUALIZAÇÃO (jul/2026): praticamente tudo deste arquivo foi RESOLVIDO
> extraindo os dados oficiais do jogo** (XMLs dos bundles + w3strings da
> instalação Steam Next-Gen). Ver **`GAME_DATA_VALIDATION.md`** (relatório
> completo) e **`game_data/skills_official.json`** (verdade do jogo, legível
> por máquina). Este arquivo fica como registro do que ainda depende de
> decisão de produto, não de pesquisa.

## Resolvido com dados oficiais (aplicado no app)

- Limiares de tier 0/6/12/18 ✅ (já estava certo)
- 1 ponto de habilidade por nível a partir do nível 2 ✅ (já estava certo)
- Tier e maxRank de TODAS as habilidades — corrigidos em `skills.json`
  (17 correções; lista completa no relatório)
- Slots de mutagênio: níveis **2**/9/16/28 — corrigido (era 3 no app)
- Níveis de desbloqueio dos 12 slots de skill: 1,2,4,6,8,10,12,15,18,22,26,30
  — corrigidos em `slotProgression.ts`
- Slots extras de skill por mutações pesquisadas (B&W): 2/4/8/12 ✅ confirmado
- Whirl e Rend têm 3 ranques no Next-Gen ✅ (dúvida antiga resolvida)
- Skills Gerais: todas tier 1, maxRank 1 (inclusive Técnicas de Escola) ✅

## Decisões tomadas e aplicadas (jul/2026)

1. **Modelo de slots** ✅ — planner refatorado para o pool único de 12 slots
   genéricos, em 4 grupos de 3 pareados com o mutagênico do grupo
   (`SlotGrid.svelte`, `slotProgression.ts`, `economy.ts`, `types.ts`).
2. **Árvore completa** ✅ — `skills.json` regenerado com as 80 habilidades
   reais (campo `gameId` liga ao id interno do jogo). Skills inexistentes
   removidas; `fleet-footed` → Combate; `metabolic-control` → Geral. Builds
   salvas no localStorage migram automaticamente de v2 para v3 (`storage.ts`):
   slots por cor viram grupos, ids mortos são descartados, ranks clampados.
3. **Descrições e nomes** ✅ — descrições reescritas a partir dos textos
   oficiais; nomes adotam a tradução oficial PT-BR (incluindo "Aterrorizar",
   "Espira", "Olhos de Águia" — confirmados como oficiais).
4. **Builds curadas** ✅ — expandidas para 16-22 skills (~38-56 pontos, caminho
   de level up até nível ~39-57), com ordem validada por simulação (nenhuma
   skill fica inalcançável pelos gates de tier). Nível máximo do jogo: 100.

## Ainda não modelado (baixa prioridade)

- Os 4 slots extras de skill (13-16) desbloqueados por mutações pesquisadas
  do B&W — o planner para nos 12 base.
- Pontos bônus de Locais de Poder (a simulação usa só 1 ponto/nível).
- As 12 mutações individuais do B&W com custos/pré-requisitos
  (dados prontos em `game_data/skills_official.json` → `mutations`).
