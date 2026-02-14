import React, { memo } from 'react';
import { ENEMY_SIZE } from '../constants';
import { GameObject } from '../types';

interface EnemyProps {
  enemy: GameObject;
}

const Enemy: React.FC<EnemyProps> = ({ enemy }) => {
  const isTank = enemy.type === 'TANK';
  const size = isTank ? ENEMY_SIZE * 1.5 : ENEMY_SIZE;
  const healthPercent = ((enemy.health || 1) / (enemy.maxHealth || 1)) * 100;

  return (
    <div style={{
      position: 'absolute',
      left: enemy.x - (isTank ? ENEMY_SIZE * 0.25 : 0),
      top: enemy.y - (isTank ? ENEMY_SIZE * 0.25 : 0),
      width: size,
      height: size,
      backgroundColor: isTank ? '#5D4037' : '#e74c3c',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: isTank ? '24px' : '20px',
      border: isTank ? '2px solid #3E2723' : 'none',
      transition: 'top 0.016s linear, left 0.016s linear',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
    }}>
      {isTank ? '🚜' : '👾'}
      {isTank && enemy.health && enemy.health < (enemy.maxHealth || 1) && (
        <div style={{
          width: '80%',
          height: '4px',
          backgroundColor: '#333',
          position: 'absolute',
          bottom: '-10px',
          borderRadius: '2px'
        }}>
          <div style={{
            width: `${healthPercent}%`,
            height: '100%',
            backgroundColor: '#2ecc71',
            borderRadius: '2px'
          }} />
        </div>
      )}
    </div>
  );
};

export default memo(Enemy);
