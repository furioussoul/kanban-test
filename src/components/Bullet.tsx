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
      height: BULLET_SIZE,
      backgroundColor: '#f1c40f',
      borderRadius: '50%'
    }} />
  );
};

export default memo(Bullet);
