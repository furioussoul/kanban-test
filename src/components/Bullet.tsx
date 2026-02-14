import React, { memo } from 'react';
import { BULLET_SIZE } from '../constants';
import { GameObject } from '../types';

interface BulletProps {
  bullet: GameObject;
}

const Bullet: React.FC<BulletProps> = ({ bullet }) => {
  return (
    <div style={{
      position: 'absolute',
      left: bullet.x,
      top: bullet.y,
      width: BULLET_SIZE,
      height: BULLET_SIZE * 2,
      background: 'linear-gradient(to bottom, #F5A623, #FFD93D)',
      borderRadius: '5px',
      boxShadow: '0 0 8px #F5A623',
      zIndex: 5
    }} />
  );
};

export default memo(Bullet);
