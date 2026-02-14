import React from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import Player from './components/Player';
import Bullet from './components/Bullet';
import Enemy from './components/Enemy';
import GameOverOverlay from './components/GameOverOverlay';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SIZE } from './constants';

// Main Game Component
const PlaneGame: React.FC = () => { // Initialized Game
  const {
    playerPos,
    setPlayerPos,
    bullets,
    enemies,
    score,
    lives,
    level,
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
      backgroundColor: '#1a1a2e', 
      minHeight: '100vh', 
      color: 'white', 
      padding: '20px', 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      userSelect: 'none'
    }}>
      <h1 style={{ margin: '0 0 10px 0', textShadow: '0 0 10px #4A90E2' }}>ACE STRIKER</h1>
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '15px', 
        fontSize: '18px', 
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '10px 20px',
        borderRadius: '20px',
        border: '1px solid #444'
      }}>
        <span>LEVEL: <span style={{ color: '#4A90E2' }}>{level}</span></span>
        <span>SCORE: <span style={{ color: '#F5A623' }}>{score}</span></span>
        <span>LIVES: <span style={{ color: '#E94E77' }}>{'❤️'.repeat(lives)}</span></span>
      </div>
      
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

        {powerUps.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: 25,
            height: 25,
            backgroundColor: '#FFD700',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 0 10px #FFD700',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#000',
            animation: 'pulse 0.5s infinite alternate',
            zIndex: 8
          }}>
            W
          </div>
        ))}

        {hasTripleShot && (
          <div style={{
            position: 'absolute',
            top: 10,
            right: 10,
            padding: '5px 10px',
            backgroundColor: 'rgba(255, 215, 0, 0.3)',
            borderRadius: '5px',
            border: '1px solid #FFD700',
            color: '#FFD700',
            fontSize: '12px',
            zIndex: 20
          }}>
            TRIPLE SHOT ACTIVE!
          </div>
        )}

        <style>{`
          @keyframes pulse {
            from { transform: scale(1); opacity: 0.8; }
            to { transform: scale(1.2); opacity: 1; }
          }
        `}</style>

        {status === 'GAME_OVER' && (
          <GameOverOverlay score={score} onReset={resetGame} />
        )}
      </div>
    </div>
  );
};

export default PlaneGame;
