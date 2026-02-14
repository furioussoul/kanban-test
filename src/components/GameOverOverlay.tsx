import React from 'react';

interface GameOverOverlayProps {
  score: number;
  onReset: () => void;
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ score, onReset }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      zIndex: 10
    }}>
      <h2 style={{ fontSize: '40px', color: '#e74c3c' }}>GAME OVER</h2>
      <p style={{ fontSize: '24px', color: 'white' }}>Final Score: {score}</p>
      <button 
        onClick={(e) => { e.stopPropagation(); onReset(); }} 
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
  );
};

export default GameOverOverlay;
