export type EnemyType = 'REGULAR' | 'ZIGZAG' | 'TANK';

export interface GameObject {
  id: number;
  x: number;
  y: number;
  type?: EnemyType;
  health?: number;
  maxHealth?: number;
}

export interface PlayerPos {
  x: number;
  y: number;
}

export type GameStatus = 'PLAYING' | 'GAME_OVER';

export interface Particle extends GameObject {
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export type PowerUpType = 'TRIPLE_SHOT' | 'SHIELD' | 'BOMB';

export interface PowerUp extends GameObject {
  powerType: PowerUpType;
}
