# CLAUDE.md

Contexto para agentes trabalhando neste repo.

## O que é

**Infiltrado** — jogo de festa estilo _Imposter Who?/Spyfall_: um celular passa de mão em mão,
todos recebem a mesma palavra secreta menos o(s) impostor(es). 100% client-side (sem backend,
sem chamadas de rede em runtime), mobile-first, pt-BR, PWA offline-first.

- Produção: <https://infiltrado-mocha.vercel.app> (Vercel, projeto `infiltrado`, team `e3-l`)
- **Push na `main` = deploy automático de produção.**

## Comandos

```bash
npm run dev      # dev server (porta 5173)
npm run build    # tsc -b && vite build (gera SW/manifest via vite-plugin-pwa)
npm run preview  # serve dist/
npm run lint     # eslint
npm test         # vitest (draw logic + validação do banco de palavras)
node scripts/generate-icons.mjs  # regenera PNGs do PWA a partir de public/icon.svg
```

Antes de commitar: `npm run lint && npx prettier --write <arquivos> && npm test && npm run build`.

## Arquitetura

- **Sem react-router.** Máquina de estados pelo campo `phase` do store
  (`setup | reveal | playing | result`). Dentro de `setup`, o `App.tsx` mantém sub-tela local
  (`home | players | rules | game`); quando `screen === 'game'`, renderiza pela `phase`.
- `src/config/app.ts` — **única fonte** de nome/emoji/descrição/cores de tema/chaves de storage.
  Nada de "Infiltrado" hardcoded em componente ou HTML: um plugin inline em `vite.config.ts`
  injeta os placeholders `%APP_NAME%` etc. no `index.html`, e o manifest do PWA importa daqui.
  (`tsconfig.node.json` inclui `src/config/app.ts` por isso.)
- `src/store/gameStore.ts` — Zustand + persist (`infiltrado-game`, version 1). Actions:
  `addPlayer/removePlayer/updatePlayer/setSettings/startRound/nextReveal/goToPlaying/
revealResult/newRound/resetSession`. 3–15 jogadores; impostores 1..floor(players/3).
- `src/utils/draw.ts` — sorteio puro com RNG injetável (testes determinísticos): categoria →
  palavra (anti-repetição via `usedWords`, máx. 30; categoria esgotada limpa só o próprio
  histórico) → impostores → dicas (`same` = hints[0] para todos; `different` = distintas,
  cíclico se faltar) → starter.
- `src/data/categories/*.json` — 17 categorias × 80 palavras, cada uma com 2–3 dicas.
  `src/data/index.ts` importa e exporta tudo tipado.
- `src/hooks/useHoldToReveal.ts` — hold-to-reveal com Pointer Events + `setPointerCapture`;
  delay de 300ms antes de revelar, 600ms revelado para contar "hold completo". No iOS,
  `touch-action: none` não basta: durante o hold registra `touchmove` NÃO-passivo com
  preventDefault (senão o WebKit dispara pointercancel por micro-scroll e o card fecha
  sozinho). CSS de apoio: `overscroll-behavior: none` no html/body e classe `.hold-area`.
- `src/hooks/useTheme.ts` + `src/styles/tokens.css` — temas dark/light/system.

## Invariantes de jogo (não quebrar)

1. **A palavra e os impostores NUNCA aparecem no DOM** fora do hold individual (Reveal) e da
   tela Result. `pointerup/pointercancel/pointerleave` escondem imediatamente.
2. Botão de avançar no Reveal só aparece após um hold completo **e** com o dedo solto
   (`held && !revealed`) — evita pulo acidental.
3. Cada impostor vê **apenas a própria dica** (`round.imposterHints[playerIndex]`);
   impostores não se conhecem.
4. `RevealCard` é remontado por `key={currentRevealIndex}` — estado do hold zera entre jogadores.

## Identidade visual ("Noir Detetive")

- **Só tokens semânticos** (`bg-surface`, `text-danger`, `text-primary`…) mapeados em
  `src/index.css` via `@theme inline` a partir de `src/styles/tokens.css`
  (`:root[data-theme='dark'|'light']`). **Nenhuma cor literal em componente.**
- Tema: dark é o principal; light é contraparte. Preferência em `infiltrado-theme`
  (separada da sessão). Script inline no `index.html` aplica `data-theme` pré-paint
  (anti-flash) — se mudar tokens de fundo, atualizar também o `<style>` inline do html
  e `APP_THEME_COLORS`.
- Minimalismo: emojis **somente** no logo da Home (`APP_EMOJI`) e nos chips de categorias.
  Botões `rounded-xl` sem sombra/gradiente; cards `bg-surface` com border 1px.
- Vermelho (`danger`) como acento de texto, nunca card inteiro vermelho.
- Contraste: light `primary` (#65A30D) sobre branco dá ~3.1:1 — AA apenas para texto
  grande/bold; usar `on-primary` só em CTAs grandes.

## Banco de palavras

- 80 palavras por categoria, conhecidas do público geral brasileiro.
- Dicas: 2–3 por palavra, **curtas (1–3 palavras) e sutis** — apontam a direção sem entregar
  (ex.: "Esponja" → "absorve", nunca "item de lavar louça"). Dica não pode conter a palavra.
- `src/data/data.test.ts` valida tudo isso — rodar `npm test` após qualquer edição nos JSONs.

## Git

- Branch única `main`, commits diretos (sem PRs). Conventional Commits **em inglês**
  (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`), atômicos por etapa lógica.
- Repo: `Estevao-Lucas/infiltrado` (conta pessoal — nunca criar nada em orgs).
- Lembrar: push deploya produção. `vercel.json` controla cache (assets com hash imutáveis;
  `index.html`/`sw.js`/manifest `no-cache` para o autoUpdate do PWA funcionar).

## Fluxo de trabalho do usuário

Fases com **gates de revisão**: apresentar resultado e aguardar OK explícito antes de avançar
de fase. Amostras antes de gerar conteúdo em massa. Textos de UI em pt-BR, tom direto.
