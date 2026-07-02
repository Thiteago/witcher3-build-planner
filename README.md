# Witcher 3 Build Planner

App SvelteKit (SPA, sem backend/banco de dados) com dicas de build para The
Witcher 3: Wild Hunt — catálogo de habilidades e itens, builds recomendados
para diferentes estilos de jogo, e um montador interativo para você criar
suas próprias builds. Tudo é salvo apenas no `localStorage` do navegador.

Projeto de fã, não oficial e sem fins lucrativos, feito sob a política de
conteúdo de fãs da CD Projekt Red.

## Funcionalidades

- **Habilidades** (`/skills`) — catálogo de skills de Combate, Signos,
  Alquimia e Geral, com busca e filtro por categoria.
- **Itens** (`/items`) — conjuntos de equipamento (Lobo, Grifo, Gato, Urso,
  Mantícora), runas, glifos, óleos, poções, decocções e mutagênicos.
- **Builds recomendados** (`/builds`) — builds curados (Sinais de Fogo,
  Alquimia/Toxicidade, Ataque Rápido, Ataque Forte, Tanque de Quen, Euphoria,
  Frio Penetrante), com filtro por tags e sequência de level-up sugerida.
- **Meus Builds** (`/planner`) — monte sua própria build (nível, slots de
  habilidade, mutagênicos, mutação de Blood and Wine, equipamento,
  decocções), salva automaticamente no navegador.
- **Créditos** (`/credits`) — fontes usadas e um tutorial de como extrair
  ícones da sua própria cópia do jogo, caso queira usá-los localmente.

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) + TypeScript, rodando como SPA
  pura via `@sveltejs/adapter-static` (`fallback: 'index.html'`).
- [Tailwind CSS](https://tailwindcss.com/) para estilo.
- Dados de skills/itens/builds em JSON estático (`src/lib/data/`), sem API
  externa nem banco de dados.
- Persistência de builds próprias via `localStorage` (ver `src/lib/storage.ts`
  e `src/lib/stores/customBuilds.svelte.ts`).

## Desenvolvendo

```sh
npm install
npm run dev            # servidor de desenvolvimento
npm run dev -- --open  # idem, abrindo no navegador
```

## Build de produção

```sh
npm run build     # gera o build estático em build/
npm run preview   # serve o build gerado para conferir localmente
```

## Verificações

```sh
npm run check   # type-check (svelte-check)
npm run lint    # prettier --check + eslint
npm run test    # vitest
```

## Ícones

Este repositório não inclui ícones extraídos do jogo (direitos autorais). O
app mostra um badge genérico no lugar quando o arquivo não existe. Veja
`static/icons/README.md` e a página `/credits` do app para instruções de como
adicionar seus próprios ícones extraídos localmente, para uso pessoal.
