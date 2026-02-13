import React, { useState, useEffect, useCallback, useRef } from 'react';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 40;
const ENEMY_SIZE = 30;
const BULLET_SIZE = 10;

interface GameObject {
  id: number;
  x: number;
  y: number;
}

const PlaneGame: React.FC = () => {
  const [playerPos, setPlayerPos] = useState({ x: GAME_WIDTH / 2 - PLAYER_SIZE / 2, y: GAME_HEIGHT - 60 });
  const [bullets, setBullets] = useState<GameObject[]>([]);
  const [enemies, setEnemies] = useState<GameObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef<number>();
  const lastEnemyTime = useRef<number>(0);

  const movePlayer = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameOver) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    let newX = clientX - rect.left - PLAYER_SIZE / 2;
    newX = Math.max(0, Math.min(newX, GAME_WIDTH - PLAYER_SIZE));
    setPlayerPos(prev => ({ ...prev, x: newX }));
  };

  const spawnEnemy = useCallback(() => {
    const now = Date.now();
    if (now - lastEnemyTime.current > 1000) {
      setEnemies(prev => [...prev, { id: now, x: Math.random() * (GAME_WIDTH - ENEMY_SIZE), y: -ENEMY_SIZE }]);
      lastEnemyTime.current = now;
    }
  }, []);

  const shoot = useCallback(() => {
    setBullets(prev => [...prev, { id: Date.now(), x: playerPos.x + PLAYER_SIZE / 2 - BULLET_SIZE / 2, y: playerPos.y }]);
  }, [playerPos.x, playerPos.y]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') shoot();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shoot]);

  useEffect(() => {
    if (gameOver) return;

    const update = () => {
      // Move bullets
      setBullets(prev => prev.map(b => ({ ...b, y: b.y - 7 })).filter(b => b.y > -BULLET_SIZE));

      // Move enemies
      setEnemies(prev => prev.map(e => ({ ...e, y: e.y + 3 })).filter(e => e.y < GAME_HEIGHT));

      // Spawn enemies
      spawnEnemy();

      gameLoopRef.current = requestAnimationFrame(update);
    };

    gameLoopRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(gameLoopRef.current!);
  }, [gameOver, spawnEnemy]);

  // Collision detection
  useEffect(() => {
    setEnemies(prevEnemies => {
      let hit = false;
      const newEnemies = prevEnemies.filter(enemy => {
        const bulletHit = bullets.find(bullet => 
          bullet.x < enemy.x + ENEMY_SIZE &&
          bullet.x + BULLET_SIZE > enemy.x &&
          bullet.y < enemy.y + ENEMY_SIZE &&
          bullet.y + BULLET_SIZE > enemy.y
        );
        if (bulletHit) {
          setScore(s => s + 10);
          setBullets(bs => bs.filter(b => b.id !== bulletHit.id));
          return false;
        }
        
        // Player collision
        if (
          playerPos.x < enemy.x + ENEMY_SIZE &&
          playerPos.x + PLAYER_SIZE > enemy.x &&
          playerPos.y < enemy.y + ENEMY_SIZE &&
          playerPos.y + PLAYER_SIZE > enemy.y
        ) {
          setGameOver(true);
        }
        
        return true;
      });
      return newEnemies;
    });
  }, [bullets, playerPos.x, playerPos.y]);

  const resetGame = () => {
    setScore(0);
    setBullets([]);
    setEnemies([]);
    setGameOver(false);
    setPlayerPos({ x: GAME_WIDTH / 2 - PLAYER_SIZE / 2, y: GAME_HEIGHT - 60 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#222', minHeight: '100vh', color: 'white', padding: '20px' }}>
      <h1>Plane Shooter</h1>
      <p>Score: {score} | Use Mouse to move, Space to shoot</p>
      
      <div 
        onMouseMove={movePlayer}
        onTouchMove={movePlayer}
        onClick={shoot}
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          backgroundColor: '#000',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'none',
          border: '2px solid #444'
        }}
      >
        {/* Player */}
        <div style={{
          position: 'absolute',
          left: playerPos.x,
          top: playerPos.y,
          width: PLAYER_SIZE,
          height: PLAYER_SIZE,
          backgroundColor: '#00f',
          borderRadius: '5px'
        }} />

        {/* Bullets */}
        {bullets.map(b => (
          <div key={b.id} style={{
            position: 'absolute',
            left: b.x,
            top: b.y,
            width: BULLET_SIZE,
            height: BULLET_SIZE,
            backgroundColor: '#ff0'
          }} />
        ))}

        {/* Enemies */}
        {enemies.map(e => (
          <div key={e.id} style={{
            position: 'absolute',
            left: e.x,
            top: e.y,
            width: ENEMY_SIZE,
            height: ENEMY_SIZE,
            backgroundColor: '#f00'
          }} />
        ))}

        {gameOver && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
          }}>
            <h2>GAME OVER</h2>
            <button onClick={resetGame} style={{ padding: '10px 20px', cursor: 'pointer' }}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaneGame;
