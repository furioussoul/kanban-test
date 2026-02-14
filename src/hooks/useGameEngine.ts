import { useState, useEffect, useCallback, useRef } from 'react';
import { GameObject, PlayerPos, GameStatus } from '../types';
import { 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  PLAYER_SIZE, 
  ENEMY_SIZE, 
  BULLET_SIZE, 
  BULLET_SPEED, 
  ENEMY_SPEED, 
  ENEMY_SPAWN_RATE 
} from '../constants';

export const useGameEngine = () => {
  const [playerPos, setPlayerPos] = useState<PlayerPos>({ 
    x: GAME_WIDTH / 2 - PLAYER_SIZE / 2, 
    y: GAME_HEIGHT - 60 
  });
  const [bullets, setBullets] = useState<GameObject[]>([]);
  const [enemies, setEnemies] = useState<GameObject[]>([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>('PLAYING');
  
  const keysPressed = useRef<Set<string>>(new Set());
  const lastEnemyTime = useRef<number>(0);
  const requestRef = useRef<number>();

  const shoot = useCallback(() => {
    setPlayerPos(currentPos => {
      setBullets(prev => [
        ...prev, 
        { id: Date.now(), x: currentPos.x + PLAYER_SIZE / 2 - BULLET_SIZE / 2, y: currentPos.y }
      ]);
      return currentPos;
    });
  }, []);

  const spawnEnemy = useCallback(() => {
    const now = Date.now();
    if (now - lastEnemyTime.current > ENEMY_SPAWN_RATE) {
      setEnemies(prev => [
        ...prev, 
        { id: now, x: Math.random() * (GAME_WIDTH - ENEMY_SIZE), y: -ENEMY_SIZE }
      ]);
      lastEnemyTime.current = now;
    }
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setBullets([]);
    setEnemies([]);
    setStatus('PLAYING');
    setPlayerPos({ x: GAME_WIDTH / 2 - PLAYER_SIZE / 2, y: GAME_HEIGHT - 60 });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);
      if (e.code === 'Space') shoot();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [shoot]);

  const update = useCallback(() => {
    if (status !== 'PLAYING') return;

    // 0. Move Player (Keyboard)
    setPlayerPos(prev => {
      let newX = prev.x;
      let newY = prev.y;
      const speed = 5;
      if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('KeyA')) newX -= speed;
      if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('KeyD')) newX += speed;
      if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('KeyW')) newY -= speed;
      if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('KeyS')) newY += speed;

      return {
        x: Math.max(0, Math.min(newX, GAME_WIDTH - PLAYER_SIZE)),
        y: Math.max(0, Math.min(newY, GAME_HEIGHT - PLAYER_SIZE))
      };
    });

    // 1. Move Bullets
    setBullets(prev => prev
      .map(b => ({ ...b, y: b.y - BULLET_SPEED }))
      .filter(b => b.y > -BULLET_SIZE)
    );

    // 2. Move Enemies (Speed increases with score)
    const currentEnemySpeed = ENEMY_SPEED + Math.floor(score / 100);
    setEnemies(prev => {
      return prev.map(e => ({ ...e, y: e.y + currentEnemySpeed }))
        .filter(e => e.y < GAME_HEIGHT);
    });

    spawnEnemy();
    requestRef.current = requestAnimationFrame(update);
  }, [status, spawnEnemy]);

  // Collision Detection
  useEffect(() => {
    if (status !== 'PLAYING') return;

    const collisionInterval = setInterval(() => {
      setEnemies(prevEnemies => {
        let hitIds: number[] = [];
        let collisionWithPlayer = false;

        const remainingEnemies = prevEnemies.filter(enemy => {
          const bulletHit = bullets.find(bullet => 
            bullet.x < enemy.x + ENEMY_SIZE &&
            bullet.x + BULLET_SIZE > enemy.x &&
            bullet.y < enemy.y + ENEMY_SIZE &&
            bullet.y + BULLET_SIZE > enemy.y
          );

          if (bulletHit) {
            hitIds.push(bulletHit.id);
            setScore(s => s + 10);
            return false;
          }

          if (
            playerPos.x < enemy.x + ENEMY_SIZE &&
            playerPos.x + PLAYER_SIZE > enemy.x &&
            playerPos.y < enemy.y + ENEMY_SIZE &&
            playerPos.y + PLAYER_SIZE > enemy.y
          ) {
            collisionWithPlayer = true;
          }

          return true;
        });

        if (collisionWithPlayer) setStatus('GAME_OVER');
        if (hitIds.length > 0) {
          setBullets(bs => bs.filter(b => !hitIds.includes(b.id)));
        }
        return remainingEnemies;
      });
    }, 50);

    return () => clearInterval(collisionInterval);
  }, [bullets, playerPos, status]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  return {
    playerPos,
    setPlayerPos,
    bullets,
    enemies,
    score,
    level: Math.floor(score / 100) + 1,
    status,
    shoot,
    resetGame
  };
};
