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
      backgroundColor: '#3498db',
      borderRadius: '5px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px',
      transition: 'left 0.1s ease-out'
    }}>✈️</div>
  );
};

export default memo(Player);
