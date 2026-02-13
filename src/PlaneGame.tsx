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
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
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
    if (gameOver) return;
    
    const interval = setInterval(() => {
      setEnemies(prevEnemies => {
        let collisionOccurred = false;
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
          
          if (
            playerPos.x < enemy.x + ENEMY_SIZE &&
            playerPos.x + PLAYER_SIZE > enemy.x &&
            playerPos.y < enemy.y + ENEMY_SIZE &&
            playerPos.y + PLAYER_SIZE > enemy.y
          ) {
            collisionOccurred = true;
          }
          
          return true;
        });

        if (collisionOccurred) {
          setGameOver(true);
        }
        return newEnemies;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [bullets, playerPos.x, playerPos.y, gameOver]);

  const resetGame = () => {
    setScore(0);
    setBullets([]);
    setEnemies([]);
    setGameOver(false);
    setPlayerPos({ x: GAME_WIDTH / 2 - PLAYER_SIZE / 2, y: GAME_HEIGHT - 60 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#222', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'Arial' }}>
      <h1>Plane Shooter</h1>
      <p>Score: {score} | Move mouse to fly, click to shoot</p>
      
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
          cursor: 'crosshair',
          border: '4px solid #444',
          borderRadius: '8px'
        }}
      >
        {/* Player */}
        <div style={{
          position: 'absolute',
          left: playerPos.x,
          top: playerPos.y,
          width: PLAYER_SIZE,
          height: PLAYER_SIZE,
          backgroundColor: '#3498db',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '20px'
        }}>✈️</div>

        {/* Bullets */}
        {bullets.map(b => (
          <div key={b.id} style={{
            position: 'absolute',
            left: b.x,
            top: b.y,
            width: BULLET_SIZE,
            height: BULLET_SIZE,
            backgroundColor: '#f1c40f',
            borderRadius: '50%'
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
            backgroundColor: '#e74c3c',
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '15px'
          }}>👾</div>
        ))}

        {gameOver && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            zIndex: 10
          }}>
            <h2 style={{ fontSize: '40px', color: '#e74c3c' }}>GAME OVER</h2>
            <p style={{ fontSize: '24px' }}>Final Score: {score}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); resetGame(); }} 
              style={{ 
                padding: '12px 30px', 
                fontSize: '18px', 
                cursor: 'pointer',
                backgroundColor: '#2ecc71',
                border: 'none',
                color: 'white',
                borderRadius: '5px',
                marginTop: '20px'
              }}
            >Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaneGame;
