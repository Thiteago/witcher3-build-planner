> **RESOLVIDO (jul/2026):** todos os itens abaixo foram verificados contra os dados oficiais extraídos do jogo — ver `GAME_DATA_VALIDATION.md`. Mantido só como histórico.

# Itens de baixa confiança — revisar manualmente

Gerado durante a pesquisa do sistema de habilidades Next-Gen (patch 4.0+) para o build-planner.
Tudo listado aqui teve confirmação fraca, única-fonte, ou resultados conflitantes. Os itens
NÃO listados aqui (tier thresholds 6/12/18, maxRank=3 padrão, etc.) tiveram confirmação
cruzada em múltiplas fontes independentes e podem ser tratados como confiáveis.

## 1. Estrutura de slots de habilidade (Q3) — cronograma exato por nível
Modelo confirmado com confiança média-alta: **pool único compartilhado de 12 slots** (não é uma
trilha separada por cor). Qualquer skill de qualquer cor pode ir em qualquer slot; a cor só
importa para o bônus de mutágeno do grupo de 3.
O cronograma de desbloqueio por nível (1,2,4,6,8,10,12,15,18,22,26,30) é amplamente repetido em
guias, mas NINGUÉM confirmou explicitamente que esses números não mudaram no patch 4.0 — pode ser
texto herdado de antes do next-gen. Vale abrir o jogo e conferir manualmente em uma save de teste.

## 2. Slots de mutágeno (Q4) — nível do 1º slot
Conflito entre fontes: nível **3** vs nível **4** para o primeiro slot de mutágeno.
Favoreci nível 3 por maioria de menções, mas não está resolvido. Os demais (9, 16, 28) tiveram
mais consistência entre fontes, porém ainda sem confirmação explícita pós-4.0.
Também vale confirmar se "Strengthened Synapses" (general skill) e os slots extras de mutação do
Blood and Wine (2/4/8/12 mutações) são coisas realmente separadas dos 4 slots base de mutágeno —
os dois agentes de pesquisa descreveram isso de forma um pouco diferente um do outro.

## 3. Cadeia de pré-requisitos de Mutações (Q6, ponto secundário)
Confirmado que as 4 árvores principais (Combat/Signs/Alchemy/General) não têm pré-requisito de
skill específica no Next-Gen (só limiar de pontos por tier). MAS o sistema separado de Mutações
(Blood and Wine) tem cadeias de pré-requisito nomeadas (ex: Euphoria precisa de Toxic Blood).
Não achei fonte que reconfirme essa cadeia especificamente pós-patch 4.0 — é inferência de que
não mudou, não confirmação direta. Baixo impacto se o app não modela mutações do Blood and Wine
como parte da árvore de skills.

## 4. Tabela de tier/maxRank — Combat e Alchemy (Q5)
Os dados de tier para Combat e Alchemy vieram de UMA ÚNICA chamada de WebFetch (resumida por um
modelo pequeno) na página Fextralife de cada árvore, sem checagem cruzada com uma segunda fonte
(não deu tempo). Há sinais de possível confusão/alucinação do resumidor:
- Ele rotulou "Fleet Footed" como uma skill de COMBATE tier 2, mas no dataset do app
  `fleet-footed` está categorizado como GENERAL. Pode ser nome real duplicado no jogo real, ou
  erro do resumidor. Tratei como skill General (seguindo a categoria já definida no skills.json).
- Nomes de "branch" trazidos (ex: "Battle Trance Branch" contendo Resolve/Undying/Razor
  Focus/Flood of Anger) não batem com o fato de que "Battle Trance" também é o nome de uma skill
  GENERAL real (`battle-trance` no app). Pode ser um erro de rotulagem do resumidor reusando nomes
  de skill como se fossem nomes de coluna/branch.
- Na Alchemy, a página trouxe 20 skills mas **nenhuma bateu com os ids do app `metabolic-control`
  e `synthesis`** — ou seja, essas duas ficaram sem dado real e o tier reportado no relatório final
  é um CHUTE baseado em padrão (não verificado).
- `undying` (Tier 2, segundo o fetch) parece uma posição de tier baixa para uma skill tão forte
  (sobreviver a um golpe fatal). Vale checar manualmente — pode ser Tier 3 ou 4.
- `whirl` e `rend` são habilidades ATIVAS (ganham um novo golpe). O fetch disse maxRank 3 para
  ambas (seguindo a regra geral "tudo virou rank 3"), mas no jogo pré-next-gen elas eram rank 1
  (só ativam a habilidade, sem escala por rank). Não tive confirmação independente de que o
  next-gen realmente deu 3 ranks a essas duas — pode muito bem continuar rank 1. Prioridade alta
  para checar manualmente no jogo ou em uma segunda fonte.

## 5. General tree — ranks especiais
A regra geral confirmada (Fextralife) é: sem tiers, todas as skills General custam só 1 ponto
(maxRank 1). Isso provavelmente está correto pra maioria, mas dois ids merecem atenção extra:
- `strengthened-synapses` — a descrição do app diz "desbloqueia slots adicionais para mutações".
  Pode ser que essa skill em si tenha múltiplos ranks (cada rank = 1 slot a mais), o que
  contradiria a regra "toda general skill é rank 1". Não confirmei isso com uma fonte específica
  sobre essa skill.
- As 5 skills "Técnicas da Escola X" (cat/griffin/ursine/wolf/manticore) — assumi maxRank 1 pela
  regra geral, mas não verifiquei individualmente se alguma dessas tem ranks múltiplos escalando
  o bônus do set de armadura.

## Como usar este arquivo
Para cada item acima, o relatório final já preencheu um valor "melhor palpite" — este arquivo é
só o registro de ONDE esse palpite é fraco, para você conferir manualmente contra o jogo/wiki
quando tiver tempo.
