export interface GameObject {
  id: number;
  x: number;
  y: number;
}

export interface PlayerPos {
  x: number;
  y: number;
}

export type GameStatus = 'PLAYING' | 'GAME_OVER';
