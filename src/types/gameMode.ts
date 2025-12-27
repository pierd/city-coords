export type GameMode = 'daily' | 'random' | 'classic';

export interface GameModeConfig {
  mode: GameMode;
  maxAttempts: number;
  totalRounds: number;
  seed: string;
}

export const GAME_MODE_CONFIGS: Record<GameMode, Omit<GameModeConfig, 'seed'>> = {
  daily: {
    mode: 'daily',
    maxAttempts: 6,
    totalRounds: 1,
  },
  random: {
    mode: 'random',
    maxAttempts: 6,
    totalRounds: 1,
  },
  classic: {
    mode: 'classic',
    maxAttempts: 1,
    totalRounds: 10,
  },
};
