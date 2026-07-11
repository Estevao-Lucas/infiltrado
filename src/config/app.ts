/**
 * Identidade central do app. Todo texto/título que exiba o nome do jogo
 * deve importar daqui — nunca hardcode em componentes ou no index.html.
 */
export const APP_NAME = 'Infiltrado'
export const APP_EMOJI = '🕵️'
export const APP_DESCRIPTION =
  'Jogo de festa em um só celular: todos recebem a mesma palavra secreta, menos o infiltrado. Discutam, desconfiem e votem para descobrir quem está blefando.'
/** Cor da meta theme-color por tema (browser chrome mobile). */
export const APP_THEME_COLORS = {
  dark: '#0f1115',
  light: '#f7f7f5',
} as const

/** Chave base para persistência da sessão no localStorage. */
export const APP_STORAGE_KEY = 'infiltrado-game'

/** Chave da preferência de tema — separada da sessão do jogo. */
export const THEME_STORAGE_KEY = 'infiltrado-theme'
