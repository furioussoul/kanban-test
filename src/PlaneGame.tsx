import React from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import Player from './components/Player';
import Bullet from './components/Bullet';
import Enemy from './components/Enemy';
import GameOverOverlay from './components/GameOverOverlay';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SIZE } from './constants';

const PlaneGame: React.FC = () => {
  const {
    playerPos,
    setPlayerPos,
    bullets,
    enemies,
    score,
    status,
    shoot,
    resetGame
  } = useGameEngine();

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (status !== 'PLAYING') return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    
    let newX = clientX - rect.left - PLAYER_SIZE / 2;
    let newY = clientY - rect.top - PLAYER_SIZE / 2;
    
    newX = Math.max(0, Math.min(newX, GAME_WIDTH - PLAYER_SIZE));
    newY = Math.max(0, Math.min(newY, GAME_HEIGHT - PLAYER_SIZE));
    
    setPlayerPos({ x: newX, y: newY });
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      backgroundColor: '#222', 
      minHeight: '100vh', 
      color: 'white', 
      padding: '20px', 
      fontFamily: 'Arial',
      userSelect: 'none'
    }}>
      <h1>Plane Shooter Pro</h1>
      <p>Score: {score} | WASD to move, Space/Click to shoot</p>
      
      <div 
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onClick={shoot}
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          backgroundColor: '#000',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'crosshair',
          border: '4px solid #444',
          borderRadius: '8px',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}
      >
        <Player pos={playerPos} />

        {bullets.map(b => (
          <Bullet key={b.id} bullet={b} />
        ))}

        {enemies.map(e => (
          <Enemy key={e.id} enemy={e} />
        ))}

        {status === 'GAME_OVER' && (
          <GameOverOverlay score={score} onReset={resetGame} />
        )}
      </div>
    </div>
  );
};

export default PlaneGame;
