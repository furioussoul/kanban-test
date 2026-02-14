import React, { memo } from 'react';
import { PLAYER_SIZE } from '../constants';
import { PlayerPos } from '../types';

interface PlayerProps {
  pos: PlayerPos;
}

const Player: React.FC<PlayerProps> = ({ pos }) => {
  return (
    <div style={{
      position: 'absolute',
      left: pos.x,
      top: pos.y,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      backgroundColor: '#4A90E2',
      borderRadius: '50% 50% 10% 10%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px',
      boxShadow: '0 0 15px #4A90E2',
      border: '2px solid #FFF',
      zIndex: 10,
      filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))'
    }}>
      🚀
      <div style={{
        position: 'absolute',
        bottom: '-10px',
        width: '10px',
        height: '15px',
        background: 'linear-gradient(to bottom, #FFD93D, transparent)',
        borderRadius: '50%',
        animation: 'thrust 0.1s infinite alternate'
      }} />
      <style>{`
        @keyframes thrust {
          from { height: 10px; opacity: 0.8; }
          to { height: 20px; opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default memo(Player);
