export interface Player {
  name: string;
  score: number;
}

export enum GameState {
  LanguageSelection = 'LANGUAGE_SELECTION',
  Setup = 'SETUP',
  Theme = 'THEME',
  Countdown = 'COUNTDOWN',
  Playing = 'PLAYING',
  GameOver = 'GAMEOVER',
}

export enum GameMode {
  Classic = 'CLASSIC',
  Tap = 'TAP',
}

export type Language = 'en' | 'pt';