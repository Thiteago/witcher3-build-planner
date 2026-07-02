# Ícones

Este app não inclui ícones extraídos do jogo por padrão (direitos autorais). O
componente `<Icon>` mostra um badge com a primeira letra do nome quando a
imagem não existe, então o app funciona normalmente sem nenhum arquivo aqui.

Se você quiser usar ícones reais extraídos da sua própria cópia do jogo (uso
pessoal), siga esta convenção de nomes:

- `static/icons/skills/{id}.png` — `{id}` é o campo `id` da skill em
  `src/lib/data/skills.json` (ex: `igni-melt-armor.png`).
- `static/icons/items/{id}.png` — `{id}` é o campo `id` de qualquer item
  (runas, glifos, óleos, poções, decocções, mutagênicos, gear sets) — todos
  compartilham o mesmo namespace de pasta `items/`.
- `static/icons/mutations/{id}.png` — `{id}` é o campo `id` da mutação em
  `src/lib/data/mutations.json` (ex: `euphoria.png`).

Tamanho recomendado: 128×128 ou 256×256 PNG com transparência.
