import { useState, useEffect, useCallback, useRef } from 'react';
import { GameObject, PlayerPos, GameStatus, EnemyType } from '../types';
import { 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  PLAYER_SIZE, 
  ENEMY_SIZE, 
  BULLET_SIZE, 
  BULLET_SPEED, 
  ENEMY_SPEED, 
  ENEMY_SPAWN_RATE,
  FIRE_RATE,
  INITIAL_LIVES,
  PLAYER_SPEED
} from '../constants';

export const useGameEngine = () => {
  const [playerPos, setPlayerPos] = useState<PlayerPos>({ 
    x: GAME_WIDTH / 2 - PLAYER_SIZE / 2, 
    y: GAME_HEIGHT - 60 
  });
  const [bullets, setBullets] = useState<GameObject[]>([]);
  const [enemies, setEnemies] = useState<GameObject[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [status, setStatus] = useState<GameStatus>('PLAYING');
  
  const [powerUps, setPowerUps] = useState<GameObject[]>([]);
  const [hasTripleShot, setHasTripleShot] = useState(false);
  
  const keysPressed = useRef<Set<string>>(new Set());
  const lastEnemyTime = useRef<number>(0);
  const lastFireTime = useRef<number>(0);
  const tripleShotTimer = useRef<any>(null);
  const requestRef = useRef<number>();
  
  // Use refs for values needed in the animation loop to avoid stale closures
  const stateRef = useRef({
    playerPos,
    bullets,
    enemies,
    powerUps,
    status,
    lives,
    score
  });

  // Sync refs with state
  useEffect(() => {
    stateRef.current = { playerPos, bullets, enemies, powerUps, status, lives, score };
  }, [playerPos, bullets, enemies, powerUps, status, lives, score]);

  const shoot = useCallback(() => {
    const now = Date.now();
    if (now - lastFireTime.current < FIRE_RATE) return;

    const bulletX = stateRef.current.playerPos.x + PLAYER_SIZE / 2 - BULLET_SIZE / 2;
    const bulletY = stateRef.current.playerPos.y;

    if (hasTripleShot) {
      setBullets(prev => [
        ...prev, 
        { id: now, x: bulletX, y: bulletY },
        { id: now + 1, x: bulletX - 20, y: bulletY + 10 },
        { id: now + 2, x: bulletX + 20, y: bulletY + 10 }
      ]);
    } else {
      setBullets(prev => [...prev, { id: now, x: bulletX, y: bulletY }]);
    }
    lastFireTime.current = now;
  }, [hasTripleShot]);

  const spawnEnemy = useCallback(() => {
    const now = Date.now();
    const spawnInterval = Math.max(200, ENEMY_SPAWN_RATE - Math.floor(stateRef.current.score / 500) * 100);
    
    if (now - lastEnemyTime.current > spawnInterval) {
      const type: EnemyType = Math.random() > 0.8 ? 'TANK' : 'REGULAR';
      const health = type === 'TANK' ? 3 : 1;
      
      setEnemies(prev => [
        ...prev, 
        { 
          id: now, 
          x: Math.random() * (GAME_WIDTH - ENEMY_SIZE), 
          y: -ENEMY_SIZE,
          type,
          health,
          maxHealth: health
        }
      ]);
      lastEnemyTime.current = now;

      // Randomly spawn powerup
      if (Math.random() > 0.9) {
        setPowerUps(prev => [...prev, { id: now + 5, x: Math.random() * (GAME_WIDTH - 20), y: -20 }]);
      }
    }
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(INITIAL_LIVES);
    setBullets([]);
    setEnemies([]);
    setPowerUps([]);
    setHasTripleShot(false);
    setStatus('PLAYING');
    setPlayerPos({ x: GAME_WIDTH / 2 - PLAYER_SIZE / 2, y: GAME_HEIGHT - 60 });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (tripleShotTimer.current) clearTimeout(tripleShotTimer.current);
    };
  }, []);

  const update = useCallback(() => {
    if (stateRef.current.status !== 'PLAYING') return;

    // 1. Move Player
    let dx = 0;
    let dy = 0;
    if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('KeyA')) dx -= PLAYER_SPEED;
    if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('KeyD')) dx += PLAYER_SPEED;
    if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('KeyW')) dy -= PLAYER_SPEED;
    if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('KeyS')) dy += PLAYER_SPEED;

    if (dx !== 0 || dy !== 0) {
      setPlayerPos(prev => ({
        x: Math.max(0, Math.min(prev.x + dx, GAME_WIDTH - PLAYER_SIZE)),
        y: Math.max(0, Math.min(prev.y + dy, GAME_HEIGHT - PLAYER_SIZE))
      }));
    }

    // 2. Auto-fire
    if (keysPressed.current.has('Space')) {
      shoot();
    }

    // 3. Move Bullets
    setBullets(prev => prev
      .map(b => ({ ...b, y: b.y - BULLET_SPEED }))
      .filter(b => b.y > -BULLET_SIZE)
    );

    // 4. Move Enemies & Collision Detection
    const currentEnemySpeed = ENEMY_SPEED + Math.floor(stateRef.current.score / 1000);
    
    setEnemies(prevEnemies => {
      const newEnemies: GameObject[] = [];
      const currentBullets = stateRef.current.bullets;
      const hitBulletIds = new Set<number>();
      let playerHit = false;

      for (const enemy of prevEnemies) {
        let alive = true;
        let enemyY = enemy.y + currentEnemySpeed;
        
        // Check bullet collisions
        for (const bullet of currentBullets) {
          if (hitBulletIds.has(bullet.id)) continue;

          if (
            bullet.x < enemy.x + ENEMY_SIZE &&
            bullet.x + BULLET_SIZE > enemy.x &&
            bullet.y < enemy.y + ENEMY_SIZE &&
            bullet.y + BULLET_SIZE > enemy.y
          ) {
            hitBulletIds.add(bullet.id);
            const newHealth = (enemy.health || 1) - 1;
            if (newHealth <= 0) {
              alive = false;
              setScore(s => s + (enemy.type === 'TANK' ? 50 : 10));
              break;
            } else {
              enemy.health = newHealth;
            }
          }
        }

        // Check player collision
        if (alive && 
          stateRef.current.playerPos.x < enemy.x + ENEMY_SIZE &&
          stateRef.current.playerPos.x + PLAYER_SIZE > enemy.x &&
          stateRef.current.playerPos.y < enemy.y + ENEMY_SIZE &&
          stateRef.current.playerPos.y + PLAYER_SIZE > enemy.y
        ) {
          playerHit = true;
          alive = false; // Enemy destroyed on impact
        }

        if (alive && enemyY < GAME_HEIGHT) {
          newEnemies.push({ ...enemy, y: enemyY });
        }
      }

      if (playerHit) {
        setLives(l => {
          const nextLives = l - 1;
          if (nextLives <= 0) {
            setStatus('GAME_OVER');
          }
          return nextLives;
        });
      }

      if (hitBulletIds.size > 0) {
        setBullets(bs => bs.filter(b => !hitBulletIds.has(b.id)));
      }

      return newEnemies;
    });

    // 5. Move Power-ups & Collision Detection
    setPowerUps(prevPowerUps => {
      const newPowerUps: GameObject[] = [];
      const { playerPos } = stateRef.current;

      for (const p of prevPowerUps) {
        const newY = p.y + 2; // Power-ups fall slowly
        
        // Collision with player (approximate 25x25 size for powerup)
        if (
          playerPos.x < p.x + 25 &&
          playerPos.x + PLAYER_SIZE > p.x &&
          playerPos.y < newY + 25 &&
          playerPos.y + PLAYER_SIZE > newY
        ) {
          setHasTripleShot(true);
          if (tripleShotTimer.current) clearTimeout(tripleShotTimer.current);
          tripleShotTimer.current = setTimeout(() => {
            setHasTripleShot(false);
          }, 10000); // 10 seconds of triple shot
          continue; // Power-up collected
        }

        if (newY < GAME_HEIGHT) {
          newPowerUps.push({ ...p, y: newY });
        }
      }
      return newPowerUps;
    });

    spawnEnemy();
    requestRef.current = requestAnimationFrame(update);
  }, [shoot, spawnEnemy]);

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
    lives,
    level: Math.floor(score / 500) + 1,
    status,
    powerUps,
    hasTripleShot,
    shoot,
    resetGame
  };
};
