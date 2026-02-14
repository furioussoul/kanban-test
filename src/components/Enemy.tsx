import React, { memo } from 'react';
import { ENEMY_SIZE } from '../constants';
import { GameObject } from '../types';

interface EnemyProps {
  enemy: GameObject;
}

const Enemy: React.FC<EnemyProps> = ({ enemy }) => {
  return (
    <div style={{
      position: 'absolute',
      left: enemy.x,
      top: enemy.y,
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
      backgroundColor: '#e74c3c',
      borderRadius: '5px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '15px'
    }}>👾</div>
  );
};

export default memo(Enemy);
