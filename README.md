# 🕵️ Infiltrado

Jogo de festa para jogar em grupo com **um único celular** passando de mão em mão — estilo _Imposter Who / Spyfall_. 100% client-side, mobile-first, em pt-BR.

## Conceito

Todos os jogadores recebem secretamente a **mesma palavra** de uma categoria (ex.: "pizza" em Comidas) — todos, menos um: o **infiltrado**, que só sabe a categoria. Em rodadas de conversa, cada um dá pistas vagas de que conhece a palavra, sem entregá-la. No fim, o grupo vota em quem acha que é o infiltrado:

- Grupo acerta o infiltrado → grupo vence.
- Infiltrado escapa (ou adivinha a palavra) → infiltrado vence.

## Fluxo de telas

O app é uma máquina de estados controlada pelo campo `phase` do store (`setup | reveal | playing | result`) — **sem react-router**.

```
Home → PlayersSetup → Rules → Reveal → Playing → Result
        (setup)                (reveal)  (playing)  (result)
```

| Tela           | Fase      | O que acontece                                           |
| -------------- | --------- | -------------------------------------------------------- |
| `Home`         | `setup`   | Entrada do jogo, iniciar partida                         |
| `PlayersSetup` | `setup`   | Cadastro dos jogadores e configuração da partida         |
| `Rules`        | `setup`   | Regras rápidas antes de começar                          |
| `Reveal`       | `reveal`  | Celular passa de mão em mão revelando palavra/infiltrado |
| `Playing`      | `playing` | Rodada de pistas e discussão                             |
| `Result`       | `result`  | Votação revelada e vencedor                              |

> Fase atual do projeto: **scaffold** — telas são placeholders, sem lógica de jogo ainda.

## Como rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção (dist/)
npm run preview  # serve o build localmente
npm run lint     # eslint
```

## Como trocar o nome do app

Toda a identidade fica em **um único lugar**: [`src/config/app.ts`](src/config/app.ts).

```ts
export const APP_NAME = 'Infiltrado'
export const APP_EMOJI = '🕵️'
export const APP_DESCRIPTION = '...'
```

Componentes importam essas constantes (nenhum nome hardcoded), e um plugin em [`vite.config.ts`](vite.config.ts) injeta os valores nos placeholders `%APP_NAME%` etc. do `index.html` (título e meta description). Basta editar `app.ts` e rebuildar.

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript (strict)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Zustand](https://zustand.docs.pmnd.rs) com `persist` (localStorage)
- ESLint + Prettier
